import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Users,
  Package,
  Car,
  MessageSquare,
  Camera,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  Eye,
  Plus,
  Edit,
  BookOpen
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const stats = [
    {
      title: 'Total Packages',
      value: '24',
      change: '+3 this month',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Bookings',
      value: '156',
      change: '+12 this week',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Cab Bookings',
      value: '89',
      change: '+8 this week',
      icon: Car,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Customer Reviews',
      value: '342',
      change: '+15 this month',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Packages',
      description: 'Add, edit, or remove tour packages',
      icon: Package,
      link: '/admin/packages',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'View Bookings',
      description: 'Manage customer bookings and reservations',
      icon: Calendar,
      link: '/admin/bookings',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Team Management',
      description: 'Manage team members and user accounts',
      icon: Users,
      link: '/admin/team',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      title: 'Manage Images',
      description: 'Upload and organize gallery images',
      icon: Camera,
      link: '/admin/images',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Customer Reviews',
      description: 'Manage testimonials and reviews',
      icon: MessageSquare,
      link: '/admin/testimonials',
      color: 'bg-amber-600 hover:bg-amber-700'
    },
    {
      title: 'Vehicle Management',
      description: 'Manage cab service vehicles and pricing',
      icon: Car,
      link: '/admin/vehicles',
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      title: 'Media Manager', 
      description: 'Centralized image upload and management',
      icon: Camera,
      link: '/admin/media',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      title: 'Site Settings',
      description: 'Manage website content and settings',
      icon: Settings,
      link: '/admin/site-settings',
      color: 'bg-slate-600 hover:bg-slate-700'
    },
    {
      title: 'Popup Manager',
      description: 'Create and manage popups and offers',
      icon: MessageSquare,
      link: '/admin/popups',
      color: 'bg-pink-600 hover:bg-pink-700'
    },
    {
      title: 'Blog Management',
      description: 'Create and manage blog posts with AI',
      icon: BookOpen,
      link: '/admin/blog',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    }
  ];

  const recentBookings = [
    { id: 1, customer: 'Rajesh Kumar', package: 'Kashmir Valley Explorer', date: '2024-12-15', status: 'Confirmed' },
    { id: 2, customer: 'Priya Sharma', package: 'Srinagar Deluxe Package', date: '2024-12-18', status: 'Pending' },
    { id: 3, customer: 'Amit Patel', package: 'Kashmir Adventure Special', date: '2024-12-20', status: 'Confirmed' },
    { id: 4, customer: 'Meera Joshi', package: 'Local Sightseeing', date: '2024-12-22', status: 'Pending' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u7oxyvzc_logo.jpg" 
                alt="G.M.B Travels Kashmir" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-sm text-slate-600">G.M.B Travels Kashmir Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, Admin!</h2>
          <p className="text-slate-600">Here's what's happening with your travel business today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-full`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Quick Actions</CardTitle>
                <CardDescription>Manage your travel business efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.link}>
                      <Card className={`${action.color} text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0`}>
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <action.icon className="h-8 w-8" />
                            <div>
                              <h4 className="font-semibold text-lg">{action.title}</h4>
                              <p className="text-sm opacity-90">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Recent Bookings</CardTitle>
                <CardDescription>Latest customer bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">{booking.customer}</p>
                        <p className="text-xs text-slate-600">{booking.package}</p>
                        <p className="text-xs text-slate-500">{booking.date}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
                <Link to="/admin/bookings">
                  <Button variant="outline" className="w-full mt-4">
                    View All Bookings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Management Overview */}
        <div className="mt-8">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800">Management Overview</CardTitle>
              <CardDescription>Quick overview of your content management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">Tour Packages</h4>
                  <p className="text-sm text-slate-600 mb-4">Manage all your tour packages, pricing, and itineraries</p>
                  <Link to="/admin/packages">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Edit className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </Link>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">Bookings</h4>
                  <p className="text-sm text-slate-600 mb-4">View and manage customer bookings and reservations</p>
                  <Link to="/admin/bookings">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <Camera className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">Gallery</h4>
                  <p className="text-sm text-slate-600 mb-4">Upload and organize images for packages and gallery</p>
                  <Link to="/admin/images">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Images
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;