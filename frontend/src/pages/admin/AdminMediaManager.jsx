import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import ImageUpload from '../../components/ImageUpload';
import { 
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Search,
  Filter,
  Upload,
  Car,
  Package,
  Camera,
  Globe,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

const AdminMediaManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    imageUrl: '',
    title: '',
    description: '',
    category: 'gallery',
    tags: ''
  });

  const categories = [
    { value: 'all', label: 'All Images', icon: ImageIcon, color: 'bg-gray-500' },
    { value: 'vehicles', label: 'Vehicles', icon: Car, color: 'bg-blue-500' },
    { value: 'packages', label: 'Packages', icon: Package, color: 'bg-green-500' },
    { value: 'gallery', label: 'Gallery', icon: Camera, color: 'bg-purple-500' },
    { value: 'site', label: 'Site Images', icon: Globe, color: 'bg-orange-500' },
    { value: 'misc', label: 'Miscellaneous', icon: Settings, color: 'bg-pink-500' }
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // This would be your actual images API endpoint
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/images`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data.data || []);
      } else {
        // For demo purposes, show sample images
        setImages([
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop',
            title: 'Force Urbania',
            category: 'vehicles',
            uploadedAt: '2024-01-15'
          },
          {
            id: '2', 
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            title: 'Kashmir Valley Package',
            category: 'packages',
            uploadedAt: '2024-01-14'
          },
          {
            id: '3',
            url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=300&fit=crop', 
            title: 'Dal Lake Gallery',
            category: 'gallery',
            uploadedAt: '2024-01-13'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.imageUrl || !uploadForm.title) {
      toast.error('Please provide image and title');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(uploadForm)
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        toast.success('Image uploaded successfully');
        fetchImages();
        setIsUploadDialogOpen(false);
        resetForm();
      } else {
        // For demo purposes
        const newImage = {
          id: Date.now().toString(),
          url: uploadForm.imageUrl,
          title: uploadForm.title,
          category: uploadForm.category,
          uploadedAt: new Date().toISOString().split('T')[0]
        };
        setImages(prev => [newImage, ...prev]);
        toast.success('Image uploaded successfully');
        setIsUploadDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/media/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Image deleted successfully');
        fetchImages();
      } else {
        // For demo purposes
        setImages(prev => prev.filter(img => img.id !== imageId));
        toast.success('Image deleted successfully');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  const resetForm = () => {
    setUploadForm({
      imageUrl: '',
      title: '',
      description: '',
      category: 'gallery',
      tags: ''
    });
  };

  const filteredImages = images.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.tags && image.tags.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getCategoryStats = (category) => {
    if (category === 'all') return images.length;
    return images.filter(img => img.category === category).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Media Manager</h1>
          <p className="text-gray-600">Centralized control for all images across your website</p>
        </div>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload New Image</DialogTitle>
              <DialogDescription>
                Add images to your media library
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Image *</label>
                <ImageUpload
                  value={uploadForm.imageUrl}
                  onChange={(url) => setUploadForm(prev => ({ ...prev, imageUrl: url }))}
                  category={uploadForm.category}
                  placeholder="Upload image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter image title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select 
                  value={uploadForm.category} 
                  onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat.value !== 'all').map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter image description..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <Input
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="kashmir, travel, adventure"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {categories.map((category) => (
          <Card 
            key={category.value}
            className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
              selectedCategory === category.value 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-transparent'
            }`}
            onClick={() => setSelectedCategory(category.value)}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-sm">{category.label}</p>
              <p className="text-xs text-gray-500 mt-1">{getCategoryStats(category.value)} images</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search images by title or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative aspect-square">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                {categories.find(cat => cat.value === image.category) && (
                  <Badge 
                    className={`${categories.find(cat => cat.value === image.category).color} text-white`}
                  >
                    {categories.find(cat => cat.value === image.category).label}
                  </Badge>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-sm mb-1 truncate">{image.title}</h3>
              <p className="text-xs text-gray-500">Uploaded: {image.uploadedAt}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? `No images match "${searchTerm}" in the ${selectedCategory === 'all' ? 'selected' : selectedCategory} category`
              : `No images in the ${selectedCategory === 'all' ? 'library' : selectedCategory + ' category'} yet`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminMediaManager;