import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import ImageUpload from '../../components/ImageUpload';
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Package,
  Users,
  Calendar,
  DollarSign,
  Search,
  Filter,
  Download,
  FileText,
  Mail,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

const AdminPackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageForm, setPackageForm] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    groupSize: '',
    image: '',
    images: [],
    highlights: [''],
    itinerary: [],
    inclusions: [''],
    exclusions: [''],
    category: 'standard',
    status: 'active'
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchPackages();
  }, [navigate]);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      // Mock data for now - replace with actual API call
      const mockPackages = [
        {
          id: '1',
          title: 'Kashmir Valley Explorer - 7 Days 6 Nights',
          description: 'Complete Kashmir experience covering Srinagar, Gulmarg, Pahalgam, and Sonamarg',
          duration: '7D/6N',
          price: 25000,
          groupSize: '2-6 People',
          image: 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/bm97gdwu_pexels-azam-khan-12040331.jpg',
          highlights: ['Stay in Dal Lake Houseboat', 'Gulmarg Gondola Ride', 'Pahalgam Valley Tour'],
          category: 'premium',
          status: 'active',
          createdAt: '2024-11-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Srinagar Deluxe Package - 5 Days 4 Nights',
          description: 'Luxury stay and experiences in the summer capital of Kashmir',
          duration: '5D/4N',
          price: 18000,
          groupSize: '2-4 People',
          image: 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/rudsgdbz_pexels-azeen-shah-10542627.jpg',
          highlights: ['3-Star Deluxe Accommodation', 'Dal Lake Shikara Ride', 'Nishat & Shalimar Gardens'],
          category: 'standard',
          status: 'active',
          createdAt: '2024-11-10T09:15:00Z'
        },
        {
          id: '3',
          title: 'Kashmir Adventure Special',
          description: 'Perfect blend of adventure and scenic beauty for thrill seekers',
          duration: '6D/5N',
          price: 22000,
          groupSize: '4-8 People',
          image: 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg',
          highlights: ['Trekking in Pahalgam', 'River Rafting in Lidder', 'Gulmarg Skiing'],
          category: 'adventure',
          status: 'inactive',
          createdAt: '2024-11-05T14:20:00Z'
        }
      ];
      setPackages(mockPackages);
    } catch (error) {
      toast.error('Failed to fetch packages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPackageForm(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setPackageForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setPackageForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setPackageForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setPackageForm({
      title: '',
      description: '',
      duration: '',
      price: '',
      groupSize: '',
      image: '',
      images: [],
      highlights: [''],
      itinerary: [],
      inclusions: [''],
      exclusions: [''],
      category: 'standard',
      status: 'active'
    });
    setEditingPackage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPackage) {
        // Update package
        toast.success('Package updated successfully!');
      } else {
        // Create new package
        toast.success('Package created successfully!');
      }
      
      resetForm();
      setIsDialogOpen(false);
      fetchPackages();
    } catch (error) {
      toast.error('Failed to save package');
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setPackageForm({
      title: pkg.title,
      description: pkg.description,
      duration: pkg.duration,
      price: pkg.price.toString(),
      groupSize: pkg.groupSize,
      image: pkg.image,
      images: pkg.images || [],
      highlights: pkg.highlights.length > 0 ? pkg.highlights : [''],
      itinerary: pkg.itinerary || [],
      inclusions: pkg.inclusions || [''],
      exclusions: pkg.exclusions || [''],
      category: pkg.category,
      status: pkg.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        toast.success('Package deleted successfully!');
        fetchPackages();
      } catch (error) {
        toast.error('Failed to delete package');
      }
    }
  };

  const handleDownloadPDF = async (pkg) => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf-gen' });
      
      // Mock PDF generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('PDF generated successfully!', { id: 'pdf-gen' });
      
      // In real implementation, this would download the actual PDF
      // window.open(`/api/admin/packages/${pkg.id}/download-pdf`, '_blank');
      
    } catch (error) {
      toast.error('Failed to generate PDF', { id: 'pdf-gen' });
    }
  };

  const handleSendPDF = async (pkg) => {
    try {
      const clientEmail = prompt('Enter client email address:');
      if (!clientEmail) return;
      
      toast.loading('Sending PDF...', { id: 'pdf-send' });
      
      // Mock PDF sending - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`PDF sent to ${clientEmail}!`, { id: 'pdf-send' });
      
    } catch (error) {
      toast.error('Failed to send PDF', { id: 'pdf-send' });
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                <Package className="h-6 w-6 text-amber-600" />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Manage Packages</h1>
                  <p className="text-sm text-slate-600">Create and manage your tour packages</p>
                </div>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Package
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPackage ? 'Edit Package' : 'Create New Package'}</DialogTitle>
                  <DialogDescription>
                    {editingPackage ? 'Update package details' : 'Fill in the details to create a new tour package'}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Package Title *</label>
                      <Input
                        type="text"
                        value={packageForm.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Duration *</label>
                      <Input
                        type="text"
                        placeholder="e.g., 7D/6N"
                        value={packageForm.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                    <Textarea
                      value={packageForm.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹) *</label>
                      <Input
                        type="number"
                        value={packageForm.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Group Size *</label>
                      <Input
                        type="text"
                        placeholder="e.g., 2-6 People"
                        value={packageForm.groupSize}
                        onChange={(e) => handleInputChange('groupSize', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                      <Select value={packageForm.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="adventure">Adventure</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Main Package Image *</label>
                    <ImageUpload
                      value={packageForm.image}
                      onChange={(url) => handleInputChange('image', url)}
                      category="packages"
                      placeholder="Upload package image"
                    />
                  </div>

                  {/* Package Highlights */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Package Highlights</label>
                    {packageForm.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                          type="text"
                          value={highlight}
                          onChange={(e) => handleArrayInputChange('highlights', index, e.target.value)}
                          placeholder="Enter highlight"
                        />
                        {packageForm.highlights.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('highlights', index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('highlights')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Highlight
                    </Button>
                  </div>

                  {/* Inclusions */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Inclusions</label>
                    {packageForm.inclusions.map((inclusion, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                          type="text"
                          value={inclusion}
                          onChange={(e) => handleArrayInputChange('inclusions', index, e.target.value)}
                          placeholder="Enter inclusion"
                        />
                        {packageForm.inclusions.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('inclusions', index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('inclusions')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Inclusion
                    </Button>
                  </div>

                  {/* Exclusions */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Exclusions</label>
                    {packageForm.exclusions.map((exclusion, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                          type="text"
                          value={exclusion}
                          onChange={(e) => handleArrayInputChange('exclusions', index, e.target.value)}
                          placeholder="Enter exclusion"
                        />
                        {packageForm.exclusions.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem('exclusions', index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('exclusions')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Exclusion
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                    <Select value={packageForm.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                      {editingPackage ? 'Update Package' : 'Create Package'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Search className="h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading packages...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No packages found</h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first tour package to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => setIsDialogOpen(true)} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Package
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${pkg.status === 'active' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                      {pkg.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-amber-600 text-white font-bold">
                      ₹{pkg.price.toLocaleString()}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">{pkg.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Users className="h-4 w-4 mr-2" />
                      {pkg.groupSize}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Badge variant="outline" className="text-xs">
                      {pkg.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Link to={`/packages/${pkg.id}`} target="_blank">
                        <Button variant="outline" size="sm" title="Preview Package">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownloadPDF(pkg)}
                        title="Download PDF"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSendPDF(pkg)}
                        title="Send PDF via Email"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(pkg)} title="Edit Package">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(pkg.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        title="Delete Package"
                      >
                        <Trash2 className="h-4 w-4" />
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

export default AdminPackages;