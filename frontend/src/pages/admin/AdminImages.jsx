import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import ImageUpload from '../../components/ImageUpload';
import { 
  ArrowLeft,
  Camera,
  Trash2,
  Edit,
  Search,
  Filter,
  Plus,
  Image as ImageIcon,
  Download,
  Eye,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

const AdminImages = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'gallery',
    tags: '',
    imageUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchImages();
  }, [navigate]);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      // Mock data for now - replace with actual API call
      const mockImages = [
        {
          id: '1',
          title: 'Dal Lake Sunset',
          description: 'Beautiful sunset view over Dal Lake with houseboats',
          imageUrl: 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/bm97gdwu_pexels-azam-khan-12040331.jpg',
          category: 'gallery',
          tags: ['dal lake', 'sunset', 'houseboats', 'srinagar'],
          isActive: true,
          createdAt: '2024-11-20T10:30:00Z'
        },
        {
          id: '2',
          title: 'Kashmir Mountains',
          description: 'Snow-capped mountains of Kashmir valley',
          imageUrl: 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg',
          category: 'package',
          tags: ['mountains', 'snow', 'valley', 'landscape'],
          isActive: true,
          createdAt: '2024-11-18T14:15:00Z'
        },
        {
          id: '3',
          title: 'Srinagar Architecture',
          description: 'Traditional Kashmiri architecture reflected in water',
          imageUrl: 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/rudsgdbz_pexels-azeen-shah-10542627.jpg',
          category: 'gallery',
          tags: ['architecture', 'reflection', 'traditional', 'srinagar'],
          isActive: true,
          createdAt: '2024-11-15T09:20:00Z'
        },
        {
          id: '4',
          title: 'Houseboat Experience',
          description: 'Traditional Kashmir houseboat on Dal Lake',
          imageUrl: 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/1ff3rziy_pexels-farhaan-mushtaq-parimoo-13671454.jpg',
          category: 'testimonial',
          tags: ['houseboat', 'dal lake', 'accommodation', 'experience'],
          isActive: true,
          createdAt: '2024-11-12T16:45:00Z'
        }
      ];
      setImages(mockImages);
    } catch (error) {
      toast.error('Failed to fetch images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      toast.error('Some files were skipped. Only image files are allowed.');
    }
    
    setSelectedFiles(validFiles);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image to upload');
      return;
    }

    try {
      // Mock upload - replace with actual API call
      const newImages = selectedFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        title: uploadForm.title || file.name,
        description: uploadForm.description,
        imageUrl: URL.createObjectURL(file), // Mock URL
        category: uploadForm.category,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isActive: true,
        createdAt: new Date().toISOString()
      }));

      setImages(prev => [...newImages, ...prev]);
      toast.success(`${selectedFiles.length} image(s) uploaded successfully!`);
      
      // Reset form
      setUploadForm({
        title: '',
        description: '',
        category: 'gallery',
        tags: '',
        imageUrl: ''
      });
      setIsUploadDialogOpen(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to upload images');
    }
  };

  const deleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        setImages(prev => prev.filter(img => img.id !== imageId));
        toast.success('Image deleted successfully');
      } catch (error) {
        toast.error('Failed to delete image');
      }
    }
  };

  const toggleImageStatus = async (imageId) => {
    try {
      setImages(prev => 
        prev.map(img => 
          img.id === imageId 
            ? { ...img, isActive: !img.isActive }
            : img
        )
      );
      toast.success('Image status updated');
    } catch (error) {
      toast.error('Failed to update image status');
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || image.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'package': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'gallery': return 'bg-green-100 text-green-700 border-green-200';
      case 'testimonial': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Camera className="h-6 w-6 text-amber-600" />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Image Gallery</h1>
                  <p className="text-sm text-slate-600">Upload and manage images for packages and gallery</p>
                </div>
              </div>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload New Images</DialogTitle>
                  <DialogDescription>
                    Upload and organize images for your packages and gallery
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleUpload} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Upload Image *</label>
                    <ImageUpload
                      value={uploadForm.imageUrl}
                      onChange={(url) => setUploadForm(prev => ({ ...prev, imageUrl: url }))}
                      category="gallery"
                      placeholder="Upload gallery image"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                      <Input
                        type="text"
                        placeholder="Image title"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                      <Select 
                        value={uploadForm.category} 
                        onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gallery">Gallery</SelectItem>
                          <SelectItem value="package">Package</SelectItem>
                          <SelectItem value="testimonial">Testimonial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <Input
                      type="text"
                      placeholder="Brief description of the image"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                    <Input
                      type="text"
                      placeholder="Enter tags separated by commas (e.g. kashmir, mountains, valley)"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                      Upload Images
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Images</p>
                  <p className="text-3xl font-bold text-slate-800">{images.length}</p>
                </div>
                <ImageIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Gallery</p>
                  <p className="text-3xl font-bold text-green-600">
                    {images.filter(img => img.category === 'gallery').length}
                  </p>
                </div>
                <Camera className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Package Images</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {images.filter(img => img.category === 'package').length}
                  </p>
                </div>
                <ImageIcon className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {images.filter(img => img.isActive).length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Search className="h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-400" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="gallery">Gallery</SelectItem>
                    <SelectItem value="package">Package</SelectItem>
                    <SelectItem value="testimonial">Testimonial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images Grid */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading images...</p>
            </CardContent>
          </Card>
        ) : filteredImages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Camera className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No images found</h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first image to get started'
                }
              </p>
              {!searchTerm && categoryFilter === 'all' && (
                <Button onClick={() => setIsUploadDialogOpen(true)} className="bg-amber-600 hover:bg-amber-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Image
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img 
                    src={image.imageUrl} 
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              className="h-8 w-8 p-0"
                              onClick={() => setSelectedImage(image)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{image.title}</DialogTitle>
                            </DialogHeader>
                            {selectedImage && (
                              <div className="space-y-4">
                                <img 
                                  src={selectedImage.imageUrl} 
                                  alt={selectedImage.title}
                                  className="w-full max-h-96 object-contain rounded-lg"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-slate-700">Description:</p>
                                    <p className="text-slate-600">{selectedImage.description || 'No description'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-700">Category:</p>
                                    <Badge className={getCategoryColor(selectedImage.category)}>
                                      {selectedImage.category}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-700">Uploaded:</p>
                                    <p className="text-slate-600">{formatDate(selectedImage.createdAt)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-700">Status:</p>
                                    <Badge className={selectedImage.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                      {selectedImage.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </div>
                                </div>
                                {selectedImage.tags.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-slate-700 mb-2">Tags:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedImage.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(image.imageUrl, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className={getCategoryColor(image.category)}>
                      {image.category}
                    </Badge>
                  </div>
                  {!image.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge className="bg-red-600 text-white">Inactive</Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h4 className="font-semibold text-slate-800 mb-1 line-clamp-1">{image.title}</h4>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {image.description || 'No description available'}
                  </p>
                  
                  {image.tags.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {image.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {image.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{image.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-slate-500">
                      {formatDate(image.createdAt)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className={`h-8 px-2 ${image.isActive ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                        onClick={() => toggleImageStatus(image.id)}
                      >
                        {image.isActive ? 'Hide' : 'Show'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => deleteImage(image.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImages;