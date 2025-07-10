import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Eye, Smartphone, Download } from 'lucide-react';
import ModernButton from './ModernButton';

interface DemoModel {
  id: string;
  name: string;
  category: string;
  originalFormat: string;
  description: string;
  cadPreview: string;
  arPreview: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
  fileSize: string;
  conversionTime: string;
  industry: string;
}

const demoModels: DemoModel[] = [
  {
    id: '1',
    name: 'Modern Office Chair',
    category: 'Furniture Design',
    originalFormat: 'STEP',
    description: 'Ergonomic office chair with adjustable height and lumbar support. Perfect for workspace visualization in AR.',
    cadPreview: '🪑',
    arPreview: '🥽',
    complexity: 'Medium',
    fileSize: '12.3 MB',
    conversionTime: '45 seconds',
    industry: 'Furniture'
  },
  {
    id: '2',
    name: 'Mechanical Gear Assembly',
    category: 'Engineering',
    originalFormat: 'STL',
    description: 'Precision gear mechanism with multiple moving parts. Demonstrates complex mechanical relationships.',
    cadPreview: '⚙️',
    arPreview: '🔧',
    complexity: 'Complex',
    fileSize: '8.7 MB',
    conversionTime: '32 seconds',
    industry: 'Manufacturing'
  },
  {
    id: '3',
    name: 'Smartphone Case',
    category: 'Product Design',
    originalFormat: 'OBJ',
    description: 'Protective smartphone case with custom textures and precise fit. Great for product prototyping.',
    cadPreview: '📱',
    arPreview: '🛡️',
    complexity: 'Simple',
    fileSize: '4.2 MB',
    conversionTime: '18 seconds',
    industry: 'Consumer Electronics'
  },
  {
    id: '4',
    name: 'Architectural Model',
    category: 'Architecture',
    originalFormat: 'DAE',
    description: 'Modern building design with detailed interior layout. Perfect for architectural presentations.',
    cadPreview: '🏢',
    arPreview: '🏗️',
    complexity: 'Complex',
    fileSize: '28.9 MB',
    conversionTime: '2 minutes',
    industry: 'Architecture'
  },
  {
    id: '5',
    name: 'Engine Component',
    category: 'Automotive',
    originalFormat: 'PLY',
    description: 'High-precision engine part with intricate details. Ideal for automotive design review.',
    cadPreview: '🔩',
    arPreview: '🚗',
    complexity: 'Complex',
    fileSize: '15.6 MB',
    conversionTime: '58 seconds',
    industry: 'Automotive'
  }
];

const DemoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % demoModels.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % demoModels.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + demoModels.length) % demoModels.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Complex': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const currentModel = demoModels[currentIndex];

  return (
    <section className="demo-carousel-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-green-500 mb-4">
            🎯 See HoloDraft in Action
          </h2>
          <p className="text-zinc-300 text-lg max-w-3xl mx-auto">
            Explore real examples of CAD files transformed into AR-ready models. 
            See the quality, speed, and precision of our conversion pipeline.
          </p>
        </motion.div>

        <div className="demo-carousel-container">
          {/* Main Carousel */}
          <div className="carousel-wrapper">
            <button 
              className="carousel-nav carousel-nav-left"
              onClick={prevSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="carousel-slide"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <div className="slide-content">
                  {/* Preview Section */}
                  <div className="preview-section">
                    <div className="preview-before">
                      <div className="preview-header">
                        <span className="format-badge">{currentModel.originalFormat}</span>
                        <h4>Original CAD File</h4>
                      </div>
                      <div className="preview-visual">
                        <span className="preview-icon">{currentModel.cadPreview}</span>
                        <div className="preview-overlay">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="conversion-arrow">
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="arrow-container"
                      >
                        <span className="text-3xl text-green-500">→</span>
                        <div className="conversion-time">
                          <span className="text-xs text-green-400">{currentModel.conversionTime}</span>
                        </div>
                      </motion.div>
                    </div>

                    <div className="preview-after">
                      <div className="preview-header">
                        <span className="format-badge ar-badge">FBX</span>
                        <h4>AR-Ready Model</h4>
                      </div>
                      <div className="preview-visual ar-preview">
                        <span className="preview-icon">{currentModel.arPreview}</span>
                        <div className="preview-overlay">
                          <Smartphone className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Model Info */}
                  <div className="model-info">
                    <div className="model-header">
                      <h3 className="model-title">{currentModel.name}</h3>
                      <span className="model-category">{currentModel.category}</span>
                    </div>
                    
                    <p className="model-description">{currentModel.description}</p>
                    
                    <div className="model-stats">
                      <div className="stat-item">
                        <span className="stat-label">Complexity:</span>
                        <span className={`stat-value ${getComplexityColor(currentModel.complexity)}`}>
                          {currentModel.complexity}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">File Size:</span>
                        <span className="stat-value text-blue-400">{currentModel.fileSize}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Industry:</span>
                        <span className="stat-value text-purple-400">{currentModel.industry}</span>
                      </div>
                    </div>

                    <div className="model-actions">
                      <ModernButton
                        variant="primary"
                        size="md"
                        icon={<Play className="w-4 h-4" />}
                      >
                        Try This Model
                      </ModernButton>
                      <ModernButton
                        variant="secondary"
                        size="md"
                        icon={<Download className="w-4 h-4" />}
                      >
                        Download Sample
                      </ModernButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button 
              className="carousel-nav carousel-nav-right"
              onClick={nextSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {demoModels.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <div className="carousel-controls">
            <button
              className={`autoplay-toggle ${isAutoPlaying ? 'active' : ''}`}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            >
              {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoCarousel;
