import React, { useState } from 'react';
import { ArrowLeft, Users, Plus, Shield, Globe, Lock, MessageCircle, Heart } from 'lucide-react';
import { useSupportGroups } from '../hooks/useSupportGroups';

interface SupportGroupsProps {
  onBack: () => void;
}

const SupportGroups: React.FC<SupportGroupsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'joined' | 'create'>('discover');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    group_type: 'general',
    condition_focus: '',
    is_private: false
  });

  const {
    groups,
    loading,
    joinGroup,
    leaveGroup,
    createGroup,
    isUserMember,
    getGroupsByType,
    getJoinedGroups
  } = useSupportGroups();

  const groupTypes = [
    { id: 'general', name: 'General Support', icon: Heart, description: 'General wellness discussions' },
    { id: 'condition_specific', name: 'Condition Specific', icon: Shield, description: 'Focused on specific conditions' },
    { id: 'caregiver', name: 'Caregiver Support', icon: Users, description: 'For caregivers and family members' }
  ];

  const handleCreateGroup = async () => {
    const result = await createGroup(newGroupData);
    if (result) {
      setShowCreateForm(false);
      setNewGroupData({
        name: '',
        description: '',
        group_type: 'general',
        condition_focus: '',
        is_private: false
      });
      setActiveTab('joined');
    }
  };

  const getGroupTypeInfo = (type: string) => {
    return groupTypes.find(t => t.id === type) || groupTypes[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ojas-mist-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-ojas-cloud-silver rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-ojas-cloud-silver rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ojas-mist-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200 shadow-ojas-soft"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-ojas-charcoal-gray" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-ojas-charcoal-gray">Support Communities</h1>
            <p className="text-ojas-slate-gray">Connect with others who understand your journey</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-ojas-soft border border-ojas-cloud-silver">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'discover'
                ? 'bg-ojas-primary-blue text-white'
                : 'text-ojas-charcoal-gray hover:bg-ojas-primary-blue/10'
            }`}
          >
            <Globe className="w-5 h-5 mx-auto mb-1" />
            Discover
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'joined'
                ? 'bg-ojas-primary-blue text-white'
                : 'text-ojas-charcoal-gray hover:bg-ojas-primary-blue/10'
            }`}
          >
            <Users className="w-5 h-5 mx-auto mb-1" />
            My Groups
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-ojas-primary-blue text-white'
                : 'text-ojas-charcoal-gray hover:bg-ojas-primary-blue/10'
            }`}
          >
            <Plus className="w-5 h-5 mx-auto mb-1" />
            Create
          </button>
        </div>

        {/* Content */}
        {activeTab === 'discover' && (
          <div className="space-y-6">
            {groupTypes.map(type => {
              const typeGroups = getGroupsByType(type.id);
              if (typeGroups.length === 0) return null;

              const IconComponent = type.icon;
              
              return (
                <div key={type.id} className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent className="w-6 h-6 text-ojas-primary-blue" />
                    <h3 className="text-xl font-semibold text-ojas-charcoal-gray">{type.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {typeGroups.slice(0, 4).map(group => (
                      <div key={group.id} className="border border-ojas-cloud-silver rounded-xl p-4 hover:border-ojas-primary-blue/30 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-ojas-charcoal-gray mb-1 flex items-center gap-2">
                              {group.name}
                              {group.is_private && <Lock className="w-4 h-4 text-ojas-slate-gray" />}
                            </h4>
                            <p className="text-sm text-ojas-slate-gray mb-2">{group.description}</p>
                            {group.condition_focus && (
                              <span className="inline-block px-2 py-1 bg-ojas-soft-gold/20 text-ojas-soft-gold text-xs rounded-md">
                                {group.condition_focus}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-ojas-slate-gray">
                            <span>{group.member_count} members</span>
                            {group.moderated && (
                              <span className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Moderated
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => isUserMember(group.id) ? leaveGroup(group.id) : joinGroup(group.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                              isUserMember(group.id)
                                ? 'bg-ojas-vibrant-coral/20 text-ojas-vibrant-coral hover:bg-ojas-vibrant-coral/30'
                                : 'bg-ojas-primary-blue text-white hover:bg-ojas-primary-blue-hover'
                            }`}
                          >
                            {isUserMember(group.id) ? 'Leave' : 'Join'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'joined' && (
          <div className="space-y-4">
            {getJoinedGroups().length === 0 ? (
              <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-12 text-center">
                <MessageCircle className="w-16 h-16 text-ojas-slate-gray mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-ojas-charcoal-gray mb-2">
                  No groups joined yet
                </h3>
                <p className="text-ojas-slate-gray mb-6">
                  Discover communities that match your interests and connect with others.
                </p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-6 py-3 bg-ojas-primary-blue text-white rounded-xl font-medium hover:bg-ojas-primary-blue-hover transition-colors"
                >
                  Browse Groups
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getJoinedGroups().map(group => {
                  const typeInfo = getGroupTypeInfo(group.group_type);
                  const IconComponent = typeInfo.icon;
                  
                  return (
                    <div key={group.id} className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <IconComponent className="w-6 h-6 text-ojas-primary-blue mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-ojas-charcoal-gray mb-1 flex items-center gap-2">
                            {group.name}
                            {group.is_private && <Lock className="w-4 h-4 text-ojas-slate-gray" />}
                          </h3>
                          <p className="text-sm text-ojas-slate-gray">{group.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-ojas-slate-gray">{group.member_count} members</span>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-ojas-primary-blue text-white rounded-lg text-sm font-medium hover:bg-ojas-primary-blue-hover transition-colors">
                            View Posts
                          </button>
                          <button
                            onClick={() => leaveGroup(group.id)}
                            className="px-4 py-2 bg-ojas-vibrant-coral/20 text-ojas-vibrant-coral rounded-lg text-sm font-medium hover:bg-ojas-vibrant-coral/30 transition-colors"
                          >
                            Leave
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-white rounded-2xl shadow-ojas-soft border border-ojas-cloud-silver p-8">
            <h3 className="text-xl font-semibold text-ojas-charcoal-gray mb-6">Create a New Community</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-ojas-charcoal-gray mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={newGroupData.name}
                  onChange={(e) => setNewGroupData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-ojas-cloud-silver rounded-xl focus:outline-none focus:ring-2 focus:ring-ojas-primary-blue focus:border-transparent"
                  placeholder="Enter group name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ojas-charcoal-gray mb-2">
                  Description
                </label>
                <textarea
                  value={newGroupData.description}
                  onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-ojas-cloud-silver rounded-xl focus:outline-none focus:ring-2 focus:ring-ojas-primary-blue focus:border-transparent resize-none"
                  placeholder="Describe your community..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ojas-charcoal-gray mb-2">
                  Group Type
                </label>
                <select
                  value={newGroupData.group_type}
                  onChange={(e) => setNewGroupData(prev => ({ ...prev, group_type: e.target.value }))}
                  className="w-full p-3 border border-ojas-cloud-silver rounded-xl focus:outline-none focus:ring-2 focus:ring-ojas-primary-blue focus:border-transparent"
                >
                  {groupTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              {newGroupData.group_type === 'condition_specific' && (
                <div>
                  <label className="block text-sm font-medium text-ojas-charcoal-gray mb-2">
                    Condition Focus
                  </label>
                  <input
                    type="text"
                    value={newGroupData.condition_focus}
                    onChange={(e) => setNewGroupData(prev => ({ ...prev, condition_focus: e.target.value }))}
                    className="w-full p-3 border border-ojas-cloud-silver rounded-xl focus:outline-none focus:ring-2 focus:ring-ojas-primary-blue focus:border-transparent"
                    placeholder="e.g., Parkinson's Disease, Multiple Sclerosis..."
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_private"
                  checked={newGroupData.is_private}
                  onChange={(e) => setNewGroupData(prev => ({ ...prev, is_private: e.target.checked }))}
                  className="w-5 h-5 text-ojas-primary-blue bg-white border border-ojas-cloud-silver rounded focus:ring-ojas-primary-blue focus:ring-2"
                />
                <label htmlFor="is_private" className="text-sm text-ojas-charcoal-gray">
                  Make this a private group (invitation only)
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setActiveTab('discover')}
                  className="flex-1 px-6 py-3 bg-ojas-cloud-silver text-ojas-charcoal-gray rounded-xl font-medium hover:bg-ojas-slate-gray/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroupData.name || !newGroupData.description}
                  className="flex-1 px-6 py-3 bg-ojas-primary-blue text-white rounded-xl font-medium hover:bg-ojas-primary-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Community Guidelines */}
        <div className="mt-12 bg-ojas-primary-blue/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-ojas-charcoal-gray mb-3">Community Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-ojas-slate-gray">
            <div className="flex items-start gap-2">
              <Heart className="w-4 h-4 text-ojas-primary-blue mt-1 flex-shrink-0" />
              <span>Be respectful and supportive</span>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-ojas-primary-blue mt-1 flex-shrink-0" />
              <span>Protect privacy and confidentiality</span>
            </div>
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-ojas-primary-blue mt-1 flex-shrink-0" />
              <span>Share experiences, not medical advice</span>
            </div>
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-ojas-primary-blue mt-1 flex-shrink-0" />
              <span>Embrace diverse perspectives</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportGroups;