import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Mountain, 
  Car, 
  Users,
  Star,
  ArrowRight
} from 'lucide-react';
import { mockData } from '../mock';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SEOHead from '../components/SEOHead';

const Home = () => {
  const { siteSettings } = useSiteSettings();

  // Get dynamic content or fallback to defaults
  const heroSection = siteSettings?.heroSection || {
    title: "Experience the Beauty of",
    subtitle: "Kashmir",
    description: "Discover the pristine valleys, serene lakes, and majestic mountains of Kashmir with our expertly crafted tour packages",
    backgroundImage: "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg",
    ctaButtonText: "Explore Packages",
    secondaryCtaText: "Contact Us"
  };

  const companyInfo = siteSettings?.companyInfo || {
    name: "G.M.B Travels Kashmir",
    aboutText: "With years of experience in Kashmir tourism, G.M.B Travels Kashmir has been the trusted companion for travelers seeking authentic experiences in the paradise on earth.",
    missionStatement: "We specialize in creating unforgettable journeys through Kashmir's breathtaking landscapes, from the serene Dal Lake to the snow-capped peaks of Gulmarg. Our team of local experts ensures every detail of your trip is perfectly planned."
  };

  const businessStats = siteSettings?.businessStats || {
    happyCustomers: 500,
    tourPackages: 50,
    yearsExperience: 10,
    supportAvailability: "24/7"
  };

  return (
    <div className="min-h-screen">
      <SEOHead />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${heroSection.backgroundImage}')`
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            {heroSection.title}
            <span className="text-amber-400 block mt-2">{heroSection.subtitle}</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 drop-shadow text-slate-100 max-w-3xl mx-auto">
            {heroSection.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages">
              <Button 
                size="lg" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {heroSection.ctaButtonText}
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-slate-800 px-8 py-3 text-lg font-semibold transition-all duration-300"
              >
                {heroSection.secondaryCtaText}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
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

      {/* Featured Packages Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-800 mb-4">Featured Tour Packages</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Carefully curated experiences to showcase the best of Kashmir
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {mockData.packages.slice(0, 3).map((pkg, index) => (
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
                  
                  <Link to={`/packages/${index + 1}`}>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/packages">
              <Button size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
                View All Packages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-slate-800 mb-6">About {companyInfo.name}</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p className="text-lg">
                  {companyInfo.aboutText}
                </p>
                <p>
                  {companyInfo.missionStatement}
                </p>
                <p>
                  Whether you're seeking adventure in the mountains, tranquility on a houseboat, or cultural immersion in local traditions, we craft personalized experiences that create lasting memories.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{businessStats.happyCustomers}+</div>
                  <div className="text-slate-600">Happy Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{businessStats.tourPackages}+</div>
                  <div className="text-slate-600">Tour Packages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{businessStats.yearsExperience}+</div>
                  <div className="text-slate-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">{businessStats.supportAvailability}</div>
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

      {/* Quick Actions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-amber-600 text-white rounded-full">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-800">Book a Cab</h4>
                  <p className="text-slate-600">Reliable transportation services</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6">
                Need comfortable and safe transportation in Kashmir? Book our reliable cab services for airport transfers, sightseeing, and intercity travel.
              </p>
              <Link to="/book-cab">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  Book Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-blue-50 to-slate-50 border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-600 text-white rounded-full">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-800">Customer Reviews</h4>
                  <p className="text-slate-600">See what travelers say</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6">
                Read authentic reviews from travelers who have experienced the beauty of Kashmir with {companyInfo.name}. Their stories inspire our commitment to excellence.
              </p>
              <Link to="/testimonials">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                  Read Reviews
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;