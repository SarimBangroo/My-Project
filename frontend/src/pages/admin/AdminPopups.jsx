import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  ArrowLeft,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Settings,
  CheckCircle,
  XCircle,
  RefreshCw,
  Megaphone
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const AdminPopups = () => {
  const [popups, setPopups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState(null);
  const [popupForm, setPopupForm] = useState({
    title: '',
    content: '',
    popupType: 'offer',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonText: 'Close',
    buttonColor: '#f59e0b',
    imageUrl: '',
    linkUrl: '',
    showOnPages: ['home'],
    displayDuration: 5000,
    cookieExpiry: 24,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/popups`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPopups(response.data);
    } catch (error) {
      console.error('Error fetching popups:', error);
      toast.error('Failed to fetch popups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPopupForm(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setPopupForm({
      title: '',
      content: '',
      popupType: 'offer',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonText: 'Close',
      buttonColor: '#f59e0b',
      imageUrl: '',
      linkUrl: '',
      showOnPages: ['home'],
      displayDuration: 5000,
      cookieExpiry: 24,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true
    });
    setEditingPopup(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const submitData = {
        ...popupForm,
        startDate: new Date(popupForm.startDate).toISOString(),
        endDate: popupForm.endDate ? new Date(popupForm.endDate).toISOString() : null
      };
      
      if (editingPopup) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/admin/popups/${editingPopup.id}`,
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Popup updated successfully!');
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/admin/popups`,
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Popup created successfully!');
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchPopups();
    } catch (error) {
      console.error('Error saving popup:', error);
      toast.error(error.response?.data?.detail || 'Failed to save popup');
    }
  };

  const handleEdit = (popup) => {
    setEditingPopup(popup);
    setPopupForm({
      title: popup.title,
      content: popup.content,
      popupType: popup.popupType,
      backgroundColor: popup.backgroundColor,
      textColor: popup.textColor,
      buttonText: popup.buttonText,
      buttonColor: popup.buttonColor,
      imageUrl: popup.imageUrl || '',
      linkUrl: popup.linkUrl || '',
      showOnPages: popup.showOnPages,
      displayDuration: popup.displayDuration,
      cookieExpiry: popup.cookieExpiry,
      startDate: popup.startDate.split('T')[0],
      endDate: popup.endDate ? popup.endDate.split('T')[0] : '',
      isActive: popup.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (popupId) => {
    if (!window.confirm('Are you sure you want to delete this popup? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/popups/${popupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Popup deleted successfully!');
      fetchPopups();
    } catch (error) {
      console.error('Error deleting popup:', error);
      toast.error('Failed to delete popup');
    }
  };

  const togglePopupStatus = async (popup) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/admin/popups/${popup.id}`,
        { isActive: !popup.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Popup ${!popup.isActive ? 'activated' : 'deactivated'} successfully!`);
      fetchPopups();
    } catch (error) {
      console.error('Error toggling popup status:', error);
      toast.error('Failed to update popup status');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'offer': return 'bg-green-100 text-green-800';
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'news': return 'bg-purple-100 text-purple-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-slate-600">Loading popups...</p>
        </div>
      </div>
    );
  }

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
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Megaphone className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Popup Management</h1>
                  <p className="text-slate-600">Create and manage website popups and announcements</p>
                </div>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Popup
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPopup ? 'Edit Popup' : 'Create New Popup'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure your popup settings and content
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        value={popupForm.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter popup title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <Select value={popupForm.popupType} onValueChange={(value) => handleInputChange('popupType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="offer">Offer</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="alert">Alert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <Textarea
                      value={popupForm.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Enter popup content"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Background Color</label>
                      <Input
                        type="color"
                        value={popupForm.backgroundColor}
                        onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Text Color</label>
                      <Input
                        type="color"
                        value={popupForm.textColor}
                        onChange={(e) => handleInputChange('textColor', e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Button Color</label>
                      <Input
                        type="color"
                        value={popupForm.buttonColor}
                        onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Button Text</label>
                      <Input
                        value={popupForm.buttonText}
                        onChange={(e) => handleInputChange('buttonText', e.target.value)}
                        placeholder="Close"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Display Duration (ms)</label>
                      <Input
                        type="number"
                        value={popupForm.displayDuration}
                        onChange={(e) => handleInputChange('displayDuration', parseInt(e.target.value))}
                        min="1000"
                        placeholder="5000"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
                      <Input
                        value={popupForm.imageUrl}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Link URL (optional)</label>
                      <Input
                        value={popupForm.linkUrl}
                        onChange={(e) => handleInputChange('linkUrl', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <Input
                        type="date"
                        value={popupForm.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date (optional)</label>
                      <Input
                        type="date"
                        value={popupForm.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Cookie Expiry (hours)</label>
                    <Input
                      type="number"
                      value={popupForm.cookieExpiry}
                      onChange={(e) => handleInputChange('cookieExpiry', parseInt(e.target.value))}
                      min="1"
                      placeholder="24"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      How long before showing the popup again to the same user
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={popupForm.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="w-4 h-4 text-amber-600"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium">
                      Active Popup
                    </label>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700">
                      {editingPopup ? 'Update Popup' : 'Create Popup'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
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
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Popups</p>
                  <p className="text-3xl font-bold text-slate-800">{popups.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Megaphone className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Active Popups</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {popups.filter(p => p.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Offers</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {popups.filter(p => p.popupType === 'offer').length}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <MessageSquare className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Announcements</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {popups.filter(p => p.popupType === 'announcement').length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popups List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {popups.map((popup) => (
            <Card key={popup.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-slate-800">{popup.title}</h4>
                      <Badge className={getTypeColor(popup.popupType)}>
                        {popup.popupType}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{popup.content}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {popup.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
                
                {/* Popup Preview */}
                <div 
                  className="mb-4 p-4 rounded-lg border-2 border-dashed"
                  style={{ 
                    backgroundColor: popup.backgroundColor, 
                    color: popup.textColor,
                    borderColor: popup.isActive ? '#10b981' : '#ef4444'
                  }}
                >
                  <div className="text-center">
                    {popup.imageUrl && (
                      <img 
                        src={popup.imageUrl} 
                        alt="Popup" 
                        className="w-16 h-16 object-cover rounded mx-auto mb-2"
                      />
                    )}
                    <h5 className="font-semibold mb-1">{popup.title}</h5>
                    <p className="text-sm mb-2">{popup.content}</p>
                    <Button
                      size="sm"
                      style={{ backgroundColor: popup.buttonColor }}
                      className="text-white hover:opacity-80"
                    >
                      {popup.buttonText}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{popup.displayDuration}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cookie Expiry:</span>
                    <span>{popup.cookieExpiry}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span>{formatDate(popup.startDate)}</span>
                  </div>
                  {popup.endDate && (
                    <div className="flex justify-between">
                      <span>End Date:</span>
                      <span>{formatDate(popup.endDate)}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(popup)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePopupStatus(popup)}
                    className={`flex-1 ${popup.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                  >
                    {popup.isActive ? (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(popup.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {popups.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Megaphone className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No popups found</h3>
              <p className="text-slate-600 mb-4">
                Create your first popup to start engaging with visitors
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Popup
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPopups;