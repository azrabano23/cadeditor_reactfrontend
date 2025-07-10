/**
 * Unity WebGL Bridge for HoloDraft
 * This file provides the JavaScript bridge between Unity WebGL and React
 */

// Global Unity communication functions
window.unityBridge = {
    instance: null,
    messageHandler: null,

    // Initialize Unity instance
    setInstance: function(instance) {
        this.instance = instance;
        console.log('Unity instance set:', instance);
    },

    // Set message handler for Unity events
    setMessageHandler: function(handler) {
        this.messageHandler = handler;
        console.log('Unity message handler set');
    },

    // Send message from Unity to React
    sendMessageToReact: function(methodName, data) {
        console.log('Unity -> React:', methodName, data);
        
        if (window.unityMessageHandler) {
            window.unityMessageHandler(methodName, data);
        } else if (this.messageHandler) {
            this.messageHandler(methodName, data);
        } else {
            console.warn('No message handler registered for Unity events');
        }
    },

    // Send message from React to Unity
    sendMessageToUnity: function(objectName, methodName, parameter) {
        if (this.instance && this.instance.SendMessage) {
            console.log('React -> Unity:', objectName, methodName, parameter);
            this.instance.SendMessage(objectName, methodName, parameter);
        } else {
            console.warn('Unity instance not available');
        }
    }
};

// Unity callbacks that will be called from C#
window.SendMessageToReact = function(methodName, data) {
    window.unityBridge.sendMessageToReact(methodName, data);
};

window.RegisterUnityCallbacks = function() {
    console.log('Unity callbacks registered');
    
    // Register any additional callbacks here
    window.unityCallbacksRegistered = true;
};

// WebGL Template Integration
window.unityWebGLConfig = {
    // Configuration for Unity WebGL builds
    dataUrl: "Build/Build.data",
    frameworkUrl: "Build/Build.framework.js",
    codeUrl: "Build/Build.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "HoloDraft",
    productName: "CAD Viewer",
    productVersion: "1.0",
    showBanner: false,
    
    // Progress callback
    progressCallback: function(progress) {
        console.log('Unity loading progress:', Math.round(progress * 100) + '%');
    },
    
    // Error callback
    errorCallback: function(error) {
        console.error('Unity loading error:', error);
    }
};

// Unity loading helper
window.loadUnityBuild = function(canvas, config, progressCallback) {
    return new Promise((resolve, reject) => {
        if (typeof createUnityInstance === 'undefined') {
            reject(new Error('Unity loader not available'));
            return;
        }

        const unityConfig = {
            ...window.unityWebGLConfig,
            ...config
        };

        createUnityInstance(canvas, unityConfig, progressCallback)
            .then(instance => {
                window.unityBridge.setInstance(instance);
                resolve(instance);
            })
            .catch(error => {
                reject(error);
            });
    });
};

// Model transformation utilities
window.unityTransforms = {
    // Convert Unity Vector3 to web format
    unityToWeb: function(unityVector) {
        return {
            x: unityVector.x,
            y: unityVector.y,
            z: unityVector.z
        };
    },

    // Convert web format to Unity Vector3
    webToUnity: function(webVector) {
        return {
            x: webVector.x || 0,
            y: webVector.y || 0,
            z: webVector.z || 0
        };
    },

    // Convert Unity Quaternion to Euler angles
    quaternionToEuler: function(q) {
        const sinr_cosp = 2 * (q.w * q.x + q.y * q.z);
        const cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y);
        const roll = Math.atan2(sinr_cosp, cosr_cosp);

        const sinp = 2 * (q.w * q.y - q.z * q.x);
        const pitch = Math.abs(sinp) >= 1 ? Math.PI / 2 * Math.sign(sinp) : Math.asin(sinp);

        const siny_cosp = 2 * (q.w * q.z + q.x * q.y);
        const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp);

        return {
            x: roll * 180 / Math.PI,
            y: pitch * 180 / Math.PI,
            z: yaw * 180 / Math.PI
        };
    },

    // Convert Euler angles to Unity Quaternion
    eulerToQuaternion: function(euler) {
        const roll = euler.x * Math.PI / 180;
        const pitch = euler.y * Math.PI / 180;
        const yaw = euler.z * Math.PI / 180;

        const cy = Math.cos(yaw * 0.5);
        const sy = Math.sin(yaw * 0.5);
        const cp = Math.cos(pitch * 0.5);
        const sp = Math.sin(pitch * 0.5);
        const cr = Math.cos(roll * 0.5);
        const sr = Math.sin(roll * 0.5);

        return {
            w: cr * cp * cy + sr * sp * sy,
            x: sr * cp * cy - cr * sp * sy,
            y: cr * sp * cy + sr * cp * sy,
            z: cr * cp * sy - sr * sp * cy
        };
    }
};

