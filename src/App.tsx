import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import SupabaseTest from './components/SupabaseTest';
import AuthComponent from './components/Auth';
import Dashboard from './components/Dashboard';
import { supabase } from './lib/supabaseClient';
import logo from './assets/logo.svg';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-accent text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Toaster position="top-right" />
        <AuthComponent onAuthSuccess={() => setUser(supabase.auth.getUser())} />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans dark">
        <Toaster position="top-right" />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/*" element={<Dashboard onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}

// Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans dark">
      {/* Navigation */}
      <nav className="w-full bg-black/80 border-b border-accent sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="HoloDraft Logo" className="w-10 h-10 rounded-lg shadow-md" />
            <span className="text-2xl font-extrabold text-accent tracking-tight">HoloDraft</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              className="bg-accent text-black font-bold px-5 py-2 rounded-lg shadow hover:scale-105 transition"
              onClick={() => {
                const uploadSection = document.querySelector('.upload-section');
                uploadSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Upload CAD
            </button>
            <a
              href="#how-it-works"
              className="text-white hover:text-accent font-medium transition"
            >
              Learn How It Works
            </a>
            <a
              href="/dashboard"
              className="bg-zinc-800 text-white font-bold px-5 py-2 rounded-lg shadow hover:bg-zinc-700 transition"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-black border-b-2 border-accent py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-10">
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              From <span className="text-accent">CAD</span> to <span className="text-accent">AR</span> —<br />
              Instantly Visualize Your Designs on <span className="text-accent">MetaQuest</span> & <span className="text-accent">HoloLens</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl">
              Upload your CAD files, preview them in WebGL, and launch in AR on your headset in seconds. Holodraft makes immersive design review effortless for engineers, designers, and teams.
            </p>
            <div className="flex gap-4 mt-2">
              <button
                className="bg-accent text-black font-bold px-6 py-3 rounded-lg shadow hover:scale-105 transition text-lg"
                onClick={() => {
                  const uploadSection = document.querySelector('.upload-section');
                  uploadSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Upload CAD
              </button>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-zinc-800 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-zinc-700 transition text-lg"
              >
                Go to Dashboard
              </a>
            </div>
            <div className="flex gap-8 mt-8">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-accent">1</span>
                <span className="text-sm text-gray-400">Upload CAD</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-accent">2</span>
                <span className="text-sm text-gray-400">View in WebGL</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-accent">3</span>
                <span className="text-sm text-gray-400">Launch in AR</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {/* Placeholder for animation/video/graphic */}
            <div className="w-72 h-72 bg-gradient-to-br from-accent/10 to-accent/30 rounded-3xl flex items-center justify-center border-2 border-accent/30">
              <span className="text-6xl">🛠️</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full bg-black">
        {/* System Requirements */}
        <section className="py-16 px-4" id="system-requirements">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-accent mb-6">System Requirements</h2>
            <div className="flex flex-col md:flex-row justify-center gap-8 text-left text-lg text-gray-300 mx-auto">
              <ul className="flex-1 space-y-2">
                <li><span className="font-semibold text-white">Unity 2022.3 LTS</span> <span className="text-gray-400">(WebGL & AR builds)</span></li>
                <li><span className="font-semibold text-white">Node.js 18+</span> <span className="text-gray-400">(Backend server)</span></li>
                <li><span className="font-semibold text-white">Blender 4.0+</span> <span className="text-gray-400">(CAD conversion)</span></li>
                <li><span className="font-semibold text-white">MetaQuest or HoloLens</span> <span className="text-gray-400">(AR viewing)</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3-Step Process Timeline */}
        <section className="py-20 px-4 bg-gradient-to-b from-black via-zinc-900 to-black" id="how-it-works">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-accent mb-10">How It Works</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent/10 border-2 border-accent mb-4 text-3xl">📤</div>
                <h3 className="text-xl font-semibold text-white mb-2">Step 1: Upload</h3>
                <p className="text-gray-300 mb-2">Drag and drop your CAD files (STL, STEP, OBJ, PLY, DAE). Secure, fast, and up to 50MB each.</p>
              </div>
              <div className="hidden md:block w-10 h-1 bg-accent rounded-full mx-2"></div>
              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent/10 border-2 border-accent mb-4 text-3xl">🌐</div>
                <h3 className="text-xl font-semibold text-white mb-2">Step 2: Preview</h3>
                <p className="text-gray-300 mb-2">Instant WebGL preview in-browser. Inspect, rotate, and zoom your model before AR launch.</p>
              </div>
              <div className="hidden md:block w-10 h-1 bg-accent rounded-full mx-2"></div>
              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent/10 border-2 border-accent mb-4 text-3xl">🥽</div>
                <h3 className="text-xl font-semibold text-white mb-2">Step 3: Launch in AR</h3>
                <p className="text-gray-300 mb-2">Connect to MetaQuest or HoloLens. Experience your design in real space, instantly.</p>
              </div>
            </div>
            <div className="flex gap-4 justify-center mt-10">
              <button
                className="bg-accent text-black font-bold px-8 py-3 rounded-lg shadow hover:scale-105 transition text-lg"
                onClick={() => {
                  const uploadSection = document.querySelector('.upload-section');
                  uploadSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Started
              </button>
              <a
                href="/dashboard"
                className="bg-zinc-800 text-white font-bold px-8 py-3 rounded-lg shadow hover:bg-zinc-700 transition text-lg"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </section>

        {/* Company Story / Why Holodraft */}
        <section className="py-20 px-4 bg-gradient-to-b from-zinc-900 via-black to-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-accent mb-6">Why Holodraft?</h2>
            <p className="text-lg text-gray-300 mb-8">Holodraft bridges the gap between traditional CAD and immersive AR. We empower teams to review, share, and experience 3D designs in real space—faster, easier, and more intuitively than ever before. Our mission: make advanced spatial visualization accessible to every engineer, designer, and innovator.</p>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
              <div className="flex-1 bg-zinc-800 rounded-xl p-6 shadow-lg">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-semibold text-white mb-1">Instant AR for CAD</h3>
                <p className="text-gray-400">No more waiting for IT or custom builds. Upload, preview, and launch in AR in seconds.</p>
              </div>
              <div className="flex-1 bg-zinc-800 rounded-xl p-6 shadow-lg">
                <div className="text-2xl mb-2">🤝</div>
                <h3 className="font-semibold text-white mb-1">For Teams & Investors</h3>
                <p className="text-gray-400">Built for collaboration, review, and rapid iteration. Investors see value instantly—no technical hurdles.</p>
              </div>
              <div className="flex-1 bg-zinc-800 rounded-xl p-6 shadow-lg">
                <div className="text-2xl mb-2">🌍</div>
                <h3 className="font-semibold text-white mb-1">Future-Proof Platform</h3>
                <p className="text-gray-400">Web-first, device-agnostic, and ready for the next wave of spatial computing.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={logo} alt="HoloDraft Logo" className="footer-logo-img" />
                <span className="logo-text">HoloDraft</span>
              </div>
              <p>Revolutionizing CAD design through AR technology</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 HoloDraft. Enterprise CAD-to-AR Platform.</p>
          </div>
        </div>
      </footer>
      
      {/* Supabase Connection Test */}
      <SupabaseTest />
    </div>
  );
};

export default App;
