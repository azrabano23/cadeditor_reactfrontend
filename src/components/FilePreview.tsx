import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Info, Maximize, X, Download, Share2 } from 'lucide-react';
import ModernButton from './ModernButton';

interface FileMetadata {
  dimensions?: string;
  triangles?: number;
  vertices?: number;
  materials?: number;
  textures?: boolean;
  animations?: boolean;
  complexity?: 'Low' | 'Medium' | 'High';
  estimatedConversionTime?: string;
}

interface FilePreviewProps {
  file: {
    name: string;
    size: number;
    type: string;
    originalFormat: string;
    uploadedAt?: Date;
  };
  metadata?: FileMetadata;
  thumbnailUrl?: string;
  onClose: () => void;
  onConvert?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  metadata,
  thumbnailUrl,
  onClose,
  onConvert,
  onDownload,
  onShare
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'history'>('overview');

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFormatIcon = (format: string) => {
    const formatIcons: { [key: string]: string } = {
      'stl': '🔷',
      'step': '⚙️',
      'obj': '📦',
      'ply': '🔸',
      'dae': '🎯',
      'fbx': '🎪'
    };
    return formatIcons[format.toLowerCase()] || '📄';
  };

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case 'Low': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'High': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <motion.div
      className="file-preview-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`file-preview-container ${isFullscreen ? 'fullscreen' : ''}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="preview-header">
          <div className="header-left">
            <span className="file-icon">{getFormatIcon(file.originalFormat)}</span>
            <div className="file-title-section">
              <h2 className="file-title">{file.name}</h2>
              <div className="file-badges">
                <span className="format-badge">{file.originalFormat.toUpperCase()}</span>
                <span className="size-badge">{formatFileSize(file.size)}</span>
                {metadata?.complexity && (
                  <span className={`complexity-badge ${getComplexityColor(metadata.complexity)}`}>
                    {metadata.complexity} Complexity
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="header-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Toggle Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
            <button className="header-btn close-btn" onClick={onClose} title="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="preview-content">
          {/* Left Panel - Visual Preview */}
          <div className="preview-visual-panel">
            <div className="thumbnail-container">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt={file.name} className="file-thumbnail" />
              ) : (
                <div className="thumbnail-placeholder">
                  <span className="placeholder-icon">{getFormatIcon(file.originalFormat)}</span>
                  <span className="placeholder-text">
                    {file.originalFormat.toUpperCase()} File
                  </span>
                  <span className="placeholder-subtext">Preview will be generated after upload</span>
                </div>
              )}
              <div className="thumbnail-overlay">
                <ModernButton
                  variant="secondary"
                  size="sm"
                  icon={<Eye className="w-4 h-4" />}
                >
                  View 3D
                </ModernButton>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <ModernButton
                variant="primary"
                size="md"
                icon={<Download className="w-4 h-4" />}
                onClick={onConvert}
                disabled={!onConvert}
              >
                Convert to FBX
              </ModernButton>
              <div className="action-row">
                <ModernButton
                  variant="secondary"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={onDownload}
                  disabled={!onDownload}
                >
                  Download
                </ModernButton>
                <ModernButton
                  variant="secondary"
                  size="sm"
                  icon={<Share2 className="w-4 h-4" />}
                  onClick={onShare}
                  disabled={!onShare}
                >
                  Share
                </ModernButton>
              </div>
            </div>
          </div>

          {/* Right Panel - Information Tabs */}
          <div className="preview-info-panel">
            {/* Tab Navigation */}
            <div className="tab-navigation">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === 'technical' ? 'active' : ''}`}
                onClick={() => setActiveTab('technical')}
              >
                Technical
              </button>
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-tab">
                  <div className="info-section">
                    <h4>File Information</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Format:</span>
                        <span className="info-value">{file.originalFormat.toUpperCase()}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Size:</span>
                        <span className="info-value">{formatFileSize(file.size)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Type:</span>
                        <span className="info-value">{file.type || 'CAD Model'}</span>
                      </div>
                      {file.uploadedAt && (
                        <div className="info-item">
                          <span className="info-label">Uploaded:</span>
                          <span className="info-value">
                            {file.uploadedAt.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {metadata?.estimatedConversionTime && (
                    <div className="info-section">
                      <h4>Conversion Estimate</h4>
                      <div className="estimate-card">
                        <div className="estimate-time">
                          <span className="estimate-number">~{metadata.estimatedConversionTime}</span>
                          <span className="estimate-label">Estimated Time</span>
                        </div>
                        <div className="estimate-quality">
                          <span className="quality-indicator">High Quality</span>
                          <span className="quality-description">
                            Optimized for AR viewing
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'technical' && metadata && (
                <div className="technical-tab">
                  <div className="info-section">
                    <h4>Geometry Data</h4>
                    <div className="info-grid">
                      {metadata.dimensions && (
                        <div className="info-item">
                          <span className="info-label">Dimensions:</span>
                          <span className="info-value">{metadata.dimensions}</span>
                        </div>
                      )}
                      {metadata.vertices && (
                        <div className="info-item">
                          <span className="info-label">Vertices:</span>
                          <span className="info-value">{metadata.vertices.toLocaleString()}</span>
                        </div>
                      )}
                      {metadata.triangles && (
                        <div className="info-item">
                          <span className="info-label">Triangles:</span>
                          <span className="info-value">{metadata.triangles.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>Content Features</h4>
                    <div className="feature-list">
                      <div className={`feature-item ${metadata.materials ? 'enabled' : 'disabled'}`}>
                        <span className="feature-icon">🎨</span>
                        <span className="feature-text">
                          Materials {metadata.materials ? `(${metadata.materials})` : '(None)'}
                        </span>
                      </div>
                      <div className={`feature-item ${metadata.textures ? 'enabled' : 'disabled'}`}>
                        <span className="feature-icon">🖼️</span>
                        <span className="feature-text">
                          Textures {metadata.textures ? '(Yes)' : '(No)'}
                        </span>
                      </div>
                      <div className={`feature-item ${metadata.animations ? 'enabled' : 'disabled'}`}>
                        <span className="feature-icon">🎬</span>
                        <span className="feature-text">
                          Animations {metadata.animations ? '(Yes)' : '(No)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="history-tab">
                  <div className="info-section">
                    <h4>File History</h4>
                    <div className="history-timeline">
                      <div className="timeline-item">
                        <div className="timeline-dot active"></div>
                        <div className="timeline-content">
                          <span className="timeline-title">File Uploaded</span>
                          <span className="timeline-time">
                            {file.uploadedAt?.toLocaleString() || 'Just now'}
                          </span>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-title">Ready for Conversion</span>
                          <span className="timeline-time">Pending</span>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-title">AR-Ready</span>
                          <span className="timeline-time">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilePreview;
