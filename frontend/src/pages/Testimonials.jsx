import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Star,
  Quote,
  Users,
  Calendar,
  MapPin,
  Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Testimonials = () => {
  const [filterRating, setFilterRating] = useState('all');
  const [filterPackage, setFilterPackage] = useState('all');

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Delhi, India",
      rating: 5,
      date: "November 2024",
      package: "Kashmir Valley Explorer - 7 Days",
      review: "Absolutely incredible experience! G.M.B Travels made our Kashmir trip unforgettable. The houseboat stay on Dal Lake was magical, and our guide Mohit was extremely knowledgeable about local culture and history. Every detail was perfectly planned.",
      avatar: "/api/placeholder/64/64",
      images: ["https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/bm97gdwu_pexels-azam-khan-12040331.jpg"]
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Mumbai, India",
      rating: 5,
      date: "October 2024",
      package: "Srinagar Deluxe Package - 5 Days",
      review: "Kashmir is truly paradise on earth! The team at G.M.B Travels was professional and caring throughout our journey. The Mughal gardens were breathtaking, and the shikara ride at sunset was the highlight of our trip. Highly recommended!",
      avatar: "/api/placeholder/64/64",
      images: ["https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/rudsgdbz_pexels-azeen-shah-10542627.jpg"]
    },
    {
      id: 3,
      name: "Amit & Sunita Patel",
      location: "Gujarat, India",
      rating: 4,
      date: "September 2024",
      package: "Kashmir Adventure Special",
      review: "Fantastic adventure package! The trekking in Pahalgam was challenging but rewarding. Our driver was excellent and very safe. The only minor issue was weather delays, but that's beyond anyone's control. Overall, a wonderful experience with G.M.B Travels.",
      avatar: "/api/placeholder/64/64",
      images: ["https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg"]
    },
    {
      id: 4,
      name: "Ramesh Singh",
      location: "Punjab, India",
      rating: 5,
      date: "August 2024",
      package: "Kashmir Valley Explorer - 7 Days",
      review: "G.M.B Travels exceeded all expectations! The accommodation was top-notch, food was delicious, and the scenic beauty of Kashmir left us speechless. Our family had the time of our lives. Thank you for making our dream vacation come true!",
      avatar: "/api/placeholder/64/64",
      images: ["https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/1ff3rziy_pexels-farhaan-mushtaq-parimoo-13671454.jpg"]
    },
    {
      id: 5,
      name: "Dr. Meera Joshi",
      location: "Bangalore, India",
      rating: 5,
      date: "July 2024",
      package: "Srinagar Deluxe Package - 5 Days",
      review: "Professional service from start to finish. The itinerary was well-balanced with enough time to explore and relax. The houseboat experience was unique and comfortable. G.M.B Travels staff was always available to help. Will definitely book again!",
      avatar: "/api/placeholder/64/64",
      images: []
    },
    {
      id: 6,
      name: "Vikram Mehta",
      location: "Rajasthan, India",
      rating: 4,
      date: "June 2024",
      package: "Kashmir Adventure Special",
      review: "Great adventure package with thrilling activities. The river rafting and mountain biking were well organized. Accommodation was good, though could be improved slightly. Overall, a great value for money trip with beautiful memories of Kashmir.",
      avatar: "/api/placeholder/64/64",
      images: []
    }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesRating = filterRating === 'all' || testimonial.rating.toString() === filterRating;
    const matchesPackage = filterPackage === 'all' || testimonial.package.toLowerCase().includes(filterPackage.toLowerCase());
    return matchesRating && matchesPackage;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-amber-500 fill-current' : 'text-slate-300'
        }`}
      />
    ));
  };

  const averageRating = testimonials.reduce((acc, testimonial) => acc + testimonial.rating, 0) / testimonials.length;
  const totalReviews = testimonials.length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-slate-800 to-slate-700">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Customer Reviews</h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-8">
              Read authentic reviews from travelers who have experienced the beauty of Kashmir with G.M.B Travels
            </p>
            <div className="flex items-center justify-center space-x-8 bg-white/10 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center mt-1">
                  {renderStars(Math.round(averageRating))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalReviews}</div>
                <div className="text-slate-200">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-slate-400" />
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Select value={filterPackage} onValueChange={setFilterPackage}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="All Packages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                <SelectItem value="explorer">Kashmir Valley Explorer</SelectItem>
                <SelectItem value="deluxe">Srinagar Deluxe Package</SelectItem>
                <SelectItem value="adventure">Kashmir Adventure Special</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg text-slate-800">{testimonial.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-1 text-slate-600">
                          <MapPin className="h-3 w-3" />
                          <span>{testimonial.location}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(testimonial.rating)}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {testimonial.date}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50">
                    <Users className="h-3 w-3 mr-1" />
                    {testimonial.package}
                  </Badge>
                  
                  <div className="relative">
                    <Quote className="absolute top-0 left-0 h-8 w-8 text-amber-200 -mt-2 -ml-1" />
                    <p className="text-slate-700 leading-relaxed pl-6 italic">
                      {testimonial.review}
                    </p>
                  </div>
                  
                  {testimonial.images.length > 0 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {testimonial.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review by ${testimonial.name}`}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredTestimonials.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No reviews found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your filters to see more reviews</p>
              <Button 
                onClick={() => {
                  setFilterRating('all');
                  setFilterPackage('all');
                }}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Create Your Own Story?</h3>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied travelers who have experienced the magic of Kashmir with G.M.B Travels. Your adventure awaits!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600 font-semibold">
                Book Your Trip
              </Button>
              <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 font-semibold">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;