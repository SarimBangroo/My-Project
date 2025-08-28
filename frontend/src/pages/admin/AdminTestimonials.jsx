import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  ArrowLeft,
  MessageSquare,
  Star,
  Check,
  X,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

const AdminTestimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchTestimonials();
  }, [navigate]);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      // Mock data for now - replace with actual API call
      const mockTestimonials = [
        {
          id: '1',
          customerName: 'Rajesh Kumar',
          location: 'Delhi, India',
          rating: 5,
          review: 'Absolutely incredible experience! G.M.B Travels made our Kashmir trip unforgettable. The houseboat stay on Dal Lake was magical, and our guide Mohit was extremely knowledgeable about local culture and history. Every detail was perfectly planned.',
          packageName: 'Kashmir Valley Explorer - 7 Days',
          date: 'November 2024',
          status: 'approved',
          images: ['https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/bm97gdwu_pexels-azam-khan-12040331.jpg'],
          createdAt: '2024-11-20T10:30:00Z'
        },
        {
          id: '2',
          customerName: 'Priya Sharma',
          location: 'Mumbai, India',
          rating: 5,
          review: 'Kashmir is truly paradise on earth! The team at G.M.B Travels was professional and caring throughout our journey. The Mughal gardens were breathtaking, and the shikara ride at sunset was the highlight of our trip. Highly recommended!',
          packageName: 'Srinagar Deluxe Package - 5 Days',
          date: 'October 2024',
          status: 'approved',
          images: ['https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/rudsgdbz_pexels-azeen-shah-10542627.jpg'],
          createdAt: '2024-10-25T14:15:00Z'
        },
        {
          id: '3',
          customerName: 'Amit Patel',
          location: 'Gujarat, India',
          rating: 4,
          review: 'Great service and beautiful locations. The only issue was some delay in pickup times, but overall a fantastic experience. Would definitely book again for our next Kashmir trip.',
          packageName: 'Kashmir Adventure Special',
          date: 'September 2024',
          status: 'pending',
          images: [],
          createdAt: '2024-09-15T09:20:00Z'
        },
        {
          id: '4',
          customerName: 'Sneha Reddy',
          location: 'Hyderabad, India',
          rating: 2,
          review: 'The trip was okay but not as per expectations. The hotel was not up to the mark and food quality could be better. Some improvements needed in service quality.',
          packageName: 'Kashmir Valley Explorer - 7 Days',
          date: 'August 2024',
          status: 'pending',
          images: [],
          createdAt: '2024-08-20T16:45:00Z'
        }
      ];
      setTestimonials(mockTestimonials);
    } catch (error) {
      toast.error('Failed to fetch testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTestimonialStatus = async (testimonialId, newStatus) => {
    try {
      setTestimonials(prev => 
        prev.map(testimonial => 
          testimonial.id === testimonialId 
            ? { ...testimonial, status: newStatus }
            : testimonial
        )
      );
      toast.success(`Testimonial ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      toast.error('Failed to update testimonial status');
    }
  };

  const deleteTestimonial = async (testimonialId) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
        toast.success('Testimonial deleted successfully');
      } catch (error) {
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || testimonial.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-amber-500 fill-current' : 'text-slate-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
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
                <MessageSquare className="h-6 w-6 text-amber-600" />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Manage Testimonials</h1>
                  <p className="text-sm text-slate-600">Review and approve customer testimonials</p>
                </div>
              </div>
            </div>
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
                  <p className="text-sm font-medium text-slate-600">Total Reviews</p>
                  <p className="text-3xl font-bold text-slate-800">{testimonials.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">
                    {testimonials.filter(t => t.status === 'approved').length}
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {testimonials.filter(t => t.status === 'pending').length}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg. Rating</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {(testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length || 0).toFixed(1)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
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
                  placeholder="Search testimonials..."
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
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Grid */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading testimonials...</p>
            </CardContent>
          </Card>
        ) : filteredTestimonials.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No testimonials found</h3>
              <p className="text-slate-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No customer reviews have been submitted yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
                          {testimonial.customerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-slate-800">{testimonial.customerName}</h4>
                        <p className="text-sm text-slate-600">{testimonial.location}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(testimonial.status)}>
                      {testimonial.status}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs mb-2">
                      {testimonial.packageName}
                    </Badge>
                    <p className="text-slate-700 leading-relaxed line-clamp-3">
                      {testimonial.review}
                    </p>
                  </div>

                  {testimonial.images.length > 0 && (
                    <div className="mb-4">
                      <div className="flex space-x-2 overflow-x-auto">
                        {testimonial.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review by ${testimonial.customerName}`}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-slate-500">
                      {testimonial.date} • Submitted {formatDate(testimonial.createdAt)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedTestimonial(testimonial)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Testimonial Details</DialogTitle>
                            <DialogDescription>Review customer testimonial</DialogDescription>
                          </DialogHeader>
                          
                          {selectedTestimonial && (
                            <div className="space-y-6">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold text-lg">
                                    {selectedTestimonial.customerName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="text-xl font-semibold text-slate-800">{selectedTestimonial.customerName}</h4>
                                  <p className="text-slate-600">{selectedTestimonial.location}</p>
                                  <div className="flex items-center space-x-1 mt-2">
                                    {renderStars(selectedTestimonial.rating)}
                                    <span className="ml-2 text-sm text-slate-600">
                                      ({selectedTestimonial.rating}/5)
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h5 className="font-semibold text-slate-800 mb-2">Package Experience</h5>
                                <Badge variant="outline" className="mb-3">
                                  {selectedTestimonial.packageName}
                                </Badge>
                                <p className="text-slate-700 leading-relaxed">
                                  {selectedTestimonial.review}
                                </p>
                              </div>

                              {selectedTestimonial.images.length > 0 && (
                                <div>
                                  <h5 className="font-semibold text-slate-800 mb-2">Photos</h5>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {selectedTestimonial.images.map((image, index) => (
                                      <img
                                        key={index}
                                        src={image}
                                        alt={`Review photo ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                  <p className="text-sm text-slate-600">Travel Date: {selectedTestimonial.date}</p>
                                  <p className="text-sm text-slate-600">Submitted: {formatDate(selectedTestimonial.createdAt)}</p>
                                </div>
                                <Badge className={getStatusColor(selectedTestimonial.status)}>
                                  {selectedTestimonial.status}
                                </Badge>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {testimonial.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateTestimonialStatus(testimonial.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => updateTestimonialStatus(testimonial.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => deleteTestimonial(testimonial.id)}
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

export default AdminTestimonials;