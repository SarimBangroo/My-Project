import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { 
  Save, 
  RefreshCw, 
  Settings,
  Globe,
  Phone,
  Mail,
  MapPin,
  Eye,
  Search,
  BarChart3,
  Users,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const AdminSiteSettings = () => {
  const [settings, setSettings] = useState({
    contactInfo: {
      phone: ["+91 98765 43210", "+91 98765 43211"],
      email: ["info@gmbtravelskashmir.com", "bookings@gmbtravelskashmir.com"],
      address: ["Main Office: Srinagar, Kashmir, India", "Branch: Dal Lake Area"],
      workingHours: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sun: 10:00 AM - 6:00 PM"],
      whatsapp: "+919876543210"
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      linkedin: ""
    },
    companyInfo: {
      name: "G.M.B Travels Kashmir",
      tagline: "Discover Paradise on Earth",
      description: "Your trusted partner for exploring the magnificent beauty of Kashmir.",
      logo: "",
      aboutText: "",
      missionStatement: ""
    },
    heroSection: {
      title: "Experience the Beauty of",
      subtitle: "Kashmir",
      description: "Discover the pristine valleys, serene lakes, and majestic mountains of Kashmir",
      backgroundImage: "",
      ctaButtonText: "Explore Packages",
      secondaryCtaText: "Contact Us"
    },
    mapSettings: {
      embedUrl: "",
      latitude: 34.0837,
      longitude: 74.7973,
      zoomLevel: 12,
      address: "Srinagar, Kashmir, India"
    },
    seoSettings: {
      homeTitle: "G.M.B Travels Kashmir - Experience Paradise on Earth",
      homeDescription: "Discover Kashmir's beauty with our expertly crafted tour packages.",
      homeKeywords: ["Kashmir tours", "Kashmir travel", "Dal Lake", "Gulmarg"],
      siteUrl: "https://gmbtravelskashmir.com",
      ogImage: ""
    },
    businessStats: {
      yearsExperience: 10,
      happyCustomers: 500,
      tourPackages: 50,
      supportAvailability: "24/7"
    }
  });

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/site-settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
      setInitialLoad(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load site settings');
      setInitialLoad(false);
    }
  };

  const updateSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/admin/site-settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Site settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update site settings');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = async () => {
    if (!window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/site-settings/reset`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data.settings);
      toast.success('Settings reset to defaults');
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Failed to reset settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, field, index, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map((item, i) => i === index ? value : item)
      }
    }));
  };

  const addArrayItem = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], ""]
      }
    }));
  };

  const removeArrayItem = (section, field, index) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index)
      }
    }));
  };

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-slate-600">Loading site settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center">
              <Settings className="mr-3 h-8 w-8 text-amber-600" />
              Site Settings
            </h1>
            <p className="text-slate-600 mt-2">Manage your website content and configuration</p>
          </div>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              onClick={resetSettings}
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button 
              onClick={updateSettings}
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {loading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="contact" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="contact" className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            Map
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        {/* Contact Information Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-amber-600" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Manage contact details displayed across your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold">Phone Numbers</Label>
                {settings.contactInfo.phone.map((phone, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={phone}
                      onChange={(e) => handleArrayChange('contactInfo', 'phone', index, e.target.value)}
                      placeholder="Phone number"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeArrayItem('contactInfo', 'phone', index)}
                      disabled={settings.contactInfo.phone.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addArrayItem('contactInfo', 'phone')}
                  className="mt-2"
                >
                  Add Phone Number
                </Button>
              </div>

              <div>
                <Label className="text-base font-semibold">Email Addresses</Label>
                {settings.contactInfo.email.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={email}
                      onChange={(e) => handleArrayChange('contactInfo', 'email', index, e.target.value)}
                      placeholder="Email address"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeArrayItem('contactInfo', 'email', index)}
                      disabled={settings.contactInfo.email.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addArrayItem('contactInfo', 'email')}
                  className="mt-2"
                >
                  Add Email Address
                </Button>
              </div>

              <div>
                <Label className="text-base font-semibold">Addresses</Label>
                {settings.contactInfo.address.map((address, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={address}
                      onChange={(e) => handleArrayChange('contactInfo', 'address', index, e.target.value)}
                      placeholder="Address"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeArrayItem('contactInfo', 'address', index)}
                      disabled={settings.contactInfo.address.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addArrayItem('contactInfo', 'address')}
                  className="mt-2"
                >
                  Add Address
                </Button>
              </div>

              <div>
                <Label className="text-base font-semibold">Working Hours</Label>
                {settings.contactInfo.workingHours.map((hours, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={hours}
                      onChange={(e) => handleArrayChange('contactInfo', 'workingHours', index, e.target.value)}
                      placeholder="Working hours"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeArrayItem('contactInfo', 'workingHours', index)}
                      disabled={settings.contactInfo.workingHours.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addArrayItem('contactInfo', 'workingHours')}
                  className="mt-2"
                >
                  Add Working Hours
                </Button>
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  value={settings.contactInfo.whatsapp}
                  onChange={(e) => handleInputChange('contactInfo', 'whatsapp', e.target.value)}
                  placeholder="+919876543210"
                />
              </div>

              <Separator />

              <div>
                <Label className="text-base font-semibold mb-4 block">Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(settings.socialMedia).map((platform) => (
                    <div key={platform}>
                      <Label htmlFor={platform} className="capitalize">{platform}</Label>
                      <Input
                        id={platform}
                        value={settings.socialMedia[platform]}
                        onChange={(e) => handleInputChange('socialMedia', platform, e.target.value)}
                        placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Information Tab */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-amber-600" />
                Company Information
              </CardTitle>
              <CardDescription>
                Manage company details and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyInfo.name}
                    onChange={(e) => handleInputChange('companyInfo', 'name', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings.companyInfo.tagline}
                    onChange={(e) => handleInputChange('companyInfo', 'tagline', e.target.value)}
                    placeholder="Company Tagline"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={settings.companyInfo.logo}
                  onChange={(e) => handleInputChange('companyInfo', 'logo', e.target.value)}
                  placeholder="https://example.com/logo.jpg"
                />
              </div>

              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={settings.companyInfo.description}
                  onChange={(e) => handleInputChange('companyInfo', 'description', e.target.value)}
                  placeholder="Brief company description for footer and about sections"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="aboutText">About Text</Label>
                <Textarea
                  id="aboutText"
                  value={settings.companyInfo.aboutText}
                  onChange={(e) => handleInputChange('companyInfo', 'aboutText', e.target.value)}
                  placeholder="Detailed about text for about section"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="missionStatement">Mission Statement</Label>
                <Textarea
                  id="missionStatement"
                  value={settings.companyInfo.missionStatement}
                  onChange={(e) => handleInputChange('companyInfo', 'missionStatement', e.target.value)}
                  placeholder="Company mission statement"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Section Tab */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-amber-600" />
                Hero Section
              </CardTitle>
              <CardDescription>
                Customize the main hero section of your homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="heroTitle">Main Title</Label>
                  <Input
                    id="heroTitle"
                    value={settings.heroSection.title}
                    onChange={(e) => handleInputChange('heroSection', 'title', e.target.value)}
                    placeholder="Experience the Beauty of"
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle">Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    value={settings.heroSection.subtitle}
                    onChange={(e) => handleInputChange('heroSection', 'subtitle', e.target.value)}
                    placeholder="Kashmir"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="heroDescription">Description</Label>
                <Textarea
                  id="heroDescription"
                  value={settings.heroSection.description}
                  onChange={(e) => handleInputChange('heroSection', 'description', e.target.value)}
                  placeholder="Discover the pristine valleys, serene lakes, and majestic mountains..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="heroBackground">Background Image URL</Label>
                <Input
                  id="heroBackground"
                  value={settings.heroSection.backgroundImage}
                  onChange={(e) => handleInputChange('heroSection', 'backgroundImage', e.target.value)}
                  placeholder="https://example.com/hero-image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="ctaButton">Primary CTA Button Text</Label>
                  <Input
                    id="ctaButton"
                    value={settings.heroSection.ctaButtonText}
                    onChange={(e) => handleInputChange('heroSection', 'ctaButtonText', e.target.value)}
                    placeholder="Explore Packages"
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryCta">Secondary CTA Text</Label>
                  <Input
                    id="secondaryCta"
                    value={settings.heroSection.secondaryCtaText}
                    onChange={(e) => handleInputChange('heroSection', 'secondaryCtaText', e.target.value)}
                    placeholder="Contact Us"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Map Settings Tab */}
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-amber-600" />
                Map Settings
              </CardTitle>
              <CardDescription>
                Configure Google Maps integration and location settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="embedUrl">Google Maps Embed URL</Label>
                <Textarea
                  id="embedUrl"
                  value={settings.mapSettings.embedUrl}
                  onChange={(e) => handleInputChange('mapSettings', 'embedUrl', e.target.value)}
                  placeholder="Paste Google Maps embed iframe src URL here"
                  rows={3}
                />
                <p className="text-sm text-slate-600 mt-2">
                  Get this from Google Maps → Share → Embed a map → Copy HTML → Extract src URL
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={settings.mapSettings.latitude}
                    onChange={(e) => handleInputChange('mapSettings', 'latitude', parseFloat(e.target.value))}
                    placeholder="34.0837"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={settings.mapSettings.longitude}
                    onChange={(e) => handleInputChange('mapSettings', 'longitude', parseFloat(e.target.value))}
                    placeholder="74.7973"
                  />
                </div>
                <div>
                  <Label htmlFor="zoomLevel">Zoom Level</Label>
                  <Input
                    id="zoomLevel"
                    type="number"
                    min="1"
                    max="20"
                    value={settings.mapSettings.zoomLevel}
                    onChange={(e) => handleInputChange('mapSettings', 'zoomLevel', parseInt(e.target.value))}
                    placeholder="12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mapAddress">Address</Label>
                <Input
                  id="mapAddress"
                  value={settings.mapSettings.address}
                  onChange={(e) => handleInputChange('mapSettings', 'address', e.target.value)}
                  placeholder="Srinagar, Kashmir, India"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings Tab */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5 text-amber-600" />
                SEO Settings
              </CardTitle>
              <CardDescription>
                Manage search engine optimization and meta tags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="seoTitle">Home Page Title</Label>
                <Input
                  id="seoTitle"
                  value={settings.seoSettings.homeTitle}
                  onChange={(e) => handleInputChange('seoSettings', 'homeTitle', e.target.value)}
                  placeholder="G.M.B Travels Kashmir - Experience Paradise on Earth"
                />
              </div>

              <div>
                <Label htmlFor="seoDescription">Home Page Description</Label>
                <Textarea
                  id="seoDescription"
                  value={settings.seoSettings.homeDescription}
                  onChange={(e) => handleInputChange('seoSettings', 'homeDescription', e.target.value)}
                  placeholder="Discover Kashmir's beauty with our expertly crafted tour packages..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="seoKeywords">Keywords (comma-separated)</Label>
                <Input
                  id="seoKeywords"
                  value={settings.seoSettings.homeKeywords.join(', ')}
                  onChange={(e) => handleInputChange('seoSettings', 'homeKeywords', e.target.value.split(', ').filter(k => k.trim() !== ''))}
                  placeholder="Kashmir tours, Kashmir travel, Dal Lake, Gulmarg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.seoSettings.siteUrl}
                    onChange={(e) => handleInputChange('seoSettings', 'siteUrl', e.target.value)}
                    placeholder="https://gmbtravelskashmir.com"
                  />
                </div>
                <div>
                  <Label htmlFor="ogImage">Open Graph Image URL</Label>
                  <Input
                    id="ogImage"
                    value={settings.seoSettings.ogImage}
                    onChange={(e) => handleInputChange('seoSettings', 'ogImage', e.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Stats Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-amber-600" />
                Business Statistics
              </CardTitle>
              <CardDescription>
                Update the statistics displayed on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="yearsExp">Years of Experience</Label>
                  <Input
                    id="yearsExp"
                    type="number"
                    min="0"
                    value={settings.businessStats.yearsExperience}
                    onChange={(e) => handleInputChange('businessStats', 'yearsExperience', parseInt(e.target.value))}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="happyCustomers">Happy Customers</Label>
                  <Input
                    id="happyCustomers"
                    type="number"
                    min="0"
                    value={settings.businessStats.happyCustomers}
                    onChange={(e) => handleInputChange('businessStats', 'happyCustomers', parseInt(e.target.value))}
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="tourPackages">Tour Packages</Label>
                  <Input
                    id="tourPackages"
                    type="number"
                    min="0"
                    value={settings.businessStats.tourPackages}
                    onChange={(e) => handleInputChange('businessStats', 'tourPackages', parseInt(e.target.value))}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="support">Support Availability</Label>
                  <Input
                    id="support"
                    value={settings.businessStats.supportAvailability}
                    onChange={(e) => handleInputChange('businessStats', 'supportAvailability', e.target.value)}
                    placeholder="24/7"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSiteSettings;