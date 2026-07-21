import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, BarChart3, Users, Code, User as UserIcon, 
  Upload, Eye, Smartphone, Calendar,
  LogOut, Settings, Bell, MapPin
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-hot-toast';
import TeamCollaboration from './TeamCollaboration';
import ARAnalytics from './ARAnalytics';
import APIPortal from './APIPortal';
import ModelAnnotation from './ModelAnnotation';
import ThemeToggle from './ThemeToggle';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface DashboardProps {
  onLogout: () => void;
}

interface OnboardingModalProps {
  onComplete: () => void;
}

type TabType = 'files' | 'analytics' | 'team' | 'api' | 'profile';

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('files');
  const [user, setUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTeamCollaboration, setShowTeamCollaboration] = useState(false);
  const [showARAnalytics, setShowARAnalytics] = useState(false);
  const [showAPIPortal, setShowAPIPortal] = useState(false);
  const [showModelAnnotation, setShowModelAnnotation] = useState(false);

  useEffect(() => {
    // Check if this is the user's first login
    const hasSeenOnboarding = localStorage.getItem('holodraft-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user as User);
      }
    };
    getUser();
  }, []);

  const tabs = [
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'api', label: 'API', icon: Code },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    toast.success('Logged out successfully');
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('holodraft-onboarding-seen', 'true');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold text-accent">Holodraft</span>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-accent text-black'
                        : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button className="p-2 text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'files' && <FilesTab onOpenAnnotation={() => setShowModelAnnotation(true)} />}
            {activeTab === 'analytics' && <AnalyticsTab onOpenAnalytics={() => setShowARAnalytics(true)} />}
            {activeTab === 'team' && <TeamTab onOpenCollaboration={() => setShowTeamCollaboration(true)} />}
            {activeTab === 'api' && <ApiTab onOpenAPIPortal={() => setShowAPIPortal(true)} />}
            {activeTab === 'profile' && <ProfileTab user={user} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal onComplete={completeOnboarding} />
        )}
      </AnimatePresence>

      {/* Team Collaboration Modal */}
      <AnimatePresence>
        {showTeamCollaboration && (
          <TeamCollaboration onClose={() => setShowTeamCollaboration(false)} />
        )}
      </AnimatePresence>

      {/* AR Analytics Modal */}
      <AnimatePresence>
        {showARAnalytics && (
          <ARAnalytics onClose={() => setShowARAnalytics(false)} />
        )}
      </AnimatePresence>

      {/* API Portal Modal */}
      <AnimatePresence>
        {showAPIPortal && (
          <APIPortal onClose={() => setShowAPIPortal(false)} />
        )}
      </AnimatePresence>

      {/* Model Annotation Modal */}
      <AnimatePresence>
        {showModelAnnotation && (
          <ModelAnnotation
            modelId="demo-model"
            modelName="Engine Component v2.1"
            onClose={() => setShowModelAnnotation(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Onboarding Modal Component
const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to Holodraft! 🚀",
      description: "Let's get you started with the future of CAD-to-AR visualization.",
      icon: "🎯"
    },
    {
      title: "Upload Your CAD Files",
      description: "Drag and drop your STL, STEP, OBJ, PLY, or DAE files. We'll convert them to AR-ready format.",
      icon: "📤"
    },
    {
      title: "Preview in WebGL",
      description: "View your models instantly in the browser. Rotate, zoom, and inspect before launching in AR.",
      icon: "🌐"
    },
    {
      title: "Launch in AR",
      description: "Connect to MetaQuest or HoloLens and experience your designs in real space.",
      icon: "🥽"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
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
        className="bg-zinc-900 rounded-2xl p-8 max-w-md w-full border border-zinc-800"
      >
        <div className="text-center">
          <div className="text-4xl mb-4">{steps[currentStep].icon}</div>
          <h2 className="text-2xl font-bold text-white mb-4">{steps[currentStep].title}</h2>
          <p className="text-gray-400 mb-8">{steps[currentStep].description}</p>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? 'bg-accent' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onComplete}
              className="flex-1 px-4 py-2 text-gray-400 hover:text-white border border-zinc-700 rounded-lg"
            >
              Skip
            </button>
            <button
              onClick={nextStep}
              className="flex-1 bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90 flex items-center justify-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <span>✓</span>
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Tab Components
const FilesTab: React.FC<{ onOpenAnnotation: () => void }> = ({ onOpenAnnotation }) => (
  <div>
    <h1 className="text-3xl font-bold mb-6">Your Files</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* File cards will go here */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-5 h-5 text-accent" />
          <span className="font-medium">Upload your first CAD file</span>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Start by uploading a CAD file to convert it to AR-ready format
        </p>
        <button className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90">
          Upload File
        </button>
      </div>
      
      {/* Demo file with annotation */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-5 h-5 text-accent" />
          <span className="font-medium">Engine Component v2.1</span>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Ready for annotation and AR viewing
        </p>
        <div className="flex gap-2">
          <button 
            onClick={onOpenAnnotation}
            className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
          >
            Annotate
          </button>
          <button className="bg-zinc-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-zinc-700">
            View AR
          </button>
        </div>
      </div>
    </div>
  </div>
);

const AnalyticsTab: React.FC<{ onOpenAnalytics: () => void }> = ({ onOpenAnalytics }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <button
        onClick={onOpenAnalytics}
        className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
      >
        View Full Analytics
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-3 mb-2">
          <Eye className="w-5 h-5 text-accent" />
          <span className="text-gray-400">Total Views</span>
        </div>
        <div className="text-2xl font-bold">1,247</div>
      </div>
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-3 mb-2">
          <Smartphone className="w-5 h-5 text-accent" />
          <span className="text-gray-400">AR Launches</span>
        </div>
        <div className="text-2xl font-bold">892</div>
      </div>
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-5 h-5 text-accent" />
          <span className="text-gray-400">This Month</span>
        </div>
        <div className="text-2xl font-bold">156</div>
      </div>
    </div>
  </div>
);

const TeamTab: React.FC<{ onOpenCollaboration: () => void }> = ({ onOpenCollaboration }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Team</h1>
      <button
        onClick={onOpenCollaboration}
        className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
      >
        Open Team Panel
      </button>
    </div>
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Team Members</h2>
        <button className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90">
          Invite Member
        </button>
      </div>
      <p className="text-gray-400">No team members yet. Invite your colleagues to collaborate on CAD projects.</p>
    </div>
  </div>
);

const ApiTab: React.FC<{ onOpenAPIPortal: () => void }> = ({ onOpenAPIPortal }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">API & Developer Tools</h1>
      <button
        onClick={onOpenAPIPortal}
        className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
      >
        Open API Portal
      </button>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">API Keys</h2>
        <p className="text-gray-400 mb-4">Generate API keys to integrate Holodraft into your applications.</p>
        <button className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90">
          Generate Key
        </button>
      </div>
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Documentation</h2>
        <p className="text-gray-400 mb-4">Explore our API documentation and code examples.</p>
        <button className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90">
          View Docs
        </button>
      </div>
    </div>
  </div>
);

const ProfileTab: React.FC<{ user: User | null }> = ({ user }) => (
  <div>
    <h1 className="text-3xl font-bold mb-6">Profile</h1>
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-xl">
            {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {user?.user_metadata?.full_name || 'User'}
          </h2>
          <p className="text-gray-400">{user?.email}</p>
        </div>
      </div>
      <div className="space-y-4">
        <button className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700">
          Edit Profile
        </button>
        <button className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700">
          Change Password
        </button>
      </div>
    </div>
  </div>
);

export default Dashboard; 