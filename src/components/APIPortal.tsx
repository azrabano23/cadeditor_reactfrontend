import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, Key, BookOpen, Webhook, Copy, 
  Plus, Trash2, ExternalLink, Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: Date;
  lastUsed?: Date;
  permissions: string[];
  isActive: boolean;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  lastTriggered?: Date;
}

interface APIPortalProps {
  onClose?: () => void;
}

const APIPortal: React.FC<APIPortalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'keys' | 'docs' | 'webhooks'>('keys');
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showCreateWebhook, setShowCreateWebhook] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'curl'>('javascript');

  // Mock data
  const [apiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'holodraft_live_sk_1234567890abcdef',
      created: new Date('2024-01-15'),
      lastUsed: new Date('2024-03-15T10:30:00'),
      permissions: ['upload', 'convert', 'deploy'],
      isActive: true
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'holodraft_test_sk_abcdef1234567890',
      created: new Date('2024-02-01'),
      permissions: ['upload', 'convert'],
      isActive: true
    }
  ]);

  const [webhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      name: 'Conversion Complete',
      url: 'https://api.myapp.com/webhooks/holodraft',
      events: ['conversion.completed', 'conversion.failed'],
      isActive: true,
      lastTriggered: new Date('2024-03-15T14:30:00')
    }
  ]);

  const codeExamples = {
    javascript: `// Upload a CAD file
const response = await fetch('https://api.holodraft.com/v1/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'multipart/form-data'
  },
  body: formData
});

// Convert to AR-ready format
const convertResponse = await fetch(\`https://api.holodraft.com/v1/convert/\${fileId}\`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

// Get conversion status
const statusResponse = await fetch(\`https://api.holodraft.com/v1/status/\${fileId}\`, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});`,
    python: `import requests

# Upload a CAD file
with open('model.stl', 'rb') as f:
    files = {'file': f}
    response = requests.post(
        'https://api.holodraft.com/v1/upload',
        headers={'Authorization': 'Bearer YOUR_API_KEY'},
        files=files
    )

# Convert to AR-ready format
convert_response = requests.post(
    f'https://api.holodraft.com/v1/convert/{file_id}',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

# Get conversion status
status_response = requests.get(
    f'https://api.holodraft.com/v1/status/{file_id}',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)`,
    curl: `# Upload a CAD file
curl -X POST https://api.holodraft.com/v1/upload \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@model.stl"

# Convert to AR-ready format
curl -X POST https://api.holodraft.com/v1/convert/FILE_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Get conversion status
curl https://api.holodraft.com/v1/status/FILE_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }
    
    toast.success(`API key "${newKeyName}" created successfully`);
    setNewKeyName('');
    setShowCreateKey(false);
  };

  const handleCreateWebhook = () => {
    if (!newWebhookName.trim() || !newWebhookUrl.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    toast.success(`Webhook "${newWebhookName}" created successfully`);
    setNewWebhookName('');
    setNewWebhookUrl('');
    setShowCreateWebhook(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 12) + '...' + key.substring(key.length - 4);
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Code className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold">API & Developer Tools</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg">
            <Download className="w-4 h-4" />
            SDK
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg">
            <ExternalLink className="w-4 h-4" />
            Docs
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {[
          { id: 'keys', label: 'API Keys', icon: Key },
          { id: 'docs', label: 'Documentation', icon: BookOpen },
          { id: 'webhooks', label: 'Webhooks', icon: Webhook }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'keys' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">API Keys</h3>
                  <button
                    onClick={() => setShowCreateKey(true)}
                    className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Key
                  </button>
                </div>
                
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-white">{apiKey.name}</h4>
                          <p className="text-sm text-gray-400">
                            Created {apiKey.created.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-lg"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-900 rounded p-3 font-mono text-sm">
                        {maskApiKey(apiKey.key)}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-2">
                          {apiKey.permissions.map((permission) => (
                            <span key={permission} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">
                              {permission}
                            </span>
                          ))}
                        </div>
                        {apiKey.lastUsed && (
                          <span className="text-xs text-gray-400">
                            Last used: {apiKey.lastUsed.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Start</h3>
                  
                  {/* Language Selector */}
                  <div className="flex gap-2 mb-4">
                    {(['javascript', 'python', 'curl'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          selectedLanguage === lang
                            ? 'bg-accent text-black'
                            : 'bg-zinc-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  {/* Code Example */}
                  <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Code Example</span>
                      <button
                        onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
                        className="flex items-center gap-1 text-accent hover:text-accent/80 text-sm"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{codeExamples[selectedLanguage]}</code>
                    </pre>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <h4 className="font-medium text-white mb-2">Authentication</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Include your API key in the Authorization header for all requests.
                    </p>
                    <div className="bg-zinc-900 rounded p-2 font-mono text-xs">
                      Authorization: Bearer YOUR_API_KEY
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <h4 className="font-medium text-white mb-2">Rate Limits</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Free tier: 100 requests/hour<br />
                      Pro tier: 1,000 requests/hour
                    </p>
                    <div className="text-xs text-gray-400">
                      Upgrade your plan for higher limits
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'webhooks' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Webhooks</h3>
                  <button
                    onClick={() => setShowCreateWebhook(true)}
                    className="bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Webhook
                  </button>
                </div>
                
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-white">{webhook.name}</h4>
                          <p className="text-sm text-gray-400">{webhook.url}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {webhook.events.map((event) => (
                            <span key={event} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                              {event}
                            </span>
                          ))}
                        </div>
                        {webhook.lastTriggered && (
                          <span className="text-xs text-gray-400">
                            Last triggered: {webhook.lastTriggered.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                  <h4 className="font-medium text-white mb-2">Available Events</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-gray-300">conversion.completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      <span className="text-gray-300">conversion.failed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span className="text-gray-300">ar.launched</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      <span className="text-gray-300">file.uploaded</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create API Key Modal */}
      <AnimatePresence>
        {showCreateKey && (
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
              className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-800"
            >
              <h3 className="text-xl font-semibold mb-4">Create API Key</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-accent focus:outline-none"
                    placeholder="e.g., Production API Key"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateKey(false)}
                    className="flex-1 px-4 py-2 text-gray-400 hover:text-white border border-zinc-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateKey}
                    className="flex-1 bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
                  >
                    Create Key
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Webhook Modal */}
      <AnimatePresence>
        {showCreateWebhook && (
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
              className="bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-800"
            >
              <h3 className="text-xl font-semibold mb-4">Add Webhook</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Webhook Name
                  </label>
                  <input
                    type="text"
                    value={newWebhookName}
                    onChange={(e) => setNewWebhookName(e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-accent focus:outline-none"
                    placeholder="e.g., Conversion Notifications"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Endpoint URL
                  </label>
                  <input
                    type="url"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-accent focus:outline-none"
                    placeholder="https://your-app.com/webhooks/holodraft"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateWebhook(false)}
                    className="flex-1 px-4 py-2 text-gray-400 hover:text-white border border-zinc-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateWebhook}
                    className="flex-1 bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
                  >
                    Add Webhook
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default APIPortal; 