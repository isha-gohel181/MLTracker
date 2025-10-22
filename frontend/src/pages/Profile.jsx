import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profile';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Github, 
  Linkedin, 
  Twitter,
  Edit3,
  Save,
  X,
  Camera,
  Award,
  Target,
  TrendingUp,
  Loader2
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    fullName: '',
    bio: '',
    location: '',
    organization: '',
    role: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    joinedDate: '',
    profilePicture: null
  });
  const [stats, setStats] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [originalData, setOriginalData] = useState({});

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileResponse, statsResponse, achievementsResponse] = await Promise.all([
        profileService.getProfile(),
        profileService.getStats(),
        profileService.getAchievements()
      ]);

      if (profileResponse.success) {
        const profile = profileResponse.data;
        setProfileData({
          username: profile.username || user?.username || '',
          email: profile.email || user?.email || '',
          fullName: profile.fullName || '',
          bio: profile.bio || '',
          location: profile.location || '',
          organization: profile.organization || '',
          role: profile.role || '',
          website: profile.website || '',
          github: profile.github || '',
          linkedin: profile.linkedin || '',
          twitter: profile.twitter || '',
          joinedDate: profile.joinedDate || profile.createdAt || '',
          profilePicture: profile.profilePicture || null
        });
        setOriginalData({ ...profile });
      } else {
        // Fallback to user data from auth context
        setProfileData({
          username: user?.username || '',
          email: user?.email || '',
          fullName: user?.fullName || '',
          bio: '',
          location: '',
          organization: '',
          role: '',
          website: '',
          github: '',
          linkedin: '',
          twitter: '',
          joinedDate: user?.createdAt || '',
          profilePicture: null
        });
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (achievementsResponse.success) {
        setAchievements(achievementsResponse.data);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Fallback to basic user data
      setProfileData({
        username: user?.username || 'ML Researcher',
        email: user?.email || 'researcher@mltrackr.com',
        fullName: user?.fullName || '',
        bio: '',
        location: '',
        organization: '',
        role: 'ML Researcher',
        website: '',
        github: '',
        linkedin: '',
        twitter: '',
        joinedDate: user?.createdAt || new Date().toISOString(),
        profilePicture: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await profileService.updateProfile(profileData);
      
      if (response.success) {
        setOriginalData({ ...profileData });
        setIsEditing(false);
        // You could show a success toast here
        console.log('Profile updated successfully');
      } else {
        console.error('Failed to update profile:', response.message);
        // You could show an error toast here
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // You could show an error toast here
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData({ ...originalData });
    setIsEditing(false);
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await profileService.uploadProfilePicture(file);
        if (response.success) {
          setProfileData({ ...profileData, profilePicture: response.data.profilePicture });
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  // Icon mapping function
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Target': Target,
      'TrendingUp': TrendingUp,
      'Award': Award,
      'ActivityIcon': Target, // fallback for activity icon
      'Activity': Target, // fallback
      Target: Target, // handle direct component references
      TrendingUp: TrendingUp,
      Award: Award
    };
    return iconMap[iconName] || Target;
  };

  // Default stats structure if no data from API
  const defaultStats = [
    { label: 'Experiments Run', value: 0, icon: Target, color: 'text-blue-600' },
    { label: 'Models Trained', value: 0, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Achievements', value: 0, icon: Award, color: 'text-purple-600' },
  ];

  const displayStats = stats.length > 0 ? stats.map(stat => ({
    ...stat,
    icon: typeof stat.icon === 'string' ? getIconComponent(stat.icon) : (stat.icon || Target),
    color: stat.color || 'text-blue-600'
  })) : defaultStats;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and preferences</p>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center space-x-2"
            variant={isEditing ? "default" : "outline"}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                {/* Profile Picture & Basic Info */}
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                      {profileData.profilePicture ? (
                        <img 
                          src={profileData.profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-white" />
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors cursor-pointer">
                        <Camera className="h-4 w-4 text-primary-foreground" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="fullName"
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-lg font-semibold text-foreground mt-1">{profileData.fullName}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="username">Username</Label>
                        {isEditing ? (
                          <Input
                            id="username"
                            value={profileData.username}
                            onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-lg font-medium text-muted-foreground mt-1">@{profileData.username}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          rows={3}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-muted-foreground mt-1">{profileData.bio}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-foreground">{profileData.email}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-foreground">{profileData.location}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="organization"
                            value={profileData.organization}
                            onChange={(e) => setProfileData({...profileData, organization: e.target.value})}
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-foreground">{profileData.organization}</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="role">Role</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="role"
                            value={profileData.role}
                            onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                            className="flex-1"
                          />
                        ) : (
                          <span className="text-foreground">{profileData.role}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Github className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="github"
                            value={profileData.github}
                            onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                            placeholder="username"
                            className="flex-1"
                          />
                        ) : (
                          <a 
                            href={`https://github.com/${profileData.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {profileData.github}
                          </a>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="linkedin"
                            value={profileData.linkedin}
                            onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                            placeholder="username"
                            className="flex-1"
                          />
                        ) : (
                          <a 
                            href={`https://linkedin.com/in/${profileData.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {profileData.linkedin}
                          </a>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Twitter className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="twitter"
                            value={profileData.twitter}
                            onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                            placeholder="username"
                            className="flex-1"
                          />
                        ) : (
                          <a 
                            href={`https://twitter.com/${profileData.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            @{profileData.twitter}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons for Edit Mode */}
                {isEditing && (
                  <div className="flex items-center space-x-3 pt-4 border-t border-border">
                    <Button onClick={handleSave} disabled={saving} className="flex items-center space-x-2">
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="flex items-center space-x-2">
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Statistics</h3>
              <div className="space-y-4">
                {displayStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                      <span className="text-lg font-bold text-foreground">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Member Since Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Member Since</h3>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground">
                  {profileData.joinedDate ? new Date(profileData.joinedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  }) : 'N/A'}
                </span>
              </div>
            </Card>

            {/* Recent Achievements */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;