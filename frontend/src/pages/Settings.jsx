import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { profileService } from '../services/profile';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Select } from '../components/ui/select';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Key,
  Mail,
  Monitor,
  Moon,
  Sun,
  Globe,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { theme, changeTheme } = useTheme();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await profileService.getSettings();
      
      if (response.success) {
        setSettings(response.data);
      } else {
        // Set default settings if API fails
        setSettings({
          emailNotifications: true,
          pushNotifications: false,
          weeklyReports: true,
          experimentAlerts: true,
          profileVisibility: 'public',
          experimentVisibility: 'private',
          shareAnalytics: false,
          theme: theme,
          language: 'en',
          timezone: 'UTC-8',
          defaultExperimentType: 'classification',
          autoSaveInterval: 5,
          maxExperiments: 100,
          dataRetention: 365,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Set default settings on error
      setSettings({
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true,
        experimentAlerts: true,
        profileVisibility: 'public',
        experimentVisibility: 'private',
        shareAnalytics: false,
        theme: theme,
        language: 'en',
        timezone: 'UTC-8',
        defaultExperimentType: 'classification',
        autoSaveInterval: 5,
        maxExperiments: 100,
        dataRetention: 365,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // If theme is being changed, immediately apply it
    if (key === 'theme') {
      changeTheme(value);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const response = await profileService.updateSettings(settings);
      
      if (response.success) {
        console.log('Settings saved successfully');
        // You could show a success toast here
      } else {
        console.error('Failed to save settings:', response.message);
        // You could show an error toast here
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      // You could show an error toast here
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      try {
        setSaving(true);
        const response = await profileService.resetSettings();
        
        if (response.success) {
          setSettings(response.data);
          console.log('Settings reset successfully');
        } else {
          console.error('Failed to reset settings:', response.message);
        }
      } catch (error) {
        console.error('Error resetting settings:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleExportData = async () => {
    try {
      const response = await profileService.exportData();
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mltrackr-data-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      console.log('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.')) {
      try {
        const response = await profileService.deleteAccount();
        if (response.success) {
          // Logout and redirect to home
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
        } else {
          console.error('Failed to delete account:', response.message);
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'experiments', name: 'Experiments', icon: Database },
    { id: 'security', name: 'Security', icon: Key },
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || 'researcher@mltrackr.com'}
              className="mt-1"
              disabled
              readOnly
            />
            <p className="text-xs text-muted-foreground mt-1">Contact support to change your email address</p>
          </div>
          
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={user?.username || 'ml_researcher'}
              className="mt-1"
              disabled
              readOnly
            />
            <p className="text-xs text-muted-foreground mt-1">Username can be changed from your profile page</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Regional Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="UTC-12">UTC-12 (Baker Island)</option>
              <option value="UTC-8">UTC-8 (PST)</option>
              <option value="UTC-5">UTC-5 (EST)</option>
              <option value="UTC+0">UTC+0 (GMT)</option>
              <option value="UTC+1">UTC+1 (CET)</option>
              <option value="UTC+8">UTC+8 (CST)</option>
              <option value="UTC+9">UTC+9 (JST)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'General Email Notifications', description: 'Receive important updates and announcements' },
            { key: 'weeklyReports', label: 'Weekly Progress Reports', description: 'Get weekly summaries of your experiment progress' },
            { key: 'experimentAlerts', label: 'Experiment Alerts', description: 'Notifications when experiments complete or fail' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <div className="font-medium text-foreground">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
              <button
                onClick={() => handleSettingChange(item.key, !settings[item.key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[item.key] ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium text-foreground">Browser Notifications</div>
              <div className="text-sm text-muted-foreground">Show notifications in your browser</div>
            </div>
            <button
              onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.pushNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Visibility Settings</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="profileVisibility">Profile Visibility</Label>
            <select
              id="profileVisibility"
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="public">Public - Anyone can view your profile</option>
              <option value="team">Team Only - Only team members can view</option>
              <option value="private">Private - Only you can view</option>
            </select>
          </div>

          <div>
            <Label htmlFor="experimentVisibility">Default Experiment Visibility</Label>
            <select
              id="experimentVisibility"
              value={settings.experimentVisibility}
              onChange={(e) => handleSettingChange('experimentVisibility', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="private">Private - Only you can view</option>
              <option value="team">Team - Team members can view</option>
              <option value="public">Public - Anyone can view</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Sharing</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium text-foreground">Share Anonymous Analytics</div>
              <div className="text-sm text-muted-foreground">Help improve MLTrackr by sharing anonymous usage data</div>
            </div>
            <button
              onClick={() => handleSettingChange('shareAnalytics', !settings.shareAnalytics)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.shareAnalytics ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.shareAnalytics ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor },
          ].map((themeOption) => {
            const Icon = themeOption.icon;
            const isActive = theme === themeOption.value;
            return (
              <button
                key={themeOption.value}
                onClick={() => handleSettingChange('theme', themeOption.value)}
                className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-all duration-200 ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary shadow-md scale-105'
                    : 'border-border hover:border-primary/50 hover:bg-accent/20'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{themeOption.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderExperimentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Default Settings</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="defaultExperimentType">Default Experiment Type</Label>
            <select
              id="defaultExperimentType"
              value={settings.defaultExperimentType}
              onChange={(e) => handleSettingChange('defaultExperimentType', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="classification">Classification</option>
              <option value="regression">Regression</option>
              <option value="clustering">Clustering</option>
              <option value="nlp">Natural Language Processing</option>
              <option value="computer_vision">Computer Vision</option>
              <option value="reinforcement_learning">Reinforcement Learning</option>
            </select>
          </div>

          <div>
            <Label htmlFor="autoSaveInterval">Auto-save Interval (minutes)</Label>
            <Input
              id="autoSaveInterval"
              type="number"
              min="1"
              max="60"
              value={settings.autoSaveInterval}
              onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Storage & Limits</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="maxExperiments">Maximum Active Experiments</Label>
            <Input
              id="maxExperiments"
              type="number"
              min="10"
              max="1000"
              value={settings.maxExperiments}
              onChange={(e) => handleSettingChange('maxExperiments', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
            <select
              id="dataRetention"
              value={settings.dataRetention}
              onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365">1 year</option>
              <option value="730">2 years</option>
              <option value="-1">Forever</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Account Security</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Shield className="h-4 w-4 mr-2" />
            Enable Two-Factor Authentication
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Export My Data
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 text-red-600">Danger Zone</h3>
        <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50/50">
          <Button 
            variant="outline" 
            className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
            onClick={handleResetSettings}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset All Settings
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
            onClick={handleDeleteAccount}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'experiments':
        return renderExperimentSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderProfileSettings();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {renderContent()}
              
              {/* Save Button */}
              <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-border">
                <Button onClick={handleSaveSettings} disabled={saving} className="flex items-center space-x-2">
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
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;