import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { 
  Brain, 
  LogOut, 
  User, 
  Settings, 
  Menu, 
  X,
  Home,
  Plus,
  BarChart3,
  GitCompare,
  Activity,
  Sparkles,
  Lightbulb,
  Layers,
  ChevronDown,
  TrendingDown,
  Users
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const aiDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    // Ensure logout updates auth state before navigation
    navigate('/');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aiDropdownRef.current && !aiDropdownRef.current.contains(event.target)) {
        setAiDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Templates', href: '/templates', icon: Layers },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Compare', href: '/experiments/compare', icon: GitCompare },
  ];

  const advancedFeatures = [
    { name: 'Data Drift', href: '/data-drift', icon: TrendingDown, description: 'Monitor model degradation' },
    { name: 'Collaboration', href: '/collaboration', icon: Users, description: 'Team workspaces & sharing' },
  ];

  const aiFeatures = [
    { name: 'Live Monitor', href: '/monitoring', icon: Activity },
    { name: 'AI Predictions', href: '/predictions', icon: Sparkles },
    { name: 'Recommendations', href: '/recommendations', icon: Lightbulb },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-card/90 border-b border-border/40 sticky top-0 z-50 backdrop-blur-xl supports-[backdrop-filter]:bg-card/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                MLTrackr
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex ml-10 space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Advanced Features Dropdown */}
              <div className="relative" ref={aiDropdownRef}>
                <button
                  onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    [...aiFeatures, ...advancedFeatures].some(item => isActive(item.href))
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                  }`}
                >
                  <Brain className="h-4 w-4" />
                  <span>Advanced</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${aiDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {aiDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-50 py-3">
                    {/* AI Features Section */}
                    <div className="px-4 py-2 text-xs font-semibold text-blue-600 border-b border-border/30">
                      🤖 AI-Powered Features
                    </div>
                    <div className="py-2">
                      {aiFeatures.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setAiDropdownOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all duration-200 ${
                              isActive(item.href)
                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 border border-blue-200/30'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${isActive(item.href) ? 'bg-blue-500/20' : 'bg-accent/30'}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.name === 'Live Monitor' && 'Real-time experiment tracking'}
                                {item.name === 'AI Predictions' && 'Smart performance forecasting'}
                                {item.name === 'Recommendations' && 'Intelligent suggestions'}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Advanced Features Section */}
                    <div className="px-4 py-2 text-xs font-semibold text-purple-600 border-b border-border/30 border-t border-border/30">
                      🔬 Advanced Features
                    </div>
                    <div className="py-2">
                      {advancedFeatures.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setAiDropdownOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg text-sm transition-all duration-200 ${
                              isActive(item.href)
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 border border-purple-200/30'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${isActive(item.href) ? 'bg-purple-500/20' : 'bg-accent/30'}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center">
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-accent/40 to-accent/20 rounded-xl hover:from-accent/60 hover:to-accent/40 transition-all duration-200 border border-border/30 hover:border-border/50 shadow-sm"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-foreground">{user?.username}</div>
                  <div className="text-xs text-muted-foreground">ML Researcher</div>
                </div>
                <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {userDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-72 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl z-50 py-3">
                  {/* User Info Header */}
                  <div className="px-5 py-4 border-b border-border/30">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-lg">{user?.username}</div>
                        <div className="text-sm text-muted-foreground">{user?.email || 'researcher@mltrackr.com'}</div>
                        <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mt-1">
                          ML Researcher
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-3 px-5 py-3 mx-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 w-auto transition-all duration-200 group"
                    >
                      <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">View Profile</div>
                        <div className="text-xs text-muted-foreground">Manage your account</div>
                      </div>
                    </Link>
                    
                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-3 px-5 py-3 mx-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 w-auto transition-all duration-200 group"
                    >
                      <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                        <Settings className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">Settings</div>
                        <div className="text-xs text-muted-foreground">Preferences and configuration</div>
                      </div>
                    </Link>

                    <Link
                      to="/activity"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-3 px-5 py-3 mx-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 w-auto transition-all duration-200 group"
                    >
                      <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Activity</div>
                        <div className="text-xs text-muted-foreground">Your experiment history</div>
                      </div>
                    </Link>

                    <Link
                      to="/recommendations"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-3 px-5 py-3 mx-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 w-auto transition-all duration-200 group"
                    >
                      <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <Brain className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">AI Insights</div>
                        <div className="text-xs text-muted-foreground">Personal recommendations</div>
                      </div>
                    </Link>
                  </div>

                  {/* Logout Section */}
                  <div className="border-t border-border/30 pt-2 mt-2">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center space-x-3 px-5 py-3 mx-2 rounded-lg text-sm text-red-600 hover:text-red-700 hover:bg-red-50 w-auto transition-all duration-200 group"
                    >
                      <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium">Sign Out</div>
                        <div className="text-xs text-muted-foreground">End your session</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-accent/60 transition-colors"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground">{user?.username}</span>
              <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile User Dropdown */}
            {userDropdownOpen && (
              <div className="absolute top-full right-4 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50 py-2">
                {/* User Info Header */}
                <div className="px-3 py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{user?.username}</div>
                      <div className="text-xs text-muted-foreground">{user?.email || 'researcher@mltrackr.com'}</div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 w-full transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 w-full transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    to="/activity"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 w-full transition-colors"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Activity</span>
                  </Link>
                </div>

                {/* Logout Section */}
                <div className="border-t border-border pt-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 w-full transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>


        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-sm">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {/* Core Navigation */}
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground mb-2 px-2">CORE FEATURES</div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* AI Features */}
              <div className="space-y-1">
                <div className="text-xs font-medium text-blue-600 mb-2 px-2">🤖 AI TOOLS</div>
                {aiFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                      }`}
                    >
                      <div className={`p-1 rounded ${isActive(item.href) ? 'bg-white/20' : 'bg-accent/30'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs opacity-70">
                          {item.name === 'Live Monitor' && 'Real-time tracking'}
                          {item.name === 'AI Predictions' && 'Smart forecasting'}
                          {item.name === 'Recommendations' && 'Intelligent tips'}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Advanced Features */}
              <div className="space-y-1">
                <div className="text-xs font-medium text-purple-600 mb-2 px-2">🔬 ADVANCED</div>
                {advancedFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                      }`}
                    >
                      <div className={`p-1 rounded ${isActive(item.href) ? 'bg-white/20' : 'bg-accent/30'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;