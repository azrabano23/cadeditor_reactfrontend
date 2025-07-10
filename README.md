# HoloDraft - AR CAD Editor

🥽 **The Future of CAD Design in Augmented Reality**

HoloDraft is a revolutionary web-based CAD editor that transforms traditional 3D models into immersive AR experiences. Upload your CAD files, convert them to AR-ready formats, and visualize them in augmented reality using MetaQuest devices.

![HoloDraft Banner](https://img.shields.io/badge/HoloDraft-AR%20CAD%20Editor-blue?style=for-the-badge&logo=unity)

## 🎯 Problem Statement

Traditional CAD software faces significant limitations in the modern design workflow:

- **🖥️ Desktop Limitations**: CAD tools are confined to 2D screens, making it difficult to understand complex 3D geometries
- **💸 High Cost**: Professional CAD software licenses are expensive and require specialized training
- **🔒 Platform Lock-in**: Most CAD tools are tied to specific operating systems and hardware
- **👥 Poor Collaboration**: Sharing 3D models for review requires everyone to have the same expensive software
- **🎯 Spatial Understanding**: Engineers struggle to visualize how designs will look and function in real-world environments
- **📱 Limited Accessibility**: CAD tools aren't accessible on mobile devices or through web browsers

## 💡 Our Solution

HoloDraft solves these problems by bringing CAD design into the web and augmented reality:

### **🌐 Web-First Approach**
- **Universal Access**: Works on any device with a web browser - no expensive software licenses
- **Real-time Collaboration**: Multiple users can view and interact with models simultaneously
- **Cross-Platform**: Supports Windows, macOS, Linux, and mobile devices

### **🥽 AR Visualization**
- **Spatial Understanding**: See how designs fit in real-world environments
- **Natural Interaction**: Use hand gestures to manipulate 3D models intuitively
- **Immersive Review**: Walk around and inside your designs in augmented reality

### **🔄 Seamless Workflow**
- **Format Flexibility**: Import STL, STEP, OBJ, PLY, and DAE files
- **Automatic Conversion**: Backend processes convert models to AR-ready formats
- **Instant Sharing**: Share models via simple web links

## 🛠️ How Users Experience HoloDraft

### **For Design Engineers**
1. **Upload** your CAD file (STL, STEP, etc.) through the web interface
2. **Convert** automatically to AR-ready FBX format using our Blender backend
3. **Review** in the web-based 3D viewer with measurement tools
4. **Experience** in AR using MetaQuest - grab, scale, and annotate with hand gestures
5. **Collaborate** by sharing the web link with stakeholders

### **For Design Review Teams**
1. **Access** shared model through web browser - no software installation
2. **Measure** distances, angles, and calculate volumes directly in the browser
3. **Annotate** with 3D text labels and notes
4. **Visualize** in AR to understand spatial relationships
5. **Provide Feedback** through integrated collaboration tools

### **For Clients & Stakeholders**
1. **View** 3D models instantly through web browser
2. **Interact** with models using simple mouse/touch controls
3. **Experience** in AR using smartphone or MetaQuest device
4. **Understand** designs better through immersive visualization

## 🏗️ Technology Stack & Architecture

### **Why We Chose Each Technology**

#### **Frontend - React + TypeScript**
- **React**: Component-based architecture for maintainable UI
- **TypeScript**: Type safety prevents runtime errors and improves developer experience
- **CSS**: Responsive design for cross-device compatibility
- **HTML**: Semantic markup for accessibility

#### **Backend - Node.js + Express**
- **Node.js**: JavaScript runtime allows full-stack JavaScript development
- **Express**: Lightweight web framework for REST API development
- **Python**: Blender automation scripts for 3D file conversion
- **C**: Unity native plugins for performance-critical operations

#### **Database - PostgreSQL (Supabase)**
- **PostgreSQL**: Reliable relational database with excellent performance
- **PL/pgSQL**: Stored procedures for complex database operations
- **Supabase**: Provides real-time subscriptions and authentication

#### **3D Engine - Unity + C#**
- **Unity**: Industry-standard 3D engine with excellent WebGL support
- **C#**: Type-safe, object-oriented language for game development
- **MRTK**: Microsoft Mixed Reality Toolkit for AR interactions

#### **File Processing - Blender + Python**
- **Blender**: Open-source 3D software with robust file format support
- **Python**: Blender's scripting language for automation

### **System Design Overview**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                HOLODRAFT SYSTEM                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │   PROCESSING    │    │   AR VIEWER     │
│   (Web App)     │    │   (API Server)  │    │   (Blender)     │    │   (Unity)       │
│                 │    │                 │    │                 │    │                 │
│ React/TypeScript│◄──►│ Node.js/Express │◄──►│ Python Scripts  │◄──►│ C# Scripts      │
│ HTML/CSS/JS     │    │ REST API        │    │ STL→FBX Convert │    │ WebGL/AR Build  │
│                 │    │                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         │                       │                       │                       │
         ▼                       ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SUPABASE      │    │   FILE STORAGE  │    │   TEMP STORAGE  │    │   METAQUEST     │
│   (Database)    │    │   (Uploads)     │    │   (Conversion)  │    │   (AR Device)   │
│                 │    │                 │    │                 │    │                 │
│ PostgreSQL      │    │ Static Files    │    │ Processing      │    │ Hand Tracking   │
│ PL/pgSQL        │    │ Multer Storage  │    │ Temp Files      │    │ Spatial Mapping │
│                 │    │                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 How the Backend Works

### **File Upload Process**
1. **Frontend** (React/TypeScript) sends file via HTTP POST
2. **Express Server** receives file using Multer middleware
3. **File Validation** checks format, size, and security
4. **Database Storage** saves file metadata in PostgreSQL
5. **Response** returns file ID and upload confirmation

### **File Conversion Pipeline**
1. **Conversion Request** triggered by frontend
2. **Python Script** launches Blender in headless mode
3. **Blender Processing** loads STL and exports as FBX
4. **Unity Optimization** processes FBX for WebGL/AR
5. **Database Update** marks conversion complete
6. **Notification** sent to frontend via WebSocket

### **AR Model Loading**
1. **Unity WebGL** receives model data from React
2. **Asset Loading** downloads FBX from backend
3. **Model Instantiation** creates 3D object in Unity scene
4. **MRTK Integration** adds hand tracking and interaction
5. **AR Session** starts with spatial mapping

```javascript
// Backend API Flow (Node.js/Express)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  // 1. Validate file
  const validation = validateCADFile(req.file);
  
  // 2. Save to database
  const { data } = await supabase.from('files').insert({
    filename: req.file.filename,
    original_name: req.file.originalname,
    file_path: req.file.path,
    file_size: req.file.size
  });
  
  // 3. Return response
  res.json({ success: true, file: data });
});

app.post('/api/convert/:id', async (req, res) => {
  // 1. Get file info
  const file = await getFileById(req.params.id);
  
  // 2. Run Python/Blender conversion
  const convertedPath = await runBlenderConversion(file.file_path);
  
  // 3. Update database
  await supabase.from('files').update({
    converted_path: convertedPath,
    status: 'converted'
  }).eq('id', req.params.id);
  
  res.json({ success: true, convertedUrl: convertedPath });
});
```

## 🎨 How the Frontend Works

### **React Component Architecture**
```typescript
// Main App Component (TypeScript/React)
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import UnityCADViewer from './components/UnityCADViewer';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  const [files, setFiles] = useState<CADFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<CADFile | null>(null);
  
  // Real-time file updates from Supabase
  useEffect(() => {
    const subscription = supabase
      .channel('files')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'files' }, 
        (payload) => {
          updateFileList(payload);
        })
      .subscribe();
    
    return () => subscription.unsubscribe();
  }, []);
  
  const handleFileUpload = async (file: File) => {
    // 1. Upload to backend
    const uploadResponse = await uploadFile(file);
    
    // 2. Trigger conversion
    const conversionResponse = await convertFile(uploadResponse.file.id);
    
    // 3. Update UI
    setFiles(prev => [...prev, uploadResponse.file]);
  };
  
  const handleARView = (file: CADFile) => {
    // Load model in Unity AR viewer
    window.unityBridge?.loadModel({
      fileId: file.id,
      fileName: file.filename,
      downloadUrl: file.converted_path
    });
  };
  
  return (
    <div className="app">
      <FileUpload onUpload={handleFileUpload} />
      <FileList files={files} onSelect={setSelectedFile} />
      {selectedFile && (
        <UnityCADViewer 
          file={selectedFile} 
          onARView={handleARView}
        />
      )}
    </div>
  );
};
```

### **Unity Integration Bridge**
```javascript
// Unity-React Communication Bridge
window.unityBridge = {
  // Send data to Unity
  loadModel: (modelData) => {
    if (window.unityInstance) {
      window.unityInstance.SendMessage('CADModelManager', 'LoadModel', 
        JSON.stringify(modelData));
    }
  },
  
  // Receive data from Unity
  onModelLoaded: (modelInfo) => {
    console.log('Model loaded in Unity:', modelInfo);
    // Update React UI
    window.dispatchEvent(new CustomEvent('unityModelLoaded', { 
      detail: modelInfo 
    }));
  },
  
  // AR Session Management
  startARSession: (config) => {
    window.unityInstance.SendMessage('ARManager', 'StartARSession', 
      JSON.stringify(config));
  }
};
```

## 💼 Value Proposition

### **For Individual Engineers**
- **Cost Savings**: No expensive CAD software licenses (save $1,000s annually)
- **Accessibility**: Work from anywhere with just a web browser
- **Better Visualization**: See designs in real-world context through AR
- **Faster Iteration**: Instant sharing and feedback cycles

### **For Engineering Teams**
- **Improved Collaboration**: Real-time model sharing and review
- **Reduced Training**: Intuitive web interface requires minimal learning
- **Cross-Platform**: Works on Windows, Mac, Linux, and mobile
- **Version Control**: Automatic model versioning and history

### **For Organizations**
- **Lower TCO**: Reduce software licensing and IT maintenance costs
- **Faster Time-to-Market**: Streamlined design review process
- **Better Client Communication**: Stakeholders can view models without CAD software
- **Remote Work Ready**: Fully cloud-based, supports distributed teams

### **Technical Advantages**
- **Modern Web Standards**: Built with latest React, TypeScript, and WebGL
- **Scalable Architecture**: Microservices design supports growth
- **Open Source Integration**: Leverages Blender and Unity ecosystem
- **Future-Proof**: AR/VR ready for next-generation interfaces

## 🚀 Features

### ✨ **Core Functionality**
- **📤 Multi-format Upload**: Support for STL, STEP, OBJ, PLY, and DAE files
- **🔄 Real-time Conversion**: Automatic STL to FBX conversion using Blender
- **🎮 Unity WebGL Viewer**: Interactive 3D model viewer in the browser
- **🥽 MetaQuest AR Integration**: Full AR experience with hand tracking
- **🎨 Material Editor**: Real-time material and texture editing
- **📐 Transform Controls**: Precise positioning, rotation, and scaling

### 🛠️ **Advanced CAD Features**
- **📏 Measurement Tools**: Distance, angle, volume, and surface area calculations
- **🔧 Material System**: Wireframe, transparency, highlighting, and selection modes
- **📝 3D Annotations**: Add text labels and notes directly to models
- **🎯 Model Interaction**: MRTK hand tracking with pinch, grab, and gesture controls
- **🔍 Visualization Modes**: Wireframe toggle, exploded view, cross-section analysis
- **🎛️ Interactive Toolbar**: Easy-to-use UI controls for all CAD operations
- **📊 Model Analytics**: Automatic calculation of physical properties
- **🎪 Advanced Rendering**: Multiple material presets and lighting configurations

### 🛠️ **Technical Stack**
- **Frontend**: React 19 + TypeScript + Supabase
- **Backend**: Node.js + Express + Multer
- **3D Engine**: Unity 2022.3+ with Mixed Reality Toolkit
- **AR Platform**: MetaQuest 2/3 with hand tracking
- **Conversion**: Blender 4.4+ Python API
- **Database**: Supabase (PostgreSQL)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web    │    │   Node.js API   │    │  Unity WebGL    │
│     Frontend    │ ←→ │     Backend     │ ←→ │     Viewer      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Supabase     │    │     Blender     │    │   MetaQuest     │
│    Database     │    │   STL→FBX       │    │   AR Session    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Installation

### Prerequisites
- Node.js 16+
- Unity 2022.3 LTS or later
- Blender 4.0+ (for STL conversion)
- MetaQuest 2/3 device (for AR features)

### 1. Clone the Repository
```bash
git clone https://github.com/azrabano23/cad-editor-react-website.git
cd cad-editor-react-website
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup
```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Configure your Supabase credentials in .env
```

### 4. Install Blender (macOS)
```bash
# Option 1: Download from blender.org
# Option 2: Install via Homebrew
brew install --cask blender
```

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

### 2. Start the Frontend
```bash
npm start
```
The frontend will run on `http://localhost:3000`

### 3. Upload and Convert
1. Navigate to `http://localhost:3000`
2. Upload an STL file (or other supported formats)
3. Click "Convert to FBX"
4. View your model in the Unity WebGL viewer

## 🎮 Unity Integration

### Unity CAD Components

#### Core CAD Scripts
```
Assets/Scripts/CAD/
├── CADModelManager.cs         # Central model management system
├── CADModel.cs               # Individual model properties and metadata
├── CADAnnotation.cs          # 3D text annotations
├── CADDimension.cs           # Distance measurements with visual lines
├── CADModelInteraction.cs    # MRTK hand tracking and gestures
├── CADMaterialManager.cs     # Material and rendering systems
└── CADMeasurementTools.cs    # Advanced measurement tools
```

#### CAD Features Implementation

**Model Management**
- **CADModelManager**: Handles loading, selection, and manipulation of CAD models
- **CADModel**: Stores model metadata, transformation history, and properties
- **Visualization Modes**: Wireframe, exploded view, cross-section analysis

**Measurement System**
- **Distance Measurement**: Point-to-point distance calculation with visual indicators
- **Angle Measurement**: Three-point angle calculation with arc visualization
- **Volume Calculation**: Automatic bounding box volume computation
- **Surface Area**: Real-time surface area analysis

**Material System**
- **Multiple Rendering Modes**: Default, wireframe, transparent, highlighted
- **Selection Feedback**: Visual indication of selected models
- **Material Presets**: Pre-configured materials for different CAD visualization needs

**MRTK Integration**
- **Hand Tracking**: Natural hand gestures for model manipulation
- **Pinch Interactions**: Grab and move models with pinch gestures
- **Focus Handling**: Automatic highlighting when looking at models
- **Voice Commands**: "Select model", "Toggle wireframe", "Add annotation"

#### UI Components
```
Assets/Scripts/UI/
└── CADToolbar.cs             # Interactive toolbar for CAD operations
```

**Toolbar Features**
- **Model Selection**: Click to select and highlight models
- **Wireframe Toggle**: Switch between solid and wireframe rendering
- **Exploded View**: Separate model parts for detailed analysis
- **Measurement Tools**: Enable distance and angle measurement modes
- **Reset Functions**: Clear measurements and annotations

### WebGL Build Setup
1. Open the Unity project at `/CAD-Editor-AR/`
2. Install required packages:
   - Mixed Reality Toolkit
   - XR Interaction Toolkit
   - Newtonsoft JSON
3. Build for WebGL:
   ```
   File → Build Settings → WebGL → Build
   ```
4. Place build output in `/public/unity-builds/webgl/`

### AR Build Setup (MetaQuest)
1. Switch platform to Android
2. Configure XR settings:
   - Enable Oculus provider
   - Set target device to Quest 2 & 3
3. Build and deploy to MetaQuest device

## 🗂️ Project Structure

```
cad-editor-react-website/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── UnityCADViewer.tsx      # Main Unity integration component
│   │   ├── SupabaseTest.tsx        # Database connection test
│   │   └── ...
│   ├── 📁 lib/
│   │   └── supabaseClient.ts       # Supabase configuration
│   └── App.tsx                     # Main application
├── 📁 backend/
│   ├── server.js                   # Express server + Blender integration
│   ├── 📁 uploads/                 # Uploaded STL files
│   ├── 📁 converted/               # Converted FBX files
│   └── 📁 scripts/                 # Blender Python scripts
├── 📁 unity-integration/
│   ├── 📁 Scripts/
│   │   ├── 📁 WebGL/              # Unity WebGL scripts
│   │   ├── 📁 AR/                 # MetaQuest AR scripts
│   │   └── 📁 React/              # React integration
│   └── 📁 Scenes/                 # Unity scenes
├── 📁 public/
│   ├── 📁 unity-builds/           # Unity WebGL builds
│   └── unity-bridge.js            # Unity ↔ React communication
├── 📁 supabase/                   # Database schema and migrations
└── 📄 README.md                   # This file
```

## 🔧 API Reference

### Backend Endpoints

#### Upload File
```http
POST /api/upload
Content-Type: multipart/form-data

{
  "file": <STL_FILE>
}
```

#### Convert to FBX
```http
POST /api/convert/:fileId
Content-Type: application/json
```

#### Get Files
```http
GET /api/files
```

#### Health Check
```http
GET /api/health
```

### Unity Integration

#### Load Model
```javascript
window.unityBridge.loadModel({
  fileId: "file-id",
  fileName: "model.fbx",
  downloadUrl: "/converted/model.fbx"
});
```

#### Transform Model
```javascript
window.unityBridge.transformModel({
  fileId: "file-id",
  position: {x: 0, y: 0, z: 0},
  rotation: {x: 0, y: 0, z: 0},
  scale: {x: 1, y: 1, z: 1}
});
```

#### Start AR Session
```javascript
window.unityBridge.startARSession({
  fileId: "file-id",
  enableHandTracking: true,
  enableCollaboration: false
});
```

## 🎯 Usage Examples

### Basic File Upload and Conversion
```typescript
// Upload STL file
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result.file.id;
};

// Convert to FBX
const convertToFBX = async (fileId: string) => {
  const response = await fetch(`/api/convert/${fileId}`, {
    method: 'POST'
  });
  
  const result = await response.json();
  return result.convertedUrl;
};
```

### Unity AR Integration
```csharp
// C# script for Unity AR setup
public class ARCADEditor : MonoBehaviour
{
    [Header("AR Settings")]
    public GameObject modelContainer;
    public Material defaultMaterial;
    
    void Start()
    {
        // Initialize AR session
        InitializeARSession();
    }
    
    private void InitializeARSession()
    {
        // Set up hand tracking
        // Configure model interaction
        // Enable real-time synchronization
    }
}
```

## 🛡️ Security & Performance

### Security Features
- ✅ File type validation
- ✅ File size limits (50MB)
- ✅ Secure file uploads
- ✅ Supabase RLS policies

### Performance Optimizations
- ✅ Efficient STL to FBX conversion
- ✅ Model compression for web
- ✅ Progressive loading
- ✅ WebGL optimization

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test

# Unity tests (in Unity Editor)
```

### Test AR Features
1. Upload a test STL file
2. Convert to FBX
3. Open Unity viewer
4. Test hand tracking on MetaQuest

## 📱 MetaQuest Setup

### Requirements
- MetaQuest 2 or MetaQuest 3
- Developer mode enabled
- Unity app sideloaded

### Setup Steps
1. Enable Developer Mode in MetaQuest app
2. Connect MetaQuest to PC via USB
3. Build Unity app for Android
4. Deploy using Unity or adb

## 🔄 Workflow

```mermaid
graph LR
    A[Upload STL] ---Origin Git certain laws dependably a URL defined an[xertainesynchronous law)] B[Backend Processing]
    B ---Origin Git certain laws dependably a URL defined an[xertainesynchronous law)] C[Blender Conversion]
    C ---Origin Git certain laws dependably a URL defined an[xertainesynchronous law)] D[FBX Output]
    D ---Origin Git certain laws dependably a URL defined an[xertainesynchronous law)] E[Unity WebGL Viewer]
    E ---Origin Git certain laws dependably a URL defined an[xertainesynchronous law)] F[MetaQuest AR]
    F ---Origin Git certain laws dependably a URL defined an[xertainesynchronous law)] G[Hand Tracking]
    G ---Origin Git certain laws dependably a URL defined an[xertainesynchronous law)] H[Model Manipulation]
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- TypeScript for frontend
- ESLint configuration
- Prettier formatting
- C# standards for Unity

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unity Technologies** - Mixed Reality Toolkit
- **Meta** - MetaQuest platform
- **Blender Foundation** - 3D modeling software
- **Supabase** - Backend as a Service
- **React Team** - Frontend framework

## 📞 Support

### Documentation
- [Unity Setup Guide](UNITY_SETUP.md)
- [Quick Start Guide](QUICK_START_UNITY.md)
- [API Documentation](docs/API.md)

### Community
- 🐛 [Report Issues](https://github.com/azrabano23/cad-editor-react-website/issues)
- 💬 [Discussions](https://github.com/azrabano23/cad-editor-react-website/discussions)
- 📧 [Contact](mailto:azrabano23@example.com)

---

**Built with ❤️ for the future of AR CAD design**

[![Unity](https://img.shields.io/badge/Unity-2022.3+-black?style=flat-square&logo=unity)](https://unity.com/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![MetaQuest](https://img.shields.io/badge/MetaQuest-2%2F3-purple?style=flat-square&logo=meta)](https://www.meta.com/quest/)
[![Blender](https://img.shields.io/badge/Blender-4.4+-orange?style=flat-square&logo=blender)](https://www.blender.org/)

