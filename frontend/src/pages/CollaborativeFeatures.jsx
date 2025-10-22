import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Users,
  Share2,
  MessageCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  Star,
  GitBranch,
  Copy,
  Send,
  Paperclip,
  MoreHorizontal,
  UserPlus,
  Crown,
  Shield,
  Settings,
  Download,
  Upload,
  Bell,
  Hash,
  AtSign
} from 'lucide-react';

const CollaborativeFeatures = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('workspaces');
  const [workspaces, setWorkspaces] = useState([]);
  const [sharedExperiments, setSharedExperiments] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    loadCollaborativeData();
  }, []);

  const loadCollaborativeData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setWorkspaces([
        {
          id: 1,
          name: 'Computer Vision Team',
          description: 'Collaborative workspace for computer vision projects',
          members: [
            { id: 1, name: 'Sarah Johnson', role: 'admin', avatar: null, status: 'online' },
            { id: 2, name: 'Mike Chen', role: 'member', avatar: null, status: 'offline' },
            { id: 3, name: 'Emily Davis', role: 'member', avatar: null, status: 'online' },
            { id: 4, name: 'Alex Rodriguez', role: 'viewer', avatar: null, status: 'away' }
          ],
          experiments: 12,
          createdAt: '2024-09-15T10:00:00Z',
          lastActivity: '2024-10-21T08:30:00Z'
        },
        {
          id: 2,
          name: 'NLP Research',
          description: 'Natural Language Processing experiments and models',
          members: [
            { id: 1, name: 'Sarah Johnson', role: 'member', avatar: null, status: 'online' },
            { id: 5, name: 'David Kim', role: 'admin', avatar: null, status: 'online' },
            { id: 6, name: 'Lisa Wang', role: 'member', avatar: null, status: 'offline' }
          ],
          experiments: 8,
          createdAt: '2024-08-20T14:00:00Z',
          lastActivity: '2024-10-20T16:45:00Z'
        },
        {
          id: 3,
          name: 'Data Science Bootcamp',
          description: 'Learning and practicing data science techniques',
          members: [
            { id: 7, name: 'John Smith', role: 'admin', avatar: null, status: 'online' },
            { id: 1, name: 'Sarah Johnson', role: 'member', avatar: null, status: 'online' },
            { id: 8, name: 'Maria Garcia', role: 'member', avatar: null, status: 'offline' }
          ],
          experiments: 25,
          createdAt: '2024-07-10T09:00:00Z',
          lastActivity: '2024-10-19T12:20:00Z'
        }
      ]);

      setSharedExperiments([
        {
          id: 1,
          title: 'Image Classification with ResNet',
          description: 'Building an image classifier using ResNet architecture',
          owner: 'Sarah Johnson',
          workspace: 'Computer Vision Team',
          sharedWith: ['Mike Chen', 'Emily Davis'],
          permission: 'edit',
          accuracy: '94.2%',
          status: 'completed',
          comments: 5,
          likes: 12,
          lastModified: '2024-10-21T10:30:00Z'
        },
        {
          id: 2,
          title: 'Sentiment Analysis BERT Model',
          description: 'Fine-tuning BERT for sentiment analysis on customer reviews',
          owner: 'David Kim',
          workspace: 'NLP Research',
          sharedWith: ['Sarah Johnson', 'Lisa Wang'],
          permission: 'view',
          accuracy: '91.8%',
          status: 'running',
          comments: 8,
          likes: 7,
          lastModified: '2024-10-20T15:45:00Z'
        },
        {
          id: 3,
          title: 'Customer Churn Prediction',
          description: 'Predicting customer churn using ensemble methods',
          owner: 'John Smith',
          workspace: 'Data Science Bootcamp',
          sharedWith: ['Sarah Johnson', 'Maria Garcia'],
          permission: 'edit',
          accuracy: '87.5%',
          status: 'completed',
          comments: 12,
          likes: 15,
          lastModified: '2024-10-19T09:15:00Z'
        }
      ]);

      setComments([
        {
          id: 1,
          experimentId: 1,
          author: 'Mike Chen',
          content: 'Great work on the data preprocessing! The augmentation techniques really improved the model performance.',
          timestamp: '2024-10-21T09:15:00Z',
          replies: [
            {
              id: 2,
              author: 'Sarah Johnson',
              content: 'Thanks! I found that combining rotation and scaling worked best for this dataset.',
              timestamp: '2024-10-21T09:30:00Z'
            }
          ]
        },
        {
          id: 3,
          experimentId: 1,
          author: 'Emily Davis',
          content: 'Could we try adding dropout layers to reduce overfitting? I noticed the validation loss plateaus early.',
          timestamp: '2024-10-21T10:00:00Z',
          replies: []
        },
        {
          id: 4,
          experimentId: 2,
          author: 'Lisa Wang',
          content: 'The BERT fine-tuning approach is solid. Have you considered using RoBERTa for comparison?',
          timestamp: '2024-10-20T14:20:00Z',
          replies: [
            {
              id: 5,
              author: 'David Kim',
              content: 'Good idea! I\'ll add RoBERTa to the next experiment iteration.',
              timestamp: '2024-10-20T14:35:00Z'
            }
          ]
        }
      ]);

      setLoading(false);
    }, 1000);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'member': return <Users className="h-4 w-4 text-blue-600" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPermissionColor = (permission) => {
    switch (permission) {
      case 'edit': return 'text-green-600 bg-green-100';
      case 'view': return 'text-blue-600 bg-blue-100';
      case 'admin': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAddComment = (experimentId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        experimentId,
        author: user?.username || 'Current User',
        content: newComment,
        timestamp: new Date().toISOString(),
        replies: []
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const tabs = [
    { id: 'workspaces', name: 'Workspaces', icon: Users },
    { id: 'shared', name: 'Shared Experiments', icon: Share2 },
    { id: 'comments', name: 'Comments & Discussion', icon: MessageCircle },
    { id: 'team', name: 'Team Management', icon: Crown },
  ];

  const renderWorkspaces = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Team Workspaces</h2>
          <p className="text-sm text-muted-foreground">Collaborate with your team on ML projects</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Workspace</span>
        </Button>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{workspace.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{workspace.description}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{workspace.members.length} members</span>
                </span>
                <span className="flex items-center space-x-1">
                  <GitBranch className="h-4 w-4" />
                  <span>{workspace.experiments} experiments</span>
                </span>
              </div>

              {/* Members Preview */}
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {workspace.members.slice(0, 4).map((member, index) => (
                    <div
                      key={member.id}
                      className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-background"
                      title={member.name}
                    >
                      <span className="text-xs text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`}></div>
                    </div>
                  ))}
                  {workspace.members.length > 4 && (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border-2 border-background">
                      <span className="text-xs text-muted-foreground">+{workspace.members.length - 4}</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  Active {new Date(workspace.lastActivity).toLocaleDateString()}
                </span>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-3 w-3 mr-1" />
                  Manage
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSharedExperiments = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Shared Experiments</h2>
          <p className="text-sm text-muted-foreground">Experiments shared with you and your team</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search experiments..."
              className="pl-10 w-80"
            />
          </div>
          <select className="px-3 py-2 border border-border rounded-md bg-background text-foreground">
            <option value="all">All Workspaces</option>
            {workspaces.map(workspace => (
              <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Experiments List */}
      <div className="space-y-4">
        {sharedExperiments.map((experiment) => (
          <Card key={experiment.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-foreground">{experiment.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPermissionColor(experiment.permission)}`}>
                    {experiment.permission.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    experiment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    experiment.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {experiment.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{experiment.description}</p>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center space-x-1">
                    <Crown className="h-4 w-4" />
                    <span>Owner: {experiment.owner}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Hash className="h-4 w-4" />
                    <span>{experiment.workspace}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Shared with {experiment.sharedWith.length} members</span>
                  </span>
                  {experiment.accuracy && (
                    <span className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>Accuracy: {experiment.accuracy}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{experiment.comments} comments</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>{experiment.likes} likes</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Modified {new Date(experiment.lastModified).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                {experiment.permission === 'edit' && (
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderComments = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Comments & Discussions</h2>
          <p className="text-sm text-muted-foreground">Collaborate through comments on shared experiments</p>
        </div>
        <select className="px-3 py-2 border border-border rounded-md bg-background text-foreground">
          <option value="all">All Experiments</option>
          {sharedExperiments.map(exp => (
            <option key={exp.id} value={exp.id}>{exp.title}</option>
          ))}
        </select>
      </div>

      {/* Comments by Experiment */}
      {sharedExperiments.map((experiment) => {
        const experimentComments = comments.filter(c => c.experimentId === experiment.id);
        if (experimentComments.length === 0) return null;

        return (
          <Card key={experiment.id} className="p-6">
            <div className="border-b border-border pb-4 mb-4">
              <h3 className="font-semibold text-foreground">{experiment.title}</h3>
              <p className="text-sm text-muted-foreground">{experiment.description}</p>
            </div>

            <div className="space-y-4">
              {experimentComments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {comment.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1">{comment.content}</p>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-11 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {reply.author.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-foreground">{reply.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(reply.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-foreground mt-1">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Add Comment */}
              <div className="flex items-start space-x-3 pt-4 border-t border-border">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {(user?.username || 'You').split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <AtSign className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(experiment.id)}
                      disabled={!newComment.trim()}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  const renderTeamManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Team Management</h2>
          <p className="text-sm text-muted-foreground">Manage team members and permissions</p>
        </div>
        <Button className="flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Invite Member</span>
        </Button>
      </div>

      {/* Team Members by Workspace */}
      {workspaces.map((workspace) => (
        <Card key={workspace.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{workspace.name}</h3>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Manage
            </Button>
          </div>

          <div className="space-y-3">
            {workspace.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`}></div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center space-x-1">
                      {getRoleIcon(member.role)}
                      <span>{member.role}</span>
                      <span>•</span>
                      <span>{member.status}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={member.role}
                    className="px-2 py-1 text-xs border border-border rounded bg-background"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'workspaces': return renderWorkspaces();
      case 'shared': return renderSharedExperiments();
      case 'comments': return renderComments();
      case 'team': return renderTeamManagement();
      default: return renderWorkspaces();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Collaboration Hub</h1>
          <p className="text-muted-foreground">Work together on machine learning projects with your team</p>
        </div>

        {/* Navigation Tabs */}
        <Card className="p-4">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Users className="h-6 w-6 animate-pulse mr-2" />
            <span>Loading collaboration data...</span>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default CollaborativeFeatures;