import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Users,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SEOHead from '../components/SEOHead';

const Contact = () => {
  const { siteSettings } = useSiteSettings();
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    inquiryType: '',
    message: '',
    preferredContact: ''
  });

  const handleInputChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    toast.success('Message sent successfully! We will get back to you within 24 hours.');
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      inquiryType: '',
      message: '',
      preferredContact: ''
    });
  };

  // Get dynamic content or fallback to defaults
  const contactInfo = siteSettings?.contactInfo || {
    phone: ["+91 98765 43210", "+91 98765 43211"],
    email: ["info@gmbtravelskashmir.com", "bookings@gmbtravelskashmir.com"],
    address: ["Main Office: Srinagar, Kashmir, India", "Branch: Dal Lake Area"],
    workingHours: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sun: 10:00 AM - 6:00 PM"],
    whatsapp: "+919876543210"
  };

  const businessStats = siteSettings?.businessStats || {
    happyCustomers: 500,
    yearsExperience: 10,
    tourPackages: 50,
    supportAvailability: "24/7"
  };

  const mapSettings = siteSettings?.mapSettings || {
    address: "Srinagar, Kashmir, India",
    embedUrl: ""
  };

  const contactInfoDisplay = [
    {
      icon: Phone,
      title: "Phone",
      details: contactInfo.phone || ["+91 98765 43210"],
      description: "Call us anytime for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      details: contactInfo.email || ["info@gmbtravelskashmir.com"],
      description: "Send us your queries and get quick responses"
    },
    {
      icon: MapPin,
      title: "Address",
      details: contactInfo.address || ["Srinagar, Kashmir, India"],
      description: "Visit our office for personalized consultation"
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: contactInfo.workingHours || ["Mon - Sat: 9:00 AM - 8:00 PM"],
      description: "We're available during these hours"
    }
  ];

  const faqData = [
    {
      question: "What is the best time to visit Kashmir?",
      answer: "The best time to visit Kashmir is from March to October. Summer (April-June) is perfect for sightseeing, while autumn (September-October) offers beautiful landscapes."
    },
    {
      question: "Do you provide customized tour packages?",
      answer: "Yes, we specialize in creating customized tour packages based on your preferences, budget, and duration. Contact us to discuss your requirements."
    },
    {
      question: "Are your drivers experienced with Kashmir roads?",
      answer: "All our drivers are local, experienced, and licensed. They know the terrain well and prioritize safety and comfort throughout your journey."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, bank transfers, UPI payments, and major credit/debit cards. Advance booking requires a partial payment."
    },
    {
      question: "Do you provide accommodation booking services?",
      answer: "Yes, we can arrange accommodation including hotels, houseboats, and guesthouses based on your budget and preferences."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead 
        title={`Contact ${siteSettings?.companyInfo?.name || 'G.M.B Travels Kashmir'} - Get in Touch`}
        description="Contact G.M.B Travels Kashmir for Kashmir tour packages, cab bookings, and travel planning. Multiple ways to reach us for your dream Kashmir vacation."
        keywords={['contact', 'Kashmir travel', 'tour inquiry', 'travel planning', 'Kashmir tours contact']}
      />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-slate-800 to-slate-700">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              Get in touch with us for any inquiries about Kashmir tours, cab bookings, or travel planning. We're here to help make your journey unforgettable.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800 flex items-center">
                  <MessageCircle className="mr-3 h-6 w-6 text-amber-600" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                      <Input
                        type="text"
                        placeholder="Your full name"
                        value={contactForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={contactForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                      <Input
                        type="tel"
                        placeholder={contactInfo.phone ? contactInfo.phone[0] : "+91 98765 43210"}
                        value={contactForm.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Inquiry Type</label>
                      <Select value={contactForm.inquiryType} onValueChange={(value) => handleInputChange('inquiryType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tour-package">Tour Package Inquiry</SelectItem>
                          <SelectItem value="cab-booking">Cab Booking</SelectItem>
                          <SelectItem value="accommodation">Accommodation Booking</SelectItem>
                          <SelectItem value="custom-tour">Custom Tour Planning</SelectItem>
                          <SelectItem value="general">General Information</SelectItem>
                          <SelectItem value="complaint">Complaint/Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject *</label>
                    <Input
                      type="text"
                      placeholder="Brief subject of your inquiry"
                      value={contactForm.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Contact Method</label>
                    <Select value={contactForm.preferredContact} onValueChange={(value) => handleInputChange('preferredContact', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="How would you like us to contact you?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="any">Any Method</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Message *</label>
                    <Textarea
                      placeholder="Please provide details about your inquiry, travel dates, number of people, budget range, or any specific requirements..."
                      value={contactForm.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      rows={6}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Get in Touch</CardTitle>
                <CardDescription>Multiple ways to reach us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfoDisplay.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-3 bg-amber-100 rounded-full flex-shrink-0">
                      <info.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 mb-1">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-slate-700 text-sm mb-1">{detail}</p>
                      ))}
                      <p className="text-slate-600 text-xs">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp}`, '_blank')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp Chat
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  onClick={() => window.open(`tel:${contactInfo.phone ? contactInfo.phone[0] : '+919876543210'}`)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                  onClick={() => window.open(`mailto:${contactInfo.email ? contactInfo.email[0] : 'info@gmbtravelskashmir.com'}`)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </CardContent>
            </Card>

            {/* Business Stats */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Why Choose Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{businessStats.happyCustomers}+</div>
                    <div className="text-sm text-slate-600">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{businessStats.yearsExperience}+</div>
                    <div className="text-sm text-slate-600">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{businessStats.tourPackages}+</div>
                    <div className="text-sm text-slate-600">Tour Packages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{businessStats.supportAvailability}</div>
                    <div className="text-sm text-slate-600">Support</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-amber-200">
                  <p className="text-sm text-slate-700 text-center">
                    Trusted by travelers from across India for authentic Kashmir experiences
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our services
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqData.map((faq, index) => (
                <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Visit Our Office</h3>
            <p className="text-xl text-slate-600">Located in the heart of {mapSettings.address}</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-0 overflow-hidden">
              {mapSettings.embedUrl ? (
                <iframe
                  src={mapSettings.embedUrl}
                  className="w-full h-96"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                ></iframe>
              ) : (
                <div className="bg-slate-200 h-96 flex items-center justify-center">
                  <div className="text-center text-slate-600">
                    <MapPin className="h-16 w-16 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold">Interactive Map</h4>
                    <p className="mt-2">Map integration would be added here</p>
                    <p className="text-sm mt-2">{mapSettings.address}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;