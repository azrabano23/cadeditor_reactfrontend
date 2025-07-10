import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Grid, List, SortAsc, SortDesc, 
  FolderPlus, Trash2, Download, Share2, Eye,
  Calendar, FileType, HardDrive, CheckSquare, Square
} from 'lucide-react';
import ModernButton from './ModernButton';
import ModernFileCard from './ModernFileCard';
import FilePreview from './FilePreview';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded' | 'converting' | 'converted' | 'error';
  originalFormat: string;
  convertedUrl?: string;
  errorMessage?: string;
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

interface SmartFileManagerProps {
  files: FileItem[];
  onFileAction: (action: string, fileId: string) => void;
  onBulkAction: (action: string, fileIds: string[]) => void;
  onFileUpload: (files: FileList) => void;
}

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'size' | 'date' | 'status' | 'format';
type SortDirection = 'asc' | 'desc';

const SmartFileManager: React.FC<SmartFileManagerProps> = ({
  files,
  onFileAction,
  onBulkAction,
  onFileUpload
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>('');

  // Get unique folders from files
  const folders = useMemo(() => {
    const folderSet = new Set<string>();
    files.forEach(file => {
      if (file.folder) folderSet.add(file.folder);
    });
    return Array.from(folderSet);
  }, [files]);

  // Get unique formats from files
  const formats = useMemo(() => {
    const formatSet = new Set<string>();
    files.forEach(file => formatSet.add(file.originalFormat));
    return Array.from(formatSet);
  }, [files]);

  // Filter and sort files
  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files.filter(file => {
      // Folder filter
      if (currentFolder && file.folder !== currentFolder) return false;
      
      // Search filter
      if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filterStatus !== 'all' && file.status !== filterStatus) return false;
      
      // Format filter
      if (filterFormat !== 'all' && file.originalFormat !== filterFormat) return false;
      
      return true;
    });

    // Sort files
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'date':
          aValue = a.uploadedAt.getTime();
          bValue = b.uploadedAt.getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'format':
          aValue = a.originalFormat;
          bValue = b.originalFormat;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [files, searchQuery, filterStatus, filterFormat, sortField, sortDirection, currentFolder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredAndSortedFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredAndSortedFiles.map(file => file.id));
    }
  };

  const getStatusCount = (status: string) => {
    return files.filter(file => file.status === status).length;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="smart-file-manager">
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <h2 className="manager-title">📁 File Manager</h2>
          <span className="file-count">
            {filteredAndSortedFiles.length} of {files.length} files
          </span>
        </div>
        
        <div className="header-actions">
          <ModernButton
            variant="primary"
            size="sm"
            icon={<FolderPlus className="w-4 h-4" />}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = '.stl,.step,.obj,.ply,.dae';
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) onFileUpload(files);
              };
              input.click();
            }}
          >
            Upload Files
          </ModernButton>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="search-filters-bar">
        <div className="search-section">
          <div className="search-input-container">
            <Search className="search-icon w-5 h-5" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filters-section">
          <button
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="expanded-filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filter-row">
              <div className="filter-group">
                <label>Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status ({files.length})</option>
                  <option value="uploaded">Uploaded ({getStatusCount('uploaded')})</option>
                  <option value="converting">Converting ({getStatusCount('converting')})</option>
                  <option value="converted">Converted ({getStatusCount('converted')})</option>
                  <option value="error">Error ({getStatusCount('error')})</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Format:</label>
                <select
                  value={filterFormat}
                  onChange={(e) => setFilterFormat(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Formats</option>
                  {formats.map(format => (
                    <option key={format} value={format}>
                      {format.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Folder:</label>
                <select
                  value={currentFolder}
                  onChange={(e) => setCurrentFolder(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Folders</option>
                  {folders.map(folder => (
                    <option key={folder} value={folder}>
                      📁 {folder}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort Controls */}
      <div className="sort-controls">
        <span className="sort-label">Sort by:</span>
        <div className="sort-buttons">
          {[
            { field: 'name', label: 'Name', icon: FileType },
            { field: 'date', label: 'Date', icon: Calendar },
            { field: 'size', label: 'Size', icon: HardDrive },
            { field: 'status', label: 'Status', icon: CheckSquare }
          ].map(({ field, label, icon: Icon }) => (
            <button
              key={field}
              className={`sort-btn ${sortField === field ? 'active' : ''}`}
              onClick={() => handleSort(field as SortField)}
            >
              <Icon className="w-4 h-4" />
              {label}
              {sortField === field && (
                sortDirection === 'asc' ? 
                <SortAsc className="w-3 h-3" /> : 
                <SortDesc className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <motion.div
          className="bulk-actions"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bulk-info">
            <button
              className="select-all-btn"
              onClick={handleSelectAll}
            >
              {selectedFiles.length === filteredAndSortedFiles.length ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
            <span>{selectedFiles.length} files selected</span>
          </div>
          
          <div className="bulk-action-buttons">
            <ModernButton
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => onBulkAction('download', selectedFiles)}
            >
              Download
            </ModernButton>
            <ModernButton
              variant="secondary"
              size="sm"
              icon={<Share2 className="w-4 h-4" />}
              onClick={() => onBulkAction('share', selectedFiles)}
            >
              Share
            </ModernButton>
            <ModernButton
              variant="secondary"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => onBulkAction('delete', selectedFiles)}
            >
              Delete
            </ModernButton>
          </div>
        </motion.div>
      )}

      {/* Files Display */}
      <div className={`files-container ${viewMode}`}>
        <AnimatePresence>
          {filteredAndSortedFiles.map((file, index) => (
            <motion.div
              key={file.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`file-item-wrapper ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
            >
              <div className="file-selection">
                <button
                  className="selection-checkbox"
                  onClick={() => handleSelectFile(file.id)}
                >
                  {selectedFiles.includes(file.id) ? (
                    <CheckSquare className="w-4 h-4 text-green-500" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              <div
                className="file-content"
                onClick={() => setPreviewFile(file)}
              >
                {viewMode === 'grid' ? (
                  <ModernFileCard
                    file={file}
                    onConvert={() => onFileAction('convert', file.id)}
                    onViewWebGL={() => onFileAction('viewWebGL', file.id)}
                    onViewAR={() => onFileAction('viewAR', file.id)}
                  />
                ) : (
                  <div className="list-item">
                    <div className="list-item-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-details">
                        {file.originalFormat.toUpperCase()} • {formatFileSize(file.size)}
                      </span>
                    </div>
                    <div className="list-item-status">
                      <span className={`status-badge ${file.status}`}>
                        {file.status}
                      </span>
                    </div>
                    <div className="list-item-actions">
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewFile(file);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAndSortedFiles.length === 0 && (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="empty-icon">📂</div>
          <h3>No files found</h3>
          <p>
            {searchQuery || filterStatus !== 'all' || filterFormat !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Upload your first CAD file to get started'
            }
          </p>
        </motion.div>
      )}

      {/* File Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <FilePreview
            file={previewFile}
            metadata={previewFile.metadata}
            thumbnailUrl={previewFile.thumbnail}
            onClose={() => setPreviewFile(null)}
            onConvert={() => {
              onFileAction('convert', previewFile.id);
              setPreviewFile(null);
            }}
            onDownload={() => onFileAction('download', previewFile.id)}
            onShare={() => onFileAction('share', previewFile.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartFileManager;
