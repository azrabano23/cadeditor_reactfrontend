import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowRight, Github, ExternalLink } from 'lucide-react';
import './App.css';
import SupabaseTest from './components/SupabaseTest';
import WebGLViewer from './components/WebGLViewer';
import ARViewer from './components/ARViewer';
import DemoCarousel from './components/DemoCarousel';
import SmartFileManager from './components/SmartFileManager';
import DeploymentManager from './components/DeploymentManager';
import ModernButton from './components/ModernButton';
import ModernUploadZone from './components/ModernUploadZone';
import ModernFileCard from './components/ModernFileCard';
import logo from './assets/logo.svg';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded' | 'converting' | 'converted' | 'deploying-ar' | 'ar-ready' | 'error';
  originalFormat: string;
  convertedUrl?: string;
  webglDeployed?: boolean;
  arPlatform?: 'android' | 'uwp';
  deploymentReady?: boolean;
  errorMessage?: string;
  uploadPath?: string;
  file_size?: number;
  original_name?: string;
  original_format?: string;
  converted_url?: string;
  uploadedAt: Date;
  lastModified: Date;
  folder?: string;
  tags?: string[];
  thumbnail?: string;
  metadata?: {
    dimensions?: string;
    triangles?: number;
    vertices?: number;
    complexity?: 'Low' | 'Medium' | 'High';
    estimatedConversionTime?: string;
  };
}

