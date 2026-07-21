import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, MessageSquare, Ruler, Trash2, 
  Download, Eye, EyeOff, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Annotation {
  id: string;
  type: 'pin' | 'comment' | 'measurement';
  position: { x: number; y: number; z: number };
  content: string;
  author: string;
  createdAt: Date;
  color: string;
  isVisible: boolean;
}

interface ModelAnnotationProps {
  modelId: string;
  modelName: string;
  onClose: () => void;
}

const ModelAnnotation: React.FC<ModelAnnotationProps> = ({ modelId, modelName, onClose }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeTool, setActiveTool] = useState<'pin' | 'comment' | 'measurement' | null>(null);
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [newAnnotationContent, setNewAnnotationContent] = useState('');
  const [annotationColor, setAnnotationColor] = useState('#22c55e');
  const [showAllAnnotations, setShowAllAnnotations] = useState(true);

  const colors = [
    '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'
  ];

  const addAnnotation = (type: 'pin' | 'comment' | 'measurement') => {
    if (!newAnnotationContent.trim()) {
      toast.error('Please enter annotation content');
      return;
    }

    const newAnnotation: Annotation = {
      id: `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: { x: Math.random() * 100, y: Math.random() * 100, z: Math.random() * 100 }, // Mock position
      content: newAnnotationContent,
      author: 'Current User',
      createdAt: new Date(),
      color: annotationColor,
      isVisible: true
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setNewAnnotationContent('');
    setActiveTool(null);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`);
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
    setSelectedAnnotation(null);
    toast.success('Annotation deleted');
  };

  const toggleAnnotationVisibility = (id: string) => {
    setAnnotations(prev => prev.map(ann => 
      ann.id === id ? { ...ann, isVisible: !ann.isVisible } : ann
    ));
  };

  const exportAnnotations = () => {
    const dataStr = JSON.stringify(annotations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${modelName}_annotations.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Annotations exported successfully');
  };

  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case 'pin': return <MapPin className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'measurement': return <Ruler className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getAnnotationTypeLabel = (type: string) => {
    switch (type) {
      case 'pin': return 'Pin';
      case 'comment': return 'Comment';
      case 'measurement': return 'Measurement';
      default: return 'Annotation';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-6xl h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-accent" />
            <div>
              <h2 className="text-xl font-semibold">Model Annotations</h2>
              <p className="text-sm text-gray-400">{modelName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportAnnotations}
              className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* 3D Viewer Area */}
          <div className="flex-1 relative">
            {/* Mock 3D viewer */}
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-gray-400">3D Model Viewer</p>
                <p className="text-sm text-gray-500">Click to add annotations</p>
              </div>
            </div>

            {/* Annotation Tools Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {['pin', 'comment', 'measurement'].map((tool) => (
                <button
                  key={tool}
                  onClick={() => setActiveTool(tool as any)}
                  className={`p-3 rounded-lg transition-colors ${
                    activeTool === tool
                      ? 'bg-accent text-black'
                      : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'
                  }`}
                  title={`Add ${tool}`}
                >
                  {getAnnotationIcon(tool)}
                </button>
              ))}
            </div>

            {/* Visibility Toggle */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowAllAnnotations(!showAllAnnotations)}
                className={`p-3 rounded-lg transition-colors ${
                  showAllAnnotations
                    ? 'bg-accent text-black'
                    : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'
                }`}
                title={showAllAnnotations ? 'Hide annotations' : 'Show annotations'}
              >
                {showAllAnnotations ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>

            {/* Annotations Panel Toggle */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => setShowAnnotationPanel(!showAnnotationPanel)}
                className="bg-accent text-black p-3 rounded-lg hover:bg-accent/90"
                title="Toggle annotations panel"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Annotations Panel */}
          <AnimatePresence>
            {showAnnotationPanel && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-zinc-800 border-l border-zinc-700 overflow-hidden"
              >
                <div className="p-4 h-full flex flex-col">
                  <h3 className="font-semibold mb-4">Annotations ({annotations.length})</h3>
                  
                  {/* Add New Annotation */}
                  {activeTool && (
                    <div className="bg-zinc-900 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        {getAnnotationIcon(activeTool)}
                        <span className="font-medium">Add {getAnnotationTypeLabel(activeTool)}</span>
                      </div>
                      
                      <textarea
                        value={newAnnotationContent}
                        onChange={(e) => setNewAnnotationContent(e.target.value)}
                        placeholder={`Enter your ${activeTool}...`}
                        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none mb-3"
                        rows={3}
                      />
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-400">Color:</span>
                        <div className="flex gap-1">
                          {colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setAnnotationColor(color)}
                              className={`w-6 h-6 rounded-full border-2 ${
                                annotationColor === color ? 'border-white' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => addAnnotation(activeTool)}
                          className="flex-1 bg-accent text-black px-3 py-2 rounded-lg font-medium hover:bg-accent/90"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setActiveTool(null)}
                          className="px-3 py-2 text-gray-400 hover:text-white border border-zinc-700 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Annotations List */}
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {annotations.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No annotations yet</p>
                        <p className="text-sm">Click the tools to add annotations</p>
                      </div>
                    ) : (
                      annotations.map((annotation) => (
                        <div
                          key={annotation.id}
                          className={`bg-zinc-900 rounded-lg p-3 border-l-4 transition-colors ${
                            selectedAnnotation?.id === annotation.id
                              ? 'border-accent bg-accent/10'
                              : 'border-transparent hover:bg-zinc-800'
                          }`}
                          style={{ borderLeftColor: annotation.color }}
                          onClick={() => setSelectedAnnotation(annotation)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getAnnotationIcon(annotation.type)}
                              <span className="text-sm font-medium">
                                {getAnnotationTypeLabel(annotation.type)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleAnnotationVisibility(annotation.id);
                                }}
                                className="p-1 text-gray-400 hover:text-white"
                              >
                                {annotation.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAnnotation(annotation.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-300 mb-2">{annotation.content}</p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{annotation.author}</span>
                            <span>{annotation.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ModelAnnotation; 