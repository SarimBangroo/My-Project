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
  Car,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Star,
  Users,
  Fuel,
  Zap,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: '',
    name: '',
    model: '',
    capacity: '',
    price: '',
    priceUnit: 'per km',
    features: [],
    specifications: {
      fuelType: 'diesel',
      transmission: 'manual',
      mileage: '',
      luggage: ''
    },
    image: '',
    badge: '',
    badgeColor: 'bg-blue-500',
    isActive: true,
    isPopular: false,
    sortOrder: 0,
    description: ''
  });

  const vehicleTypes = [
    { value: 'force_urbania', label: 'Force Urbania' },
    { value: 'innova_crysta', label: 'Toyota Innova Crysta' },
    { value: 'tempo_traveller', label: 'Tempo Traveller' },
    { value: 'mahindra_scorpio', label: 'Mahindra Scorpio' },
    { value: 'sedan_dzire', label: 'Maruti Suzuki Dzire' },
    { value: 'luxury_fortuner', label: 'Toyota Fortuner' }
  ];

  const fuelTypes = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'cng', label: 'CNG' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' }
  ];

  const transmissionTypes = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' },
    { value: 'both', label: 'Manual/Automatic' }
  ];

  const badgeColors = [
    { value: 'bg-green-500', label: 'Green', color: '#10b981' },
    { value: 'bg-blue-500', label: 'Blue', color: '#3b82f6' },
    { value: 'bg-purple-500', label: 'Purple', color: '#8b5cf6' },
    { value: 'bg-orange-500', label: 'Orange', color: '#f97316' },
    { value: 'bg-emerald-500', label: 'Emerald', color: '#10b981' },
    { value: 'bg-yellow-500', label: 'Yellow', color: '#eab308' },
    { value: 'bg-red-500', label: 'Red', color: '#ef4444' },
    { value: 'bg-pink-500', label: 'Pink', color: '#ec4899' }
  ];

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/vehicles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.status === 'success') {
        setVehicles(data.data);
      } else {
        toast.error('Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Error fetching vehicles');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleType: '',
      name: '',
      model: '',
      capacity: '',
      price: '',
      priceUnit: 'per km',
      features: [],
      specifications: {
        fuelType: 'diesel',
        transmission: 'manual',
        mileage: '',
        luggage: ''
      },
      image: '',
      badge: '',
      badgeColor: 'bg-blue-500',
      isActive: true,
      isPopular: false,
      sortOrder: 0,
      description: ''
    });
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicleType: vehicle.vehicleType,
      name: vehicle.name,
      model: vehicle.model,
      capacity: vehicle.capacity,
      price: vehicle.price,
      priceUnit: vehicle.priceUnit,
      features: vehicle.features,
      specifications: vehicle.specifications,
      image: vehicle.image,
      badge: vehicle.badge || '',
      badgeColor: vehicle.badgeColor,
      isActive: vehicle.isActive,
      isPopular: vehicle.isPopular,
      sortOrder: vehicle.sortOrder,
      description: vehicle.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.model || !formData.capacity || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingVehicle 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/admin/vehicles/${editingVehicle._id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/admin/vehicles`;
      
      const method = editingVehicle ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        toast.success(editingVehicle ? 'Vehicle updated successfully' : 'Vehicle created successfully');
        fetchVehicles();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error('Error saving vehicle');
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        toast.success('Vehicle deleted successfully');
        fetchVehicles();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Error deleting vehicle');
    }
  };

  const toggleVehicleStatus = async (vehicleId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        toast.success(`Vehicle ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchVehicles();
      } else {
        toast.error(data.message || 'Status update failed');
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      toast.error('Error updating vehicle status');
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFeaturesChange = (value) => {
    const features = value.split(',').map(f => f.trim()).filter(f => f);
    setFormData(prev => ({ ...prev, features }));
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Vehicle Management</h1>
          <p className="text-gray-600">Manage your cab service vehicle fleet</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </DialogTitle>
              <DialogDescription>
                Fill in the vehicle details below
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Type *</label>
                  <Select 
                    value={formData.vehicleType} 
                    onValueChange={(value) => handleInputChange('vehicleType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Force Urbania"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Model *</label>
                  <Input
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., Premium Luxury Van"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Capacity *</label>
                  <Input
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="e.g., 12-16 Passengers"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price *</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    placeholder="25"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Unit</label>
                  <Select 
                    value={formData.priceUnit} 
                    onValueChange={(value) => handleInputChange('priceUnit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per km">per km</SelectItem>
                      <SelectItem value="per day">per day</SelectItem>
                      <SelectItem value="per hour">per hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Features (comma separated)</label>
                <Input
                  value={formData.features.join(', ')}
                  onChange={(e) => handleFeaturesChange(e.target.value)}
                  placeholder="Premium AC, Captain Seats, Entertainment System"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fuel Type</label>
                  <Select 
                    value={formData.specifications.fuelType} 
                    onValueChange={(value) => handleInputChange('specifications.fuelType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Transmission</label>
                  <Select 
                    value={formData.specifications.transmission} 
                    onValueChange={(value) => handleInputChange('specifications.transmission', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mileage</label>
                  <Input
                    value={formData.specifications.mileage}
                    onChange={(e) => handleInputChange('specifications.mileage', e.target.value)}
                    placeholder="12 kmpl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Luggage Space</label>
                  <Input
                    value={formData.specifications.luggage}
                    onChange={(e) => handleInputChange('specifications.luggage', e.target.value)}
                    placeholder="Large Boot Space"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Vehicle Image *</label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => handleInputChange('image', url)}
                  category="vehicles"
                  placeholder="Upload vehicle image"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Badge Text</label>
                  <Input
                    value={formData.badge}
                    onChange={(e) => handleInputChange('badge', e.target.value)}
                    placeholder="Most Popular"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Badge Color</label>
                  <Select 
                    value={formData.badgeColor} 
                    onValueChange={(value) => handleInputChange('badgeColor', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {badgeColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded mr-2" 
                              style={{ backgroundColor: color.color }}
                            ></div>
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) => handleInputChange('isPopular', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isPopular" className="text-sm font-medium">
                    Popular
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sort Order</label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Additional vehicle description..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingVehicle ? 'Update' : 'Create'} Vehicle
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle._id} className={`shadow-lg border-0 ${!vehicle.isActive ? 'opacity-60' : ''}`}>
            <div className="relative">
              {vehicle.badge && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge className={`${vehicle.badgeColor} text-white font-semibold shadow-lg`}>
                    {vehicle.badge}
                  </Badge>
                </div>
              )}
              
              <div className="absolute top-2 right-2 z-10 flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/90 hover:bg-white"
                  onClick={() => toggleVehicleStatus(vehicle._id, vehicle.isActive)}
                >
                  {vehicle.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              
              <img 
                src={vehicle.image} 
                alt={vehicle.name}
                className="w-full h-48 object-cover"
              />
            </div>

            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{vehicle.name}</span>
                {vehicle.isPopular && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
              </CardTitle>
              <CardDescription>{vehicle.model}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                <span className="font-medium">{vehicle.capacity}</span>
              </div>

              <div className="text-center py-2">
                <span className="text-2xl font-bold text-blue-600">
                  ₹{vehicle.price} <span className="text-sm font-normal">{vehicle.priceUnit}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-xs">
                  <Fuel className="w-3 h-3 mr-1 text-green-500" />
                  <span className="capitalize">{vehicle.specifications.fuelType}</span>
                </div>
                <div className="flex items-center text-xs">
                  <Zap className="w-3 h-3 mr-1 text-orange-500" />
                  <span className="capitalize">{vehicle.specifications.transmission}</span>
                </div>
                <div className="flex items-center text-xs">
                  <Navigation className="w-3 h-3 mr-1 text-blue-500" />
                  <span>{vehicle.specifications.mileage}</span>
                </div>
                <div className="flex items-center text-xs">
                  <Car className="w-3 h-3 mr-1 text-purple-500" />
                  <span className="truncate">{vehicle.specifications.luggage}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {vehicle.features.slice(0, 3).map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {feature}
                    </Badge>
                  ))}
                  {vehicle.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{vehicle.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEdit(vehicle)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(vehicle._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first vehicle to the fleet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminVehicles;