import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  BarChart3, 
  Zap, 
  Users, 
  ArrowRight,
  CheckCircle,
  Activity,
  Database,
  GitBranch,
  Target,
  Menu, // Added for hamburger icon
  X      // Added for close icon
} from 'lucide-react';
import ColoredTypedCode from '../components/ColoredTypedCode';

const Home = () => {
  // State to manage the mobile menu's visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Effect to prevent scrolling when the mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: "Smart Experiment Tracking",
      description: "Track and manage your ML experiments with intelligent versioning and automated metadata collection."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-400" />,
      title: "Advanced Analytics",
      description: "Visualize performance metrics, compare models, and gain insights with interactive dashboards."
    },
    {
      icon: <GitBranch className="w-8 h-8 text-purple-400" />,
      title: "Model Versioning",
      description: "Keep track of model versions with git-like branching and seamless rollback capabilities."
    },
    {
      icon: <Target className="w-8 h-8 text-red-400" />,
      title: "Performance Monitoring",
      description: "Monitor model performance in real-time with automated alerts and drift detection."
    },
    {
      icon: <Database className="w-8 h-8 text-yellow-400" />,
      title: "Data Management",
      description: "Organize datasets, track data lineage, and ensure reproducibility across experiments."
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-400" />,
      title: "Team Collaboration",
      description: "Share experiments, collaborate on models, and maintain team knowledge base."
    }
  ];

  const stats = [
    { number: "10K+", label: "Experiments Tracked" },
    { number: "500+", label: "ML Engineers" },
    { number: "99.9%", label: "Uptime" },
    { number: "50%", label: "Faster Deployment" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="relative z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MLTracker</span>
          </Link>

          {/* Desktop Navigation Links - hidden on screens smaller than md */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button - visible only on screens smaller than md */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Overlay that appears when isMenuOpen is true */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-gray-900 bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center space-y-8">
          <Link 
            to="/login" 
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-300 hover:text-white transition-colors duration-200 text-2xl"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            onClick={() => setIsMenuOpen(false)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-2xl font-bold"
          >
            Get Started
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            {/* Adjusted heading font size for better scaling on mobile */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Track Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> ML Journey</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The most powerful platform for tracking, analyzing, and optimizing your machine learning experiments. 
              From training to deployment, we've got you covered.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <span>Start Tracking</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 hover:text-white transition-all duration-200 flex items-center space-x-2 w-full sm:w-auto justify-center">
              <span>Watch Demo</span>
              <Zap className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 md:py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"> ML Excellence</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools and features designed to streamline your machine learning workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Adjusted gap for better spacing on mobile */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Why Choose
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> MLTracker?</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  "Automated experiment logging and versioning",
                  "Real-time collaboration with team members",
                  "Advanced visualization and comparison tools", 
                  "Seamless integration with popular ML frameworks",
                  "Enterprise-grade security and compliance",
                  "Scalable infrastructure for teams of any size"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl border border-gray-700">
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">experiment_tracker.py</div>
                </div>           
                <div className="font-mono text-xs sm:text-sm space-y-2 text-gray-200 overflow-x-auto">
                    <ColoredTypedCode />
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 md:py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> ML Workflow?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of ML engineers who trust MLTracker to manage their experiments and accelerate their research.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/login" 
              className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 hover:text-white transition-all duration-200 w-full sm:w-auto justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MLTracker</span>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            {/* Updated to dynamically generate the current year */}
            <p>&copy; {new Date().getFullYear()} MLTracker. All rights reserved. Built with ❤️ for the ML community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;