function App() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showWebGLViewer, setShowWebGLViewer] = useState(false);
  const [showARViewer, setShowARViewer] = useState(false);
  const [currentModelUrl, setCurrentModelUrl] = useState<string | undefined>(undefined);
  const [useSmartFileManager, setUseSmartFileManager] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['stl', 'step', 'obj', 'ply', 'dae'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    Array.from(fileList).forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (!extension || !supportedFormats.includes(extension)) {
        alert(`Unsupported file format: ${extension}. Supported formats: ${supportedFormats.join(', ')}`);
        return;
      }
      
      if (file.size > maxFileSize) {
        alert(`File too large: ${file.name}. Maximum size is 50MB.`);
        return;
      }
      
      const uploadedFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        originalFormat: extension,
        uploadedAt: new Date(),
        lastModified: new Date(),
        metadata: {
          complexity: file.size > 20 * 1024 * 1024 ? 'High' : file.size > 5 * 1024 * 1024 ? 'Medium' : 'Low',
          estimatedConversionTime: file.size > 20 * 1024 * 1024 ? '2-3 minutes' : file.size > 5 * 1024 * 1024 ? '45-90 seconds' : '15-30 seconds'
        }
      };
      
      newFiles.push(uploadedFile);
      
      // Real upload process
      uploadFile(file, uploadedFile);
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const uploadFile = async (file: File, uploadedFile: UploadedFile) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      setFiles(prev => prev.map(f => 
        f.name === uploadedFile.name ? { 
          ...f, 
          status: 'uploaded',
          id: result.file.id || f.id
        } : f
      ));
      
      console.log('✅ Upload successful:', result);
    } catch (error) {
      console.error('❌ Upload failed:', error);
      setFiles(prev => prev.map(f => 
        f.name === uploadedFile.name ? { 
          ...f, 
          status: 'error',
          errorMessage: 'Upload failed. Please try again.'
        } : f
      ));
    }
  };

  const convertToFBX = async (file: UploadedFile) => {
    if (!file.id) {
      console.error('File ID is missing');
      return;
    }

    setFiles(prev => prev.map(f => 
      f.name === file.name ? { ...f, status: 'converting' } : f
    ));

    try {
      const response = await fetch(`http://localhost:5000/api/convert/${file.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const result = await response.json();
      
      setFiles(prev => prev.map(f => 
        f.name === file.name ? { 
          ...f, 
          status: 'converted',
          convertedUrl: result.convertedUrl,
          webglDeployed: result.webglDeployed
        } : f
      ));

      console.log('✅ Conversion and WebGL build successful:', result);
    } catch (error) {
      console.error('❌ Conversion failed:', error);
      setFiles(prev => prev.map(f => 
        f.name === file.name ? { 
          ...f, 
          status: 'error',
          errorMessage: 'Conversion failed. Please try again.'
        } : f
      ));
    }
  };

  const deployToAR = async (file: UploadedFile, platform: 'android' | 'uwp') => {
    if (!file.id) {
      console.error('File ID is missing');
      return;
    }

    setFiles(prev => prev.map(f => 
      f.name === file.name ? { ...f, status: 'deploying-ar' } : f
    ));

    try {
      const response = await fetch(`http://localhost:5000/api/deploy-ar/${file.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ platform })
      });

      if (!response.ok) {
        throw new Error('AR deployment failed');
      }

      const result = await response.json();
      
      setFiles(prev => prev.map(f => 
        f.name === file.name ? { 
          ...f, 
          status: 'ar-ready',
          arPlatform: platform,
          deploymentReady: result.deploymentReady
        } : f
      ));

      console.log(`✅ AR deployment successful for ${platform}:`, result);
    } catch (error) {
      console.error('❌ AR deployment failed:', error);
      setFiles(prev => prev.map(f => 
        f.name === file.name ? { 
          ...f, 
          status: 'error',
          errorMessage: `AR deployment failed for ${platform}. Please try again.`
        } : f
      ));
    }
  };

  const openARViewer = (file: UploadedFile) => {
    if (file.status === 'converted' && file.convertedUrl) {
      setCurrentModelUrl(file.convertedUrl);
      setShowARViewer(true);
    }
  };

  const openWebGLViewer = (file: UploadedFile) => {
    if (file.status === 'converted' && file.convertedUrl) {
      setCurrentModelUrl(file.convertedUrl);
      setShowWebGLViewer(true);
    }
  };

  const closeViewers = () => {
    setShowWebGLViewer(false);
    setShowARViewer(false);
    setCurrentModelUrl(undefined);
  };

  const handleFileAction = (action: string, fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    switch (action) {
      case 'convert':
        convertToFBX(file);
        break;
      case 'viewWebGL':
        openWebGLViewer(file);
        break;
      case 'viewAR':
        openARViewer(file);
        break;
      case 'download':
        console.log('Download file:', file.name);
        break;
      case 'share':
        console.log('Share file:', file.name);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleBulkAction = (action: string, fileIds: string[]) => {
    console.log(`Bulk ${action} for files:`, fileIds);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading': return '⏳';
      case 'uploaded': return '✅';
      case 'converting': return '🔄';
      case 'converted': return '🎯';
      case 'error': return '❌';
      default: return '📄';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'uploaded': return 'Ready for conversion';
      case 'converting': return 'Converting to FBX...';
      case 'converted': return 'Ready for AR';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <img src={logo} alt="HoloDraft Logo" className="logo-svg" />
            <span className="logo-text">HoloDraft</span>
          </div>
          <div className="nav-links">
            {/* Simplified navigation - removed non-functional links */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">HoloDraft</h1>
            <p className="hero-subtitle">Enterprise CAD-to-AR Platform</p>
            <p className="hero-description">
              Revolutionary platform converting CAD files to immersive AR experiences. 
              Streamlined pipeline from design files to MetaQuest deployment with WebGL preview capability.
            </p>
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <ModernButton 
                variant="primary" 
                size="lg"
                icon={<Upload className="w-5 h-5" />}
                onClick={() => {
                  const uploadSection = document.querySelector('.upload-section');
                  uploadSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Converting
              </ModernButton>
            </motion.div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">5+</span>
                <span className="stat-label">File Formats</span>
              </div>
              <div className="stat">
                <span className="stat-number">Real-time</span>
                <span className="stat-label">Conversion</span>
              </div>
              <div className="stat">
                <span className="stat-number">AR-Ready</span>
                <span className="stat-label">Output</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-graphic">
              <div className="floating-card card-1"></div>
              <div className="floating-card card-2"></div>
              <div className="floating-card card-3"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Installation Requirements */}
        <section className="installation-requirements">
          <div className="container text-center mb-12">
            <h2 className="text-3xl font-bold text-green-500 mb-8">🔧 System Requirements</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Please ensure you have installed the following before using HoloDraft:
            </p>
            <ul className="list-disc text-lg text-gray-300 text-left mx-auto mb-8" style={{ maxWidth: '400px' }}>
              <li><strong>Unity 2022.3 LTS</strong> - For building WebGL and AR features</li>
              <li><strong>Node.js 18+</strong> - Required for backend server</li>
              <li><strong>Blender 4.0+</strong> - For CAD file conversion</li>
              <li><strong>MetaQuest Device</strong> - For AR viewing</li>
            </ul>
          </div>
        </section>

        {/* Project Overview */}
        <section className="project-overview">
          <div className="container">
            <h2>What is HoloDraft?</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <div className="card-icon">⚡</div>
                <h3>Revolutionary CAD Experience</h3>
                <p>
                  HoloDraft bridges the gap between traditional CAD software and immersive AR technology. 
                  Our platform enables engineers, designers, and creators to view and edit their 3D models 
                  in a completely new dimension.
                </p>
              </div>
              <div className="overview-card">
                <div className="card-icon">🔄</div>
                <h3>Seamless File Conversion</h3>
                <p>
                  Upload your existing CAD files in multiple formats (STL, STEP, OBJ, PLY, DAE) and 
                  watch as our advanced pipeline converts them to AR-ready FBX files optimized for 
                  MetaQuest visualization.
                </p>
              </div>
              <div className="overview-card">
                <div className="card-icon">👓</div>
                <h3>MetaQuest Integration</h3>
                <p>
                  Experience your designs like never before. Walk around, scale, and manipulate 
                  your 3D models in real space using MetaQuest's cutting-edge AR capabilities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Carousel Section */}
        <DemoCarousel />

        {/* Upload Section */}
        <section className="upload-section">
          <div className="container mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 text-4xl font-bold text-green-500"
            >
              Upload Your CAD Files
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ModernUploadZone
                onDrop={handleFiles}
                accept={supportedFormats.map(f => `.${f}`).join(',')}
                supportedFormats={supportedFormats}
                maxSize={maxFileSize}
              />
            </motion.div>
          </div>
        </section>

        {files.length > 0 && (
          <section className="files-section">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-green-500 mb-4">
                  📋 Your Files
                </h2>
                <div className="flex justify-center gap-4 mb-8">
                  <ModernButton
                    variant={!useSmartFileManager ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setUseSmartFileManager(false)}
                  >
                    Simple View
                  </ModernButton>
                  <ModernButton
                    variant={useSmartFileManager ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setUseSmartFileManager(true)}
                  >
                    Smart Manager
                  </ModernButton>
                </div>
              </motion.div>
              
              {useSmartFileManager ? (
                <SmartFileManager
                  files={files}
                  onFileAction={handleFileAction}
                  onBulkAction={handleBulkAction}
                  onFileUpload={handleFiles}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  <AnimatePresence>
                    {files.map((file, index) => (
                      <motion.div
                        key={file.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ModernFileCard
                          file={file}
                          onConvert={() => convertToFBX(file)}
                          onViewWebGL={() => openWebGLViewer(file)}
                          onViewAR={() => openARViewer(file)}
                          onDeployAR={(platform) => deployToAR(file, platform)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Process Explanation Section */}
        <section className="process-explanation">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-bold text-green-500 mb-8">📋 How the Process Works</h2>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                Our streamlined 4-step process transforms your CAD files into immersive AR experiences in minutes
              </p>
              
              {/* Large Marketing CTA */}
              <div className="mega-cta-container">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="mega-cta-wrapper"
                >
                  <button
                    className="mega-cta-button"
                    onClick={() => {
                      const uploadSection = document.querySelector('.upload-section');
                      uploadSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className="mega-cta-content">
                      <div className="mega-cta-icon">🚀</div>
                      <div className="mega-cta-text">
                        <span className="mega-cta-title">Start Converting Your CAD Files</span>
                        <span className="mega-cta-subtitle">Upload • Convert • Experience in AR</span>
                      </div>
                      <div className="mega-cta-arrow">→</div>
                    </div>
                    <div className="mega-cta-glow"></div>
                  </button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="mega-cta-features"
                >
                  <div className="feature-badge">✨ 5+ File Formats</div>
                  <div className="feature-badge">⚡ Real-time Conversion</div>
                  <div className="feature-badge">🥽 AR-Ready Output</div>
                </motion.div>
              </div>
            </motion.div>
            
            <div className="process-grid">
              <motion.div 
                className="process-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="step-icon">📤</div>
                <h3>1. Upload CAD Files</h3>
                <p className="step-detail">
                  Drag and drop or select your CAD files from your computer. 
                  We support STL, STEP, OBJ, PLY, and DAE formats up to 50MB each.
                  Files are securely uploaded to our cloud storage.
                </p>
                <div className="step-actions">
                  <ModernButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const uploadSection = document.querySelector('.upload-section');
                      uploadSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Start Upload
                  </ModernButton>
                </div>
              </motion.div>
              
              <motion.div 
                className="arrow-right"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <ArrowRight className="w-8 h-8 text-green-500" />
              </motion.div>
              
              <motion.div 
                className="process-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="step-icon">🔄</div>
                <h3>2. Automatic Conversion</h3>
                <p className="step-detail">
                  Our Blender-powered conversion engine automatically processes your files.
                  CAD files are optimized and converted to FBX format, which is compatible 
                  with both WebGL browsers and AR devices like MetaQuest.
                </p>
                <div className="step-actions">
                  <ModernButton
                    variant="outline"
                    size="sm"
                    disabled
                  >
                    Automated
                  </ModernButton>
                </div>
              </motion.div>
              
              <motion.div 
                className="arrow-right"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <ArrowRight className="w-8 h-8 text-green-500" />
              </motion.div>
              
              <motion.div 
                className="process-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="step-icon">🌐</div>
                <h3>3. WebGL Preview</h3>
                <p className="step-detail">
                  View your 3D models instantly in your web browser using WebGL technology.
                  No downloads or plugins required. Rotate, zoom, and inspect your models 
                  before deploying to AR.
                </p>
                <div className="step-actions">
                  <ModernButton
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWebGLViewer(true)}
                  >
                    Demo WebGL
                  </ModernButton>
                </div>
              </motion.div>
              
              <motion.div 
                className="arrow-right"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <ArrowRight className="w-8 h-8 text-green-500" />
              </motion.div>
              
              <motion.div 
                className="process-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="step-icon">🥽</div>
                <h3>4. AR Deployment</h3>
                <p className="step-detail">
                  Deploy your models to MetaQuest AR devices for immersive viewing and editing.
                  Walk around your 3D designs, scale them to real-world size, and make 
                  real-time modifications in augmented reality.
                </p>
                <div className="step-actions">
                  <ModernButton
                    variant="outline"
                    size="sm"
                    onClick={() => setShowARViewer(true)}
                  >
                    Demo AR
                  </ModernButton>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technology Explanation Section */}
        <section className="tech-explanation">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-green-500 mb-6">🔧 Technology Behind HoloDraft</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Our cutting-edge technology stack powers seamless CAD-to-AR transformations
              </p>
              <div className="flex justify-center gap-4 mb-8">
                <ModernButton
                  variant="secondary"
                  size="lg"
                  icon={<Github className="w-5 h-5" />}
                  onClick={() => window.open('https://github.com/yourusername/holodraft', '_blank')}
                >
                  View Source
                </ModernButton>
                <ModernButton
                  variant="outline"
                  size="lg"
                  icon={<ExternalLink className="w-5 h-5" />}
                  onClick={() => {
                    const techSpecs = document.querySelector('.tech-specs');
                    techSpecs?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Technical Specs
                </ModernButton>
              </div>
            </motion.div>
            
            <div className="tech-grid">
              <motion.div 
                className="tech-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="tech-icon">🌐</div>
                <h3>WebGL Technology</h3>
                <p>
                  <strong>WebGL (Web Graphics Library)</strong> enables hardware-accelerated 3D graphics 
                  directly in web browsers without any plugins. Our Unity-powered WebGL builds allow 
                  you to view and interact with your CAD models instantly in any modern browser.
                </p>
                <div className="tech-actions">
                  <ModernButton
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWebGLViewer(true)}
                  >
                    Try WebGL Demo
                  </ModernButton>
                  <ModernButton
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API', '_blank')}
                  >
                    Learn More
                  </ModernButton>
                </div>
              </motion.div>
              
              <motion.div 
                className="tech-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="tech-icon">🥽</div>
                <h3>MetaQuest AR Integration</h3>
                <p>
                  Deploy your converted models directly to MetaQuest devices for immersive AR experiences. 
                  Our platform generates optimized builds that work seamlessly with MetaQuest's 
                  spatial computing capabilities for real-world design visualization.
                </p>
                <div className="tech-actions">
                  <ModernButton
                    variant="outline"
                    size="sm"
                    onClick={() => setShowARViewer(true)}
                  >
                    Try AR Demo
                  </ModernButton>
                  <ModernButton
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('https://www.meta.com/quest/', '_blank')}
                  >
                    Meta Quest
                  </ModernButton>
                </div>
              </motion.div>
              
              <motion.div 
                className="tech-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="tech-icon">🔄</div>
                <h3>Blender Conversion Pipeline</h3>
                <p>
                  Our backend uses Blender's powerful Python API to convert between CAD formats. 
                  Files are processed through an automated pipeline that optimizes geometry, 
                  materials, and textures for both web and AR viewing.
                </p>
                <div className="tech-actions">
                  <ModernButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const uploadSection = document.querySelector('.upload-section');
                      uploadSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Try Conversion
                  </ModernButton>
                  <ModernButton
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('https://docs.blender.org/api/current/', '_blank')}
                  >
                    Blender API
                  </ModernButton>
                </div>
              </motion.div>
              
              <motion.div 
                className="tech-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="tech-icon">☁️</div>
                <h3>Cloud-Based Processing</h3>
                <p>
                  All file processing happens in the cloud using our scalable infrastructure. 
                  Upload files securely through our React frontend, process them with our 
                  Node.js backend, and store results in Supabase for instant access.
                </p>
                <div className="tech-actions">
                  <ModernButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const uploadSection = document.querySelector('.upload-section');
                      uploadSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Upload Files
                  </ModernButton>
                  <ModernButton
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('https://supabase.com/', '_blank')}
                  >
                    Supabase
                  </ModernButton>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Development Requirements Section */}
        <section className="dev-requirements">
          <div className="container">
            <h2 className="text-center mb-12 text-3xl font-bold text-green-500">💻 Development Setup</h2>
            <div className="requirements-grid">
              <div className="requirement-card">
                <div className="req-icon">🔧</div>
                <h3>Required Tools</h3>
                <ul>
                  <li><strong>Unity:</strong> 2022.3.0f1+ for WebGL builds</li>
                  <li><strong>Node.js:</strong> v18+ for backend API</li>
                  <li><strong>Python:</strong> 3.8+ for Blender automation</li>
                  <li><strong>Blender:</strong> 3.0+ for file conversion</li>
                </ul>
              </div>
              <div className="requirement-card">
                <div className="req-icon">📦</div>
                <h3>File Processing Pipeline</h3>
                <ol>
                  <li><strong>Upload:</strong> Files stored in Supabase</li>
                  <li><strong>Convert:</strong> Blender API processes to FBX</li>
                  <li><strong>WebGL:</strong> Unity builds for browser preview</li>
                  <li><strong>Deploy:</strong> MetaQuest AR generation</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Specs */}
        <section className="tech-specs">
          <div className="container">
            <h2>🔧 Technical Architecture</h2>
            <div className="specs-grid">
              <div className="spec-item">
                <div className="spec-icon">⚛️</div>
                <strong>Frontend</strong>
                <p>React + TypeScript</p>
              </div>
              <div className="spec-item">
                <div className="spec-icon">🖥️</div>
                <strong>Backend</strong>
                <p>Node.js + Express</p>
              </div>
              <div className="spec-item">
                <div className="spec-icon">⚙️</div>
                <strong>Conversion</strong>
                <p>Python + Blender API</p>
              </div>
              <div className="spec-item">
                <div className="spec-icon">🗄️</div>
                <strong>Database</strong>
                <p>Supabase</p>
              </div>
              <div className="spec-item">
                <div className="spec-icon">🥽</div>
                <strong>AR Platform</strong>
                <p>MetaQuest Compatible</p>
              </div>
              <div className="spec-item">
                <div className="spec-icon">📁</div>
                <strong>File Formats</strong>
                <p>STL → STEP → OBJ → FBX</p>
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
      
      {/* WebGL Viewer Modal */}
      {showWebGLViewer && (
        <WebGLViewer
          modelUrl={currentModelUrl}
          onClose={closeViewers}
        />
      )}
      
      {/* AR Viewer Modal */}
      {showARViewer && (
        <ARViewer
          modelUrl={currentModelUrl}
          onClose={closeViewers}
        />
      )}
    </div>
  );
}

export default App;
