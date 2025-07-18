
import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Heart, Reply, MoreHorizontal, Pin, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface SupportGroupPost {
  id: string;
  title?: string;
  content: string;
  post_type: string;
  anonymous: boolean;
  pinned: boolean;
  reply_count: number;
  created_at: string;
  user_id: string;
  group_id: string;
}

interface SupportGroupPostsProps {
  groupId: string;
  groupName: string;
}

const SupportGroupPosts: React.FC<SupportGroupPostsProps> = ({ groupId, groupName }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<SupportGroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    post_type: 'discussion',
    anonymous: false
  });

  useEffect(() => {
    loadPosts();
  }, [groupId]);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('support_group_posts')
        .select('*')
        .eq('group_id' as any, groupId)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data as any) || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.content.trim()) {
      toast.error('Post content is required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('support_group_posts')
        .insert({
          group_id: groupId,
          user_id: user?.id,
          title: newPost.title.trim() || null,
          content: newPost.content.trim(),
          post_type: newPost.post_type,
          anonymous: newPost.anonymous
        } as any)
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => [(data as any), ...prev]);
      setNewPost({
        title: '',
        content: '',
        post_type: 'discussion',
        anonymous: false
      });
      setShowCreateDialog(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return '❓';
      case 'resource': return '📚';
      case 'announcement': return '📢';
      default: return '💬';
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'resource': return 'bg-green-100 text-green-800';
      case 'announcement': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="w-8 h-8 border-4 border-ojas-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-ojas-text-secondary">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ojas-text-primary">
          {groupName} Discussion
        </h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-ojas-primary hover:bg-ojas-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Share your thoughts with the {groupName} community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="post-type">Post Type</Label>
                <Select
                  value={newPost.post_type}
                  onValueChange={(value) => setNewPost({ ...newPost, post_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discussion">Discussion</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="resource">Resource</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="What would you like to share?"
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={newPost.anonymous}
                  onCheckedChange={(checked) => setNewPost({ ...newPost, anonymous: checked })}
                />
                <Label htmlFor="anonymous">Post anonymously</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createPost}>
                  Create Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id} className="border-ojas-border">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Post Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getPostTypeIcon(post.post_type)}</span>
                    <Badge className={getPostTypeColor(post.post_type)}>
                      {post.post_type}
                    </Badge>
                    {post.pinned && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        <Pin className="w-3 h-3 mr-1" />
                        Pinned
                      </Badge>
                    )}
                    {post.anonymous && (
                      <Badge variant="outline" className="text-gray-600">
                        Anonymous
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post Content */}
                <div>
                  {post.title && (
                    <h3 className="font-medium text-ojas-text-primary mb-2">{post.title}</h3>
                  )}
                  <p className="text-ojas-text-secondary whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Post Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-ojas-border">
                  <div className="flex items-center space-x-4 text-sm text-ojas-text-secondary">
                    <span>{formatTimeAgo(post.created_at)}</span>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.reply_count} replies</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-ojas-text-secondary hover:text-ojas-primary">
                      <Heart className="w-4 h-4 mr-1" />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" className="text-ojas-text-secondary hover:text-ojas-primary">
                      <Reply className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-ojas-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-ojas-text-primary mb-2">No posts yet</h3>
          <p className="text-ojas-text-secondary mb-4">Be the first to start a conversation in this group</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default SupportGroupPosts;
