import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { 
  ArrowLeft,
  Calendar,
  Users,
  Package,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      // Mock data for now - replace with actual API call
      const mockBookings = [
        {
          id: '1',
          customerName: 'Rajesh Kumar',
          email: 'rajesh.kumar@email.com',
          phone: '+91 98765 43210',
          packageTitle: 'Kashmir Valley Explorer - 7 Days 6 Nights',
          packageId: '1',
          travelDate: '2024-12-15T00:00:00Z',
          travelers: 4,
          totalAmount: 100000,
          status: 'confirmed',
          bookingType: 'package',
          specialRequests: 'Need vegetarian meals for all travelers',
          createdAt: '2024-11-20T10:30:00Z'
        },
        {
          id: '2',
          customerName: 'Priya Sharma',
          email: 'priya.sharma@email.com',
          phone: '+91 87654 32109',
          packageTitle: 'Srinagar Deluxe Package - 5 Days 4 Nights',
          packageId: '2',
          travelDate: '2024-12-18T00:00:00Z',
          travelers: 2,
          totalAmount: 36000,
          status: 'pending',
          bookingType: 'package',
          specialRequests: 'Anniversary celebration, need special arrangements',
          createdAt: '2024-11-18T14:15:00Z'
        },
        {
          id: '3',
          customerName: 'Amit Patel',
          email: 'amit.patel@email.com',
          phone: '+91 76543 21098',
          packageTitle: 'Airport Transfer - Sedan Car',
          travelDate: '2024-12-10T08:00:00Z',
          travelers: 3,
          totalAmount: 2500,
          status: 'completed',
          bookingType: 'cab',
          specialRequests: 'Need car seat for child',
          pickupLocation: 'Srinagar Airport',
          dropLocation: 'Dal Lake Hotel',
          createdAt: '2024-11-15T09:20:00Z'
        },
        {
          id: '4',
          customerName: 'Dr. Meera Joshi',
          email: 'meera.joshi@email.com',
          phone: '+91 65432 10987',
          packageTitle: 'Kashmir Adventure Special',
          packageId: '3',
          travelDate: '2024-12-22T00:00:00Z',
          travelers: 6,
          totalAmount: 132000,
          status: 'cancelled',
          bookingType: 'package',
          specialRequests: 'Group booking for medical college friends',
          createdAt: '2024-11-12T16:45:00Z'
        }
      ];
      setBookings(mockBookings);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      // Mock API call - replace with actual API call
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.packageTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesType = typeFilter === 'all' || booking.bookingType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
                <Calendar className="h-6 w-6 text-amber-600" />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Manage Bookings</h1>
                  <p className="text-sm text-slate-600">View and manage customer bookings</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
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
                  <p className="text-sm font-medium text-slate-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-slate-800">{bookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {bookings.filter(b => b.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-2 w-full lg:w-auto">
                <Search className="h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-80"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="package">Package</SelectItem>
                    <SelectItem value="cab">Cab Booking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading bookings...</p>
            </CardContent>
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No bookings found</h3>
              <p className="text-slate-600">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No bookings have been made yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">Customer</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Package/Service</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Travel Date</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Amount</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-slate-800">{booking.customerName}</p>
                            <p className="text-sm text-slate-600">{booking.email}</p>
                            <p className="text-sm text-slate-600">{booking.phone}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-slate-800">{booking.packageTitle}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {booking.bookingType}
                              </Badge>
                              {booking.bookingType === 'package' && (
                                <span className="text-sm text-slate-600 flex items-center">
                                  <Users className="h-3 w-3 mr-1" />
                                  {booking.travelers} travelers
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-slate-800">{formatDate(booking.travelDate)}</p>
                          <p className="text-sm text-slate-600">Booked: {formatDate(booking.createdAt)}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-green-600">₹{booking.totalAmount.toLocaleString()}</p>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(booking.status)} flex items-center space-x-1 w-fit`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Booking Details</DialogTitle>
                                  <DialogDescription>View and manage booking information</DialogDescription>
                                </DialogHeader>
                                
                                {selectedBooking && (
                                  <div className="space-y-6">
                                    {/* Customer Information */}
                                    <div>
                                      <h4 className="font-semibold text-slate-800 mb-3">Customer Information</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-2">
                                          <Users className="h-4 w-4 text-slate-600" />
                                          <span className="text-slate-700">{selectedBooking.customerName}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Mail className="h-4 w-4 text-slate-600" />
                                          <span className="text-slate-700">{selectedBooking.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Phone className="h-4 w-4 text-slate-600" />
                                          <span className="text-slate-700">{selectedBooking.phone}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Booking Information */}
                                    <div>
                                      <h4 className="font-semibold text-slate-800 mb-3">Booking Information</h4>
                                      <div className="space-y-3">
                                        <div>
                                          <span className="text-sm text-slate-600">Package/Service:</span>
                                          <p className="font-medium">{selectedBooking.packageTitle}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <span className="text-sm text-slate-600">Travel Date:</span>
                                            <p className="font-medium">{formatDate(selectedBooking.travelDate)}</p>
                                          </div>
                                          <div>
                                            <span className="text-sm text-slate-600">Travelers:</span>
                                            <p className="font-medium">{selectedBooking.travelers} people</p>
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-sm text-slate-600">Total Amount:</span>
                                          <p className="font-bold text-green-600 text-lg">₹{selectedBooking.totalAmount.toLocaleString()}</p>
                                        </div>
                                        {selectedBooking.specialRequests && (
                                          <div>
                                            <span className="text-sm text-slate-600">Special Requests:</span>
                                            <p className="font-medium">{selectedBooking.specialRequests}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Status Update */}
                                    <div>
                                      <h4 className="font-semibold text-slate-800 mb-3">Update Status</h4>
                                      <div className="flex items-center space-x-2">
                                        <Select 
                                          value={selectedBooking.status} 
                                          onValueChange={(value) => updateBookingStatus(selectedBooking.id, value)}
                                        >
                                          <SelectTrigger className="w-40">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            {booking.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                >
                                  Confirm
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;