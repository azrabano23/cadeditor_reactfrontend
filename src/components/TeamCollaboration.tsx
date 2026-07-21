import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Share2, 
  MoreVertical, Trash2, Copy,
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  status: 'active' | 'pending' | 'inactive';
  joinedAt: Date;
}

interface Comment {
  id: string;
  text: string;
  author: TeamMember;
  createdAt: Date;
  modelId?: string;
}

interface TeamCollaborationProps {
  onClose?: () => void;
}

const TeamCollaboration: React.FC<TeamCollaborationProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'invites' | 'comments'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');

  // Mock data
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      status: 'active',
      joinedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      status: 'active',
      joinedAt: new Date('2024-02-01')
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'member',
      status: 'pending',
      joinedAt: new Date('2024-03-10')
    }
  ]);

  const [comments] = useState<Comment[]>([
    {
      id: '1',
      text: 'Great design! The proportions look perfect for the final product.',
      author: teamMembers[1],
      createdAt: new Date('2024-03-15T10:30:00'),
      modelId: 'model-1'
    },
    {
      id: '2',
      text: 'Can we adjust the material finish? I think a matte look would work better.',
      author: teamMembers[0],
      createdAt: new Date('2024-03-15T11:15:00'),
      modelId: 'model-1'
    }
  ]);

  const handleInvite = () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }
    
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/team-123`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
    setShowShareModal(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-purple-400 bg-purple-400/20';
      case 'admin': return 'text-blue-400 bg-blue-400/20';
      case 'member': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'inactive': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold">Team Collaboration</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {[
          { id: 'members', label: 'Members', count: teamMembers.length },
          { id: 'invites', label: 'Invites', count: teamMembers.filter(m => m.status === 'pending').length },
          { id: 'comments', label: 'Comments', count: comments.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-accent border-b-2 border-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
            <span className="bg-zinc-800 text-xs px-2 py-1 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'members' && (
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-black font-bold">
                          {member.name[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.name}</span>
                          {getStatusIcon(member.status)}
                        </div>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'invites' && (
              <div className="space-y-4">
                {teamMembers.filter(m => m.status === 'pending').map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <span className="font-medium">{member.email}</span>
                        <p className="text-gray-400 text-sm">Invitation pending</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-zinc-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-bold text-sm">
                          {comment.author.name[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author.name}</span>
                          <span className="text-gray-400 text-xs">
                            {comment.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
                    rows={3}
                  />
                  <button className="mt-2 bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90">
                    Post Comment
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-800"
            >
              <h3 className="text-xl font-semibold mb-4">Invite Team Member</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-accent focus:outline-none"
                    placeholder="colleague@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-accent focus:outline-none"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2 text-gray-400 hover:text-white border border-zinc-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInvite}
                    className="flex-1 bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-800"
            >
              <h3 className="text-xl font-semibold mb-4">Share Team</h3>
              <div className="space-y-4">
                <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                  <p className="text-sm text-gray-400 mb-2">Share Link</p>
                  <p className="text-white font-mono text-sm break-all">
                    {window.location.origin}/share/team-123
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 px-4 py-2 text-gray-400 hover:text-white border border-zinc-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamCollaboration; 