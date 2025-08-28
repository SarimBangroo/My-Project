import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Users,
  Star,
  Calendar,
  MapPin,
  Search,
  Filter
} from 'lucide-react';
import { mockData } from '../mock';

const Packages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [durationFilter, setDurationFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const filteredPackages = mockData.packages.filter(pkg => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDuration = durationFilter === 'all' || 
                           (durationFilter === 'short' && pkg.duration.includes('4N') || pkg.duration.includes('5N')) ||
                           (durationFilter === 'medium' && pkg.duration.includes('6N') || pkg.duration.includes('7N')) ||
                           (durationFilter === 'long' && pkg.duration.includes('8N') || pkg.duration.includes('9N'));
    
    const matchesPrice = priceFilter === 'all' ||
                        (priceFilter === 'budget' && pkg.price < 20000) ||
                        (priceFilter === 'mid' && pkg.price >= 20000 && pkg.price < 30000) ||
                        (priceFilter === 'premium' && pkg.price >= 30000);
    
    return matchesSearch && matchesDuration && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-slate-800 to-slate-700">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Kashmir Tour Packages</h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              Discover our carefully crafted tour packages designed to showcase the best of Kashmir's natural beauty and cultural heritage
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Search className="h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-400" />
                <Select value={durationFilter} onValueChange={setDurationFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Durations</SelectItem>
                    <SelectItem value="short">3-5 Days</SelectItem>
                    <SelectItem value="medium">6-7 Days</SelectItem>
                    <SelectItem value="long">8+ Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">Under ₹20,000</SelectItem>
                  <SelectItem value="mid">₹20,000 - ₹30,000</SelectItem>
                  <SelectItem value="premium">Above ₹30,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {filteredPackages.length} Package{filteredPackages.length !== 1 ? 's' : ''} Found
            </h2>
            <p className="text-slate-600">Choose from our selection of premium Kashmir tour packages</p>
          </div>

          {filteredPackages.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No packages found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your search criteria or filters</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setDurationFilter('all');
                  setPriceFilter('all');
                }}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredPackages.map((pkg, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group border-0 shadow-lg">
                  <div className="relative overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-slate-800 font-semibold">
                        <Calendar className="h-3 w-3 mr-1" />
                        {pkg.duration}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-amber-600 text-white font-bold">
                        ₹{pkg.price.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="outline" className="bg-white/90 text-slate-800 border-white/20">
                        <MapPin className="h-3 w-3 mr-1" />
                        Kashmir
                      </Badge>
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
                    <div className="flex items-center justify-between text-slate-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">{pkg.groupSize}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-amber-500" />
                        <span className="text-sm">4.8 (124 reviews)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-semibold text-slate-800">Key Highlights:</h5>
                      <ul className="space-y-1">
                        {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-start">
                            <Star className="h-3 w-3 mr-2 mt-1 text-amber-500 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                        {pkg.highlights.length > 3 && (
                          <li className="text-sm text-amber-600 font-medium">
                            +{pkg.highlights.length - 3} more highlights
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Link to={`/packages/${index + 1}`} className="flex-1">
                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300">
                          View Details
                        </Button>
                      </Link>
                      <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
                        Quick Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white">
            <h3 className="text-3xl font-bold mb-4">Can't Find Your Perfect Package?</h3>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Let us create a customized tour package just for you. Our travel experts will design an itinerary that matches your preferences and budget.
            </p>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600 font-semibold">
                Request Custom Package
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Packages;