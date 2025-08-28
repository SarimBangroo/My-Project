import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Mountain, 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Users,
  Star,
  Camera,
  Bed,
  Clock
} from 'lucide-react';
import { mockData } from '../mock';
import { toast } from 'sonner';

const Home = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    packageInterest: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', contactForm);
    toast.success('Inquiry submitted! We will contact you soon.');
    setContactForm({ name: '', email: '', phone: '', message: '', packageInterest: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u7oxyvzc_logo.jpg" 
                alt="G.M.B Travels Kashmir" 
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-slate-800">G.M.B Travels Kashmir</h1>
                <p className="text-sm text-slate-600">Discover Paradise on Earth</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-slate-700 hover:text-amber-600 font-medium transition-colors">Home</a>
              <a href="#services" className="text-slate-700 hover:text-amber-600 font-medium transition-colors">Services</a>
              <a href="#packages" className="text-slate-700 hover:text-amber-600 font-medium transition-colors">Packages</a>
              <a href="#about" className="text-slate-700 hover:text-amber-600 font-medium transition-colors">About</a>
              <a href="#contact" className="text-slate-700 hover:text-amber-600 font-medium transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg')`
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            Experience the Beauty of 
            <span className="text-amber-400 block mt-2">Kashmir</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 drop-shadow text-slate-100 max-w-3xl mx-auto">
            Discover the pristine valleys, serene lakes, and majestic mountains of Kashmir with our expertly crafted tour packages
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Packages
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-slate-800 px-8 py-3 text-lg font-semibold transition-all duration-300"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-800 mb-4">Our Services</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Complete travel solutions for your Kashmir adventure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockData.services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <service.icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-2xl text-slate-800 group-hover:text-amber-600 transition-colors">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-center leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages Section */}
      <section id="packages" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-800 mb-4">Featured Tour Packages</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Carefully curated experiences to showcase the best of Kashmir
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {mockData.packages.map((pkg, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group border-0 shadow-lg">
                <div className="relative overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-slate-800 font-semibold">
                      {pkg.duration}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-amber-600 text-white px-3 py-1 rounded-full font-bold text-lg">
                      ₹{pkg.price.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 group-hover:text-amber-600 transition-colors">
                    {pkg.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center text-slate-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{pkg.groupSize}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-semibold text-slate-800">Highlights:</h5>
                    <ul className="space-y-1">
                      {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start">
                          <Star className="h-3 w-3 mr-2 mt-1 text-amber-500 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300"
                    onClick={() => {
                      setContactForm(prev => ({ ...prev, packageInterest: pkg.title }));
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-slate-800 mb-6">About G.M.B Travels Kashmir</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p className="text-lg">
                  With years of experience in Kashmir tourism, G.M.B Travels Kashmir has been the trusted companion for travelers seeking authentic experiences in the paradise on earth.
                </p>
                <p>
                  We specialize in creating unforgettable journeys through Kashmir's breathtaking landscapes, from the serene Dal Lake to the snow-capped peaks of Gulmarg. Our team of local experts ensures every detail of your trip is perfectly planned.
                </p>
                <p>
                  Whether you're seeking adventure in the mountains, tranquility on a houseboat, or cultural immersion in local traditions, we craft personalized experiences that create lasting memories.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">500+</div>
                  <div className="text-slate-600">Happy Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">50+</div>
                  <div className="text-slate-600">Tour Packages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">10+</div>
                  <div className="text-slate-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
                  <div className="text-slate-600">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/1ff3rziy_pexels-farhaan-mushtaq-parimoo-13671454.jpg" 
                alt="Kashmir Houseboat"
                className="rounded-2xl shadow-2xl w-full object-cover h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-800 mb-4">Get in Touch</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Ready to explore Kashmir? Contact us for personalized travel planning
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h4 className="text-2xl font-semibold text-slate-800 mb-6">Contact Information</h4>
              <div className="space-y-6">
                {mockData.contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-3 bg-amber-100 rounded-full">
                      <contact.icon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-800">{contact.label}</h5>
                      <p className="text-slate-600">{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-800">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input 
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <Input 
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <Input 
                        type="tel"
                        name="phone"
                        placeholder="Your Phone Number"
                        value={contactForm.phone}
                        onChange={handleInputChange}
                        required
                        className="border-slate-300 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <Input 
                        type="text"
                        name="packageInterest"
                        placeholder="Package of Interest (Optional)"
                        value={contactForm.packageInterest}
                        onChange={handleInputChange}
                        className="border-slate-300 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <Textarea 
                        name="message"
                        placeholder="Your Message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="border-slate-300 focus:border-amber-500"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 transform hover:scale-105"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u7oxyvzc_logo.jpg" 
                  alt="G.M.B Travels Kashmir" 
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h5 className="text-lg font-bold">G.M.B Travels Kashmir</h5>
                  <p className="text-slate-300 text-sm">Paradise Awaits</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Your trusted partner for exploring the magnificent beauty of Kashmir. We create unforgettable experiences that last a lifetime.
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Services</a></li>
                <li><a href="#packages" className="hover:text-amber-400 transition-colors">Packages</a></li>
                <li><a href="#about" className="hover:text-amber-400 transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact Info</h5>
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4" />
                  <span>info@gmbtravelskashmir.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4" />
                  <span>Srinagar, Kashmir, India</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="bg-slate-600 mb-8" />
          
          <div className="text-center text-slate-300">
            <p>&copy; 2024 G.M.B Travels Kashmir. All rights reserved. | Experience Paradise on Earth</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;