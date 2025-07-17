import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, Users, MessageCircle, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupportGroups } from '../hooks/useSupportGroups';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

interface CreateGroupFormData {
  name: string;
  description: string;
  group_type: string;
  condition_focus?: string;
  is_private: boolean;
}

const SupportGroupsPage = () => {
  const navigate = useNavigate();
  const { 
    groups, 
    userMemberships, 
    loading, 
    joinGroup, 
    leaveGroup, 
    createGroup, 
    isUserMember,
    getGroupsByType,
    getJoinedGroups 
  } = useSupportGroups();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [createFormData, setCreateFormData] = useState<CreateGroupFormData>({
    name: '',
    description: '',
    group_type: 'general',
    condition_focus: '',
    is_private: false
  });

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || group.group_type === selectedType;
    return matchesSearch && matchesType;
  });

  const joinedGroups = getJoinedGroups();

  const handleJoinGroup = async (groupId: string) => {
    const success = await joinGroup(groupId);
    if (success) {
      toast.success('Successfully joined the group!');
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    const success = await leaveGroup(groupId);
    if (success) {
      toast.success('Left the group successfully');
    }
  };

  const handleCreateGroup = async () => {
    if (!createFormData.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    const newGroup = await createGroup(createFormData);
    if (newGroup) {
      toast.success('Group created successfully!');
      setShowCreateDialog(false);
      setCreateFormData({
        name: '',
        description: '',
        group_type: 'general',
        condition_focus: '',
        is_private: false
      });
    }
  };

  const getGroupTypeLabel = (type: string) => {
    switch (type) {
      case 'condition_specific': return 'Condition';
      case 'general': return 'General';
      case 'caregiver': return 'Caregiver';
      default: return type;
    }
  };

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'condition_specific': return 'bg-blue-100 text-blue-800';
      case 'general': return 'bg-green-100 text-green-800';
      case 'caregiver': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ojas-bg-light p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ojas-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ojas-text-secondary">Loading support groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ojas-bg-light">
      {/* Header */}
      <div className="bg-white border-b border-ojas-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-ojas-text-primary">Support Groups</h1>
              <p className="text-sm text-ojas-text-secondary">Connect with others in your health journey</p>
            </div>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-ojas-primary hover:bg-ojas-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Support Group</DialogTitle>
                <DialogDescription>
                  Create a new support group to connect with others
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                    placeholder="Describe your group's purpose"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Group Type</Label>
                  <Select
                    value={createFormData.group_type}
                    onValueChange={(value) => setCreateFormData({ ...createFormData, group_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Support</SelectItem>
                      <SelectItem value="condition_specific">Condition Specific</SelectItem>
                      <SelectItem value="caregiver">Caregiver Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {createFormData.group_type === 'condition_specific' && (
                  <div>
                    <Label htmlFor="condition">Condition Focus</Label>
                    <Input
                      id="condition"
                      value={createFormData.condition_focus || ''}
                      onChange={(e) => setCreateFormData({ ...createFormData, condition_focus: e.target.value })}
                      placeholder="e.g., Diabetes, Hypertension"
                    />
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="private"
                    checked={createFormData.is_private}
                    onCheckedChange={(checked) => setCreateFormData({ ...createFormData, is_private: checked })}
                  />
                  <Label htmlFor="private">Private Group</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGroup}>
                    Create Group
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ojas-text-secondary w-4 h-4" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="condition_specific">Condition</SelectItem>
              <SelectItem value="caregiver">Caregiver</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* My Groups */}
        {joinedGroups.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-ojas-text-primary mb-3">My Groups</h2>
            <div className="space-y-3">
              {joinedGroups.map((group) => (
                <Card key={group.id} className="border-ojas-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-ojas-text-primary">{group.name}</h3>
                          <Badge className={getGroupTypeColor(group.group_type)}>
                            {getGroupTypeLabel(group.group_type)}
                          </Badge>
                          {group.is_private && (
                            <Badge variant="outline">Private</Badge>
                          )}
                        </div>
                        {group.description && (
                          <p className="text-sm text-ojas-text-secondary mb-2">{group.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-ojas-text-secondary">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{group.member_count} members</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>View Posts</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeaveGroup(group.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Leave
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Discover Groups */}
        <div>
          <h2 className="text-lg font-semibold text-ojas-text-primary mb-3">Discover Groups</h2>
          <div className="space-y-3">
            {filteredGroups.filter(group => !isUserMember(group.id)).map((group) => (
              <Card key={group.id} className="border-ojas-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-ojas-text-primary">{group.name}</h3>
                        <Badge className={getGroupTypeColor(group.group_type)}>
                          {getGroupTypeLabel(group.group_type)}
                        </Badge>
                        {group.is_private && (
                          <Badge variant="outline">Private</Badge>
                        )}
                      </div>
                      {group.description && (
                        <p className="text-sm text-ojas-text-secondary mb-2">{group.description}</p>
                      )}
                      {group.condition_focus && (
                        <p className="text-sm text-ojas-primary mb-2">Focus: {group.condition_focus}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-ojas-text-secondary">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{group.member_count} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleJoinGroup(group.id)}
                      className="bg-ojas-primary hover:bg-ojas-primary/90"
                    >
                      Join Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-ojas-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ojas-text-primary mb-2">No groups found</h3>
            <p className="text-ojas-text-secondary mb-4">Try adjusting your search or create a new group</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportGroupsPage;