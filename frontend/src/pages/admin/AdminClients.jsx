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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  ArrowLeft,
  Users,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  Search,
  Filter,
  Calendar,
  Star,
  Send,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const AdminClients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    interests: '',
    budget: '',
    source: 'website',
    status: 'lead',
    notes: '',
    preferredContact: 'phone'
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchClients();
  }, [navigate]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setClientForm(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setClientForm({
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      interests: '',
      budget: '',
      source: 'website',
      status: 'lead',
      notes: '',
      preferredContact: 'phone'
    });
    setEditingClient(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (editingClient) {
        // Update client
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/admin/clients/${editingClient.id}`,
          clientForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Client updated successfully!');
      } else {
        // Create new client
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/admin/clients`,
          clientForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Client added successfully!');
      }
      
      resetForm();
      setIsDialogOpen(false);
      fetchClients(); // Refresh the list
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error(error.response?.data?.detail || 'Failed to save client');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setClientForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      whatsapp: client.whatsapp,
      address: client.address,
      interests: client.interests,
      budget: client.budget,
      source: client.source,
      status: client.status,
      notes: client.notes,
      preferredContact: client.preferredContact
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/clients/${clientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Client deleted successfully');
        fetchClients(); // Refresh the list
      } catch (error) {
        console.error('Error deleting client:', error);
        toast.error('Failed to delete client');
      }
    }
  };

  const handleSendWhatsApp = (client) => {
    const message = `Hello ${client.name}! Thank you for your interest in Kashmir tour packages. We have some exciting offers for you. Please let us know if you'd like to discuss further.`;
    const whatsappUrl = `https://wa.me/${client.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Update client's last contact
    setClients(prev => 
      prev.map(c => 
        c.id === client.id 
          ? { 
              ...c, 
              lastContact: new Date().toISOString(),
              followUps: [
                ...c.followUps,
                {
                  date: new Date().toISOString(),
                  type: 'whatsapp',
                  message: 'Sent package information via WhatsApp',
                  status: 'completed'
                }
              ]
            }
          : c
      )
    );
    
    toast.success('WhatsApp message sent!');
  };

  const handleSendEmail = (client) => {
    const subject = 'Kashmir Tour Package Information - G.M.B Travels';
    const body = `Dear ${client.name},\n\nThank you for your interest in Kashmir tour packages. We would be delighted to help you plan your perfect Kashmir experience.\n\nBest regards,\nG.M.B Travels Kashmir Team`;
    const mailtoUrl = `mailto:${client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    
    toast.success('Email client opened!');
  };

  const addFollowUp = (client) => {
    const followUpMessage = prompt('Enter follow-up message:');
    if (!followUpMessage) return;
    
    const followUpType = prompt('Follow-up type (phone/email/whatsapp):') || 'phone';
    
    setClients(prev => 
      prev.map(c => 
        c.id === client.id 
          ? {
              ...c,
              followUps: [
                ...c.followUps,
                {
                  date: new Date().toISOString(),
                  type: followUpType,
                  message: followUpMessage,
                  status: 'pending'
                }
              ]
            }
          : c
      )
    );
    
    toast.success('Follow-up added successfully!');
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'lead': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'interested': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'lead': return <AlertCircle className="h-4 w-4" />;
      case 'interested': return <Star className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <Heart className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
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
                <Users className="h-6 w-6 text-amber-600" />
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Client Management</h1>
                  <p className="text-sm text-slate-600">Manage customer relationships and follow-ups</p>
                </div>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
                  <DialogDescription>
                    {editingClient ? 'Update client information' : 'Add a new client to your CRM system'}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                      <Input
                        type="text"
                        value={clientForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                      <Input
                        type="email"
                        value={clientForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                      <Input
                        type="tel"
                        value={clientForm.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp Number</label>
                      <Input
                        type="tel"
                        value={clientForm.whatsapp}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                      <Input
                        type="text"
                        value={clientForm.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Interests</label>
                      <Input
                        type="text"
                        placeholder="e.g., Adventure, Photography, Culture"
                        value={clientForm.interests}
                        onChange={(e) => handleInputChange('interests', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Budget Range</label>
                      <Select value={clientForm.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-30000">Under ₹30,000</SelectItem>
                          <SelectItem value="30000-50000">₹30,000 - ₹50,000</SelectItem>
                          <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                          <SelectItem value="100000-200000">₹1,00,000 - ₹2,00,000</SelectItem>
                          <SelectItem value="above-200000">Above ₹2,00,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Source</label>
                      <Select value={clientForm.source} onValueChange={(value) => handleInputChange('source', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="social_media">Social Media</SelectItem>
                          <SelectItem value="advertisement">Advertisement</SelectItem>
                          <SelectItem value="walk_in">Walk-in</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                      <Select value={clientForm.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="interested">Interested</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Contact Method</label>
                    <Select value={clientForm.preferredContact} onValueChange={(value) => handleInputChange('preferredContact', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                    <Textarea
                      value={clientForm.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      placeholder="Add any additional notes about the client..."
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                      {editingClient ? 'Update Client' : 'Add Client'}
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Clients</p>
                  <p className="text-3xl font-bold text-slate-800">{clients.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Leads</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {clients.filter(c => c.status === 'lead').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Interested</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {clients.filter(c => c.status === 'interested').length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {clients.filter(c => c.status === 'confirmed').length}
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
                  <p className="text-sm font-medium text-slate-600">Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ₹{clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-purple-600" />
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
                  placeholder="Search clients..."
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
                    <SelectItem value="lead">Leads</SelectItem>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clients Grid */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading clients...</p>
            </CardContent>
          </Card>
        ) : filteredClients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No clients found</h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first client to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => setIsDialogOpen(true)} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Client
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-slate-800">{client.name}</h4>
                        <p className="text-sm text-slate-600">{client.address}</p>
                        <p className="text-sm text-slate-600">{client.interests}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(client.status)} flex items-center space-x-1`}>
                      {getStatusIcon(client.status)}
                      <span className="capitalize">{client.status}</span>
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Email:</span>
                      <span className="font-medium">{client.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Phone:</span>
                      <span className="font-medium">{client.phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Budget:</span>
                      <span className="font-medium">{client.budget}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Last Contact:</span>
                      <span className="font-medium">{formatDate(client.lastContact)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{client.bookings}</div>
                      <div className="text-xs text-slate-600">Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">₹{client.totalSpent.toLocaleString()}</div>
                      <div className="text-xs text-slate-600">Total Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{client.followUps.length}</div>
                      <div className="text-xs text-slate-600">Follow-ups</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-1">
                      {client.whatsapp && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendWhatsApp(client)}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          title="Send WhatsApp"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendEmail(client)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`tel:${client.phone}`)}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        title="Call"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addFollowUp(client)}
                        title="Add Follow-up"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(client)}
                        title="Edit Client"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(client.id)}
                        title="Delete Client"
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

export default AdminClients;