// AR Session utilities
window.unityAR = {
    sessions: new Map(),
    
    // Create new AR session
    createSession: function(fileId, config) {
        const sessionId = 'ar_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const session = {
            id: sessionId,
            fileId: fileId,
            config: config,
            startTime: Date.now(),
            isActive: true
        };
        
        this.sessions.set(sessionId, session);
        return session;
    },
    
    // Get AR session
    getSession: function(sessionId) {
        return this.sessions.get(sessionId);
    },
    
    // End AR session
    endSession: function(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.isActive = false;
            session.endTime = Date.now();
        }
        return session;
    },
    
    // List active sessions
    getActiveSessions: function() {
        return Array.from(this.sessions.values()).filter(s => s.isActive);
    }
};

// Unity performance monitoring
window.unityPerformance = {
    frameCount: 0,
    lastFrameTime: 0,
    averageFPS: 0,
    
    updateFPS: function() {
        const now = performance.now();
        if (this.lastFrameTime) {
            const deltaTime = now - this.lastFrameTime;
            const instantFPS = 1000 / deltaTime;
            this.averageFPS = this.averageFPS * 0.9 + instantFPS * 0.1;
        }
        this.lastFrameTime = now;
        this.frameCount++;
    },
    
    getFPS: function() {
        return Math.round(this.averageFPS);
    },
    
    getFrameCount: function() {
        return this.frameCount;
    }
};

// File format utilities
window.unityFileUtils = {
    supportedFormats: ['fbx', 'obj', 'dae', 'gltf', 'glb'],
    
    isSupported: function(format) {
        return this.supportedFormats.includes(format.toLowerCase());
    },
    
    getFormatInfo: function(format) {
        const formatMap = {
            'fbx': { name: 'Autodesk FBX', supportsAnimations: true, supportsMaterials: true },
            'obj': { name: 'Wavefront OBJ', supportsAnimations: false, supportsMaterials: true },
            'dae': { name: 'COLLADA', supportsAnimations: true, supportsMaterials: true },
            'gltf': { name: 'glTF 2.0', supportsAnimations: true, supportsMaterials: true },
            'glb': { name: 'glTF Binary', supportsAnimations: true, supportsMaterials: true }
        };
        
        return formatMap[format.toLowerCase()] || { name: 'Unknown', supportsAnimations: false, supportsMaterials: false };
    }
};

// Unity error handling
window.unityErrorHandler = {
    errors: [],
    
    logError: function(error, context) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            error: error,
            context: context || 'unknown',
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.errors.push(errorEntry);
        console.error('Unity Error:', errorEntry);
        
        // Send to analytics/monitoring service
        this.reportError(errorEntry);
    },
    
    reportError: function(errorEntry) {
        // In production, send to your error tracking service
        console.log('Reporting error:', errorEntry);
    },
    
    getRecentErrors: function(limit = 10) {
        return this.errors.slice(-limit);
    }
};

// Debug utilities
window.unityDebug = {
    enabled: process.env.NODE_ENV === 'development',
    
    log: function(...args) {
        if (this.enabled) {
            console.log('[Unity Debug]', ...args);
        }
    },
    
    warn: function(...args) {
        if (this.enabled) {
            console.warn('[Unity Debug]', ...args);
        }
    },
    
    error: function(...args) {
        console.error('[Unity Debug]', ...args);
        window.unityErrorHandler.logError(args.join(' '), 'debug');
    }
};

console.log('Unity WebGL Bridge loaded successfully');
