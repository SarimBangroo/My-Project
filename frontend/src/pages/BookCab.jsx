import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Car,
  Users,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  Star,
  Shield,
  Fuel,
  Zap,
  Wifi,
  Coffee,
  Music,
  Snowflake,
  Navigation
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SEOHead from '../components/SEOHead';

const BookCab = () => {
  const { siteSettings } = useSiteSettings();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropLocation: '',
    pickupDate: null,
    pickupTime: '',
    returnDate: null,
    returnTime: '',
    tripType: 'oneway',
    vehicleType: '',
    passengers: '',
    name: '',
    phone: '',
    email: '',
    specialRequests: ''
  });

  // Fetch vehicles from API
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/vehicles`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setVehicleTypes(data.data);
      } else {
        console.error('Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field, value) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setBookingForm(prev => ({ ...prev, vehicleType: vehicle._id }));
  };

  const calculateEstimatedPrice = () => {
    if (!selectedVehicle || !bookingForm.pickupLocation || !bookingForm.dropLocation) return 0;
    // Mock calculation - in real app, you'd use distance calculation API
    const estimatedDistance = 50; // km
    return estimatedDistance * selectedVehicle.price;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!bookingForm.vehicleType) {
      toast.error('Please select a vehicle');
      return;
    }
    
    console.log('Cab booking submitted:', bookingForm);
    toast.success('Booking request submitted successfully! We will contact you shortly.');
    
    // Reset form
    setBookingForm({
      pickupLocation: '',
      dropLocation: '',
      pickupDate: null,
      pickupTime: '',
      returnDate: null,
      returnTime: '',
      tripType: 'oneway',
      vehicleType: '',
      passengers: '',
      name: '',
      phone: '',
      email: '',
      specialRequests: ''
    });
    setSelectedVehicle(null);
  };

  const companyInfo = siteSettings?.companyInfo || {
    name: 'G.M.B Travels Kashmir'
  };

  const contactInfo = siteSettings?.contactInfo || {
    phone: ['+91 98765 43210'],
    whatsapp: '+919876543210'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead 
        title={`Book Cab Service - ${companyInfo.name}`}
        description="Book reliable cab service in Kashmir. Choose from Force Urbania, Innova Crysta, Tempo Traveller and more. Safe, comfortable, and affordable transportation."
        keywords={['Kashmir cab booking', 'Force Urbania', 'Innova Crysta', 'Tempo Traveller', 'Kashmir taxi service']}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Premium Cab Service</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Experience Kashmir in comfort and style. Choose from our premium fleet including 
              Force Urbania, Innova Crysta, and more luxury vehicles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center text-blue-200">
                <Shield className="w-5 h-5 mr-2" />
                <span>Safe & Secure</span>
              </div>
              <div className="flex items-center text-blue-200">
                <Clock className="w-5 h-5 mr-2" />
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center text-blue-200">
                <Star className="w-5 h-5 mr-2" />
                <span>5-Star Rated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Vehicle Selection - 3D Cards */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Vehicle</h2>
            <p className="text-lg text-gray-600">Select from our premium fleet of vehicles</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicleTypes.map((vehicle, index) => (
                <div
                  key={vehicle._id}
                  className={`group relative cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                    selectedVehicle?._id === vehicle._id 
                      ? 'scale-105 z-10' 
                      : 'hover:z-10'
                  }`}
                  onClick={() => handleVehicleSelect(vehicle)}
                  style={{ 
                    transform: `perspective(1000px) rotateX(5deg) rotateY(${index % 2 === 0 ? '-5deg' : '5deg'})`,
                    animation: `float ${3 + index * 0.5}s ease-in-out infinite`
                  }}
                >
                  <Card className={`relative overflow-hidden border-0 shadow-2xl transition-all duration-500 ${
                    selectedVehicle?._id === vehicle._id 
                      ? 'ring-4 ring-blue-500 shadow-blue-500/25' 
                      : 'hover:shadow-3xl'
                  } bg-gradient-to-br from-white via-white to-gray-50`}>
                    
                    {/* Badge */}
                    {vehicle.badge && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className={`${vehicle.badgeColor} text-white font-semibold shadow-lg`}>
                          {vehicle.badge}
                        </Badge>
                      </div>
                    )}

                    {/* Selection Indicator */}
                    {selectedVehicle?._id === vehicle._id && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Vehicle Image with 3D Effect */}
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Floating Price */}
                      <div className="absolute bottom-4 right-4 z-20">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                          <span className="text-blue-600 font-bold">₹{vehicle.price} {vehicle.priceUnit}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{vehicle.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{vehicle.model}</p>
                        <div className="flex items-center text-gray-700">
                          <Users className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="font-medium">{vehicle.capacity}</span>
                        </div>
                      </div>

                      {/* Specifications Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
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

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          Key Features
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features.slice(0, 3).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Select Button */}
                      <Button 
                        className={`w-full mt-4 transition-all duration-300 ${
                          selectedVehicle?._id === vehicle._id
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700'
                        }`}
                      >
                        {selectedVehicle?._id === vehicle._id ? 'Selected' : 'Select Vehicle'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-2xl flex items-center">
                  <Car className="mr-3 h-6 w-6" />
                  Book Your Ride
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Fill in the details to book your premium cab service
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Trip Type */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Trip Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'oneway', label: 'One Way', icon: '→' },
                        { value: 'roundtrip', label: 'Round Trip', icon: '↔' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleInputChange('tripType', type.value)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            bookingForm.tripType === type.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="font-medium">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pickup Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-10 h-12"
                          placeholder="Enter pickup location"
                          value={bookingForm.pickupLocation}
                          onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Drop Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-10 h-12"
                          placeholder="Enter drop location"
                          value={bookingForm.dropLocation}
                          onChange={(e) => handleInputChange('dropLocation', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pickup Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-12 justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {bookingForm.pickupDate ? format(bookingForm.pickupDate, 'PPP') : 'Select date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={bookingForm.pickupDate}
                            onSelect={(date) => handleInputChange('pickupDate', date)}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Pickup Time</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="time"
                          className="pl-10 h-12"
                          value={bookingForm.pickupTime}
                          onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Return Date and Time (for round trips) */}
                  {bookingForm.tripType === 'roundtrip' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Return Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full h-12 justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {bookingForm.returnDate ? format(bookingForm.returnDate, 'PPP') : 'Select return date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={bookingForm.returnDate}
                              onSelect={(date) => handleInputChange('returnDate', date)}
                              disabled={(date) => date < bookingForm.pickupDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Return Time</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="time"
                            className="pl-10 h-12"
                            value={bookingForm.returnTime}
                            onChange={(e) => handleInputChange('returnTime', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Passengers */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Passengers</label>
                    <Select 
                      value={bookingForm.passengers} 
                      onValueChange={(value) => handleInputChange('passengers', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select number of passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Passenger' : 'Passengers'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Personal Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Users className="mr-2 h-5 w-5 text-blue-600" />
                      Contact Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                          className="h-12"
                          placeholder="Enter your full name"
                          value={bookingForm.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            className="pl-10 h-12"
                            placeholder="Enter phone number"
                            value={bookingForm.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          className="pl-10 h-12"
                          placeholder="Enter email address"
                          value={bookingForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                      <Textarea
                        placeholder="Any special requirements or requests..."
                        value={bookingForm.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl"
                  >
                    Book Now - Confirm Booking
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-6">
            {/* Selected Vehicle Summary */}
            {selectedVehicle && (
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <CardTitle className="text-lg">Selected Vehicle</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <img 
                      src={selectedVehicle.image} 
                      alt={selectedVehicle.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{selectedVehicle.name}</h3>
                      <p className="text-sm text-gray-600">{selectedVehicle.model}</p>
                      <div className="flex items-center mt-2">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm">{selectedVehicle.capacity}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Rate:</span>
                        <span className="text-lg font-bold text-blue-600">
                          ₹{selectedVehicle.price} {selectedVehicle.priceUnit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">Estimated Total:</span>
                        <span className="text-lg font-bold text-green-600">
                          ₹{calculateEstimatedPrice()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Call Us</p>
                      <p className="text-sm text-gray-600">{contactInfo.phone[0]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Wifi className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-gray-600">{contactInfo.whatsapp}</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp}`, '_blank')}
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    WhatsApp Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Why Choose Us?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[
                    { icon: Shield, text: '100% Safe & Secure', color: 'text-green-600' },
                    { icon: Clock, text: '24/7 Customer Support', color: 'text-blue-600' },
                    { icon: Star, text: 'Experienced Drivers', color: 'text-yellow-600' },
                    { icon: CheckCircle, text: 'Best Price Guarantee', color: 'text-purple-600' }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <feature.icon className={`w-5 h-5 mr-3 ${feature.color}`} />
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCab;