
import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Heart, Reply, MoreHorizontal, Pin, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface SupportGroupPost {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
  user_id: string;
  group_id: string;
  post_type: string;
  anonymous: boolean;
  pinned: boolean;
  reply_count: number;
  moderated: boolean;
  updated_at: string;
}

interface SupportGroupPostsProps {
  groupId: string;
  canPost: boolean;
}

const SupportGroupPosts: React.FC<SupportGroupPostsProps> = ({ groupId, canPost }) => {
  const [posts, setPosts] = useState<SupportGroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    post_type: 'discussion',
    anonymous: false
  });
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (groupId) {
      loadPosts();
    }
  }, [groupId]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_group_posts')
        .select('*')
        .eq('group_id', groupId)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!user || !newPost.content.trim()) return;

    try {
      setSubmitting(true);
      const { data, error } = await supabase
        .from('support_group_posts')
        .insert({
          group_id: groupId,
          user_id: user.id,
          title: newPost.title.trim() || null,
          content: newPost.content.trim(),
          post_type: newPost.post_type,
          anonymous: newPost.anonymous
        })
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => [data, ...prev]);
      setNewPost({
        title: '',
        content: '',
        post_type: 'discussion',
        anonymous: false
      });
      setShowNewPost(false);
      
      toast({
        title: "Success",
        description: "Your post has been shared!"
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / 60000);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-ojas-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Post Button/Form */}
      {canPost && (
        <div className="bg-white rounded-xl shadow-ojas-soft p-6">
          {!showNewPost ? (
            <Button
              onClick={() => setShowNewPost(true)}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-ojas-primary-blue text-white hover:bg-ojas-primary-blue-hover rounded-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Share your thoughts</span>
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ojas-charcoal-gray">New Post</h3>
                <Button
                  onClick={() => setShowNewPost(false)}
                  variant="ghost"
                  size="sm"
                  className="text-ojas-slate-gray hover:text-ojas-charcoal-gray"
                >
                  Cancel
                </Button>
              </div>

              <Input
                placeholder="Post title (optional)"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="border-ojas-cloud-silver focus:border-ojas-primary-blue"
              />

              <Textarea
                placeholder="Share your thoughts, experiences, or questions..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[120px] border-ojas-cloud-silver focus:border-ojas-primary-blue resize-none"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 text-sm text-ojas-slate-gray">
                    <input
                      type="checkbox"
                      checked={newPost.anonymous}
                      onChange={(e) => setNewPost(prev => ({ ...prev, anonymous: e.target.checked }))}
                      className="w-4 h-4 text-ojas-primary-blue border-ojas-cloud-silver rounded focus:ring-ojas-primary-blue"
                    />
                    <span>Post anonymously</span>
                  </label>
                </div>

                <Button
                  onClick={handleSubmitPost}
                  disabled={!newPost.content.trim() || submitting}
                  className="px-6 py-2 bg-ojas-primary-blue text-white hover:bg-ojas-primary-blue-hover rounded-lg disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-ojas-slate-gray mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-ojas-charcoal-gray mb-2">No posts yet</h3>
          <p className="text-ojas-slate-gray">
            {canPost ? 'Be the first to start a conversation!' : 'Join this group to participate in discussions.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-ojas-soft p-6 hover:shadow-ojas-medium transition-shadow">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-ojas-primary-blue/10 rounded-full flex items-center justify-center">
                    {post.anonymous ? (
                      <span className="text-sm font-medium text-ojas-primary-blue">A</span>
                    ) : (
                      <span className="text-sm font-medium text-ojas-primary-blue">U</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ojas-charcoal-gray">
                      {post.anonymous ? 'Anonymous' : 'Community Member'}
                    </p>
                    <p className="text-xs text-ojas-slate-gray">
                      {formatRelativeTime(post.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {post.pinned && (
                    <Pin className="w-4 h-4 text-ojas-soft-gold" />
                  )}
                  <Button variant="ghost" size="sm" className="text-ojas-slate-gray hover:text-ojas-charcoal-gray">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Post Content */}
              {post.title && (
                <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-2">{post.title}</h3>
              )}
              <p className="text-ojas-charcoal-gray mb-4 leading-relaxed">{post.content}</p>

              {/* Post Actions */}
              <div className="flex items-center space-x-6 pt-4 border-t border-ojas-cloud-silver">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-ojas-slate-gray hover:text-ojas-vibrant-coral">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Support</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-ojas-slate-gray hover:text-ojas-primary-blue">
                  <Reply className="w-4 h-4" />
                  <span className="text-sm">Reply</span>
                  {post.reply_count > 0 && (
                    <span className="text-xs">({post.reply_count})</span>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportGroupPosts;
