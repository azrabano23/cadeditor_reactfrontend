import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bluetooth, Usb, Wifi, Smartphone, Monitor, CheckCircle, AlertCircle } from 'lucide-react';
import ModernButton from './ModernButton';

interface DeploymentManagerProps {
  file: {
    id: string;
    name: string;
    convertedUrl?: string;
  };
  onClose: () => void;
  onDeploy: (method: 'bluetooth' | 'usb' | 'wifi', platform: 'android' | 'uwp') => void;
}

type ConnectionMethod = 'bluetooth' | 'usb' | 'wifi';
type Platform = 'android' | 'uwp';

const DeploymentManager: React.FC<DeploymentManagerProps> = ({ file, onClose, onDeploy }) => {
  const [selectedMethod, setSelectedMethod] = useState<ConnectionMethod>('usb');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('android');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'connecting' | 'deploying' | 'success' | 'error'>('idle');

  const connectionMethods = [
    {
      id: 'usb' as const,
      name: 'USB Cable',
      icon: <Usb className="w-6 h-6" />,
      description: 'Direct wired connection via USB cable',
      requirements: ['USB cable', 'Developer mode enabled', 'ADB drivers installed'],
      reliability: 'High',
      speed: 'Fast'
    },
    {
      id: 'wifi' as const,
      name: 'WiFi',
      icon: <Wifi className="w-6 h-6" />,
      description: 'Wireless deployment over local network',
      requirements: ['Same WiFi network', 'Developer mode enabled', 'Device IP address'],
      reliability: 'Medium',
      speed: 'Medium'
    },
    {
      id: 'bluetooth' as const,
      name: 'Bluetooth',
      icon: <Bluetooth className="w-6 h-6" />,
      description: 'Bluetooth pairing for deployment',
      requirements: ['Bluetooth enabled', 'Device paired', 'Compatible drivers'],
      reliability: 'Medium',
      speed: 'Slow'
    }
  ];

  const platforms = [
    {
      id: 'android' as const,
      name: 'MetaQuest',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Deploy to MetaQuest 2/3 devices',
      buildType: 'Android APK'
    },
    {
      id: 'uwp' as const,
      name: 'HoloLens',
      icon: <Monitor className="w-6 h-6" />,
      description: 'Deploy to Microsoft HoloLens 2',
      buildType: 'UWP Package'
    }
  ];

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStatus('connecting');

    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDeploymentStatus('deploying');
      
      // Call the actual deployment function
      onDeploy(selectedMethod, selectedPlatform);
      
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setDeploymentStatus('success');
    } catch (error) {
      setDeploymentStatus('error');
    } finally {
      setIsDeploying(false);
    }
  };

  const getMethodInstructions = () => {
    const method = connectionMethods.find(m => m.id === selectedMethod);
    const platform = platforms.find(p => p.id === selectedPlatform);
    
    if (!method || !platform) return '';

    switch (selectedMethod) {
      case 'usb':
        return selectedPlatform === 'android' 
          ? `1. Connect MetaQuest via USB cable\n2. Enable Developer Mode in Oculus app\n3. Allow USB debugging on device\n4. Verify ADB connection`
          : `1. Connect HoloLens via USB cable\n2. Enable Developer Mode in Windows Settings\n3. Install Windows SDK\n4. Verify device connection`;
      
      case 'wifi':
        return selectedPlatform === 'android'
          ? `1. Connect MetaQuest and computer to same WiFi\n2. Enable wireless debugging on Quest\n3. Find device IP in network settings\n4. Pair devices wirelessly`
          : `1. Connect HoloLens and computer to same WiFi\n2. Enable Device Portal on HoloLens\n3. Access device via web browser\n4. Upload and install package`;
      
      case 'bluetooth':
        return selectedPlatform === 'android'
          ? `1. Enable Bluetooth on both devices\n2. Pair MetaQuest with computer\n3. Install Bluetooth deployment tools\n4. Verify connection stability`
          : `1. Enable Bluetooth on both devices\n2. Pair HoloLens with computer\n3. Use Windows Device Portal\n4. Deploy via Bluetooth connection`;
      
      default:
        return '';
    }
  };

  return (
    <div className="deployment-manager-overlay">
      <motion.div 
        className="deployment-manager-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="deployment-header">
          <h2>🚀 Deploy to AR Device</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="deployment-content">
          <div className="file-info">
            <h3>📄 {file.name}</h3>
            <p>Ready for deployment to AR device</p>
          </div>

          {/* Platform Selection */}
          <div className="platform-selection">
            <h4>📱 Select Target Platform</h4>
            <div className="platform-grid">
              {platforms.map((platform) => (
                <motion.div
                  key={platform.id}
                  className={`platform-card ${selectedPlatform === platform.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPlatform(platform.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="platform-icon">{platform.icon}</div>
                  <h5>{platform.name}</h5>
                  <p>{platform.description}</p>
                  <span className="build-type">{platform.buildType}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Connection Method Selection */}
          <div className="connection-selection">
            <h4>🔗 Select Connection Method</h4>
            <div className="connection-grid">
              {connectionMethods.map((method) => (
                <motion.div
                  key={method.id}
                  className={`connection-card ${selectedMethod === method.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="connection-icon">{method.icon}</div>
                  <h5>{method.name}</h5>
                  <p>{method.description}</p>
                  <div className="connection-stats">
                    <span className="reliability">🎯 {method.reliability}</span>
                    <span className="speed">⚡ {method.speed}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="deployment-instructions">
            <h4>📋 Setup Instructions</h4>
            <div className="instructions-box">
              <pre>{getMethodInstructions()}</pre>
            </div>
          </div>

          {/* Requirements */}
          <div className="requirements">
            <h4>✅ Requirements</h4>
            <ul>
              {connectionMethods.find(m => m.id === selectedMethod)?.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Deployment Status */}
          {deploymentStatus !== 'idle' && (
            <motion.div 
              className="deployment-status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {deploymentStatus === 'connecting' && (
                <div className="status-item">
                  <div className="status-icon animate-spin">🔄</div>
                  <span>Connecting to device...</span>
                </div>
              )}
              
              {deploymentStatus === 'deploying' && (
                <div className="status-item">
                  <div className="status-icon animate-pulse">📡</div>
                  <span>Deploying application...</span>
                </div>
              )}
              
              {deploymentStatus === 'success' && (
                <div className="status-item success">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Deployment successful! Check your device.</span>
                </div>
              )}
              
              {deploymentStatus === 'error' && (
                <div className="status-item error">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <span>Deployment failed. Check connection and try again.</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="deployment-actions">
            <ModernButton
              variant="secondary"
              onClick={onClose}
              disabled={isDeploying}
            >
              Cancel
            </ModernButton>
            
            <ModernButton
              variant="primary"
              onClick={handleDeploy}
              disabled={isDeploying || !file.convertedUrl}
              className="deploy-button"
            >
              {isDeploying ? 'Deploying...' : `Deploy via ${selectedMethod.toUpperCase()}`}
            </ModernButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeploymentManager;
