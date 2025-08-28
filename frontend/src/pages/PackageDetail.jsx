import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calendar,
  Users,
  MapPin,
  Star,
  Clock,
  Car,
  Bed,
  Camera,
  ArrowLeft,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react';
import { mockData } from '../mock';
import { toast } from 'sonner';

const PackageDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const packageData = mockData.packages[parseInt(id) - 1];

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Package Not Found</h2>
          <Link to="/packages">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Packages
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    toast.success('Booking inquiry sent! We will contact you soon.');
  };

  const additionalImages = [
    packageData.image,
    "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/bm97gdwu_pexels-azam-khan-12040331.jpg",
    "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/rudsgdbz_pexels-azeen-shah-10542627.jpg",
    "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/1ff3rziy_pexels-farhaan-mushtaq-parimoo-13671454.jpg"
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <span>/</span>
            <Link to="/packages" className="hover:text-amber-600">Packages</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">{packageData.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={additionalImages[selectedImage]} 
                  alt={packageData.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-amber-600 text-white font-semibold text-lg px-3 py-1">
                    ₹{packageData.price.toLocaleString()}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {additionalImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`View ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${
                        selectedImage === index ? 'ring-2 ring-amber-600' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-3xl text-slate-800">{packageData.title}</CardTitle>
                    <CardDescription className="text-lg mt-2">{packageData.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-amber-500 fill-current" />
                    <span className="text-lg font-semibold">4.8</span>
                    <span className="text-slate-600">(124 reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800">{packageData.duration}</div>
                    <div className="text-sm text-slate-600">Duration</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Users className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800">{packageData.groupSize}</div>
                    <div className="text-sm text-slate-600">Group Size</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <MapPin className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800">Kashmir</div>
                    <div className="text-sm text-slate-600">Destination</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <Star className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800">Premium</div>
                    <div className="text-sm text-slate-600">Category</div>
                  </div>
                </div>

                <Tabs defaultValue="highlights" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="highlights">Highlights</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                    <TabsTrigger value="policies">Policies</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="highlights" className="mt-6">
                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-slate-800">Package Highlights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {packageData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="itinerary" className="mt-6">
                    <div className="space-y-6">
                      <h4 className="text-xl font-semibold text-slate-800">Day-wise Itinerary</h4>
                      {mockData.itinerary.map((day, index) => (
                        <div key={index} className="border-l-4 border-amber-600 pl-6 pb-6">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Day {day.day}
                            </div>
                            <h5 className="text-lg font-semibold text-slate-800">{day.title}</h5>
                          </div>
                          <p className="text-slate-600 mb-3">{day.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {day.activities.map((activity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inclusions" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Included
                        </h4>
                        <ul className="space-y-2">
                          {mockData.inclusions.map((item, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-slate-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                          <span className="w-5 h-5 mr-2 flex items-center justify-center">✕</span>
                          Not Included
                        </h4>
                        <ul className="space-y-2">
                          {mockData.exclusions.map((item, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-red-500 mt-1 flex-shrink-0">✕</span>
                              <span className="text-slate-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="policies" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-4">Cancellation Policy</h4>
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <ul className="space-y-2 text-slate-700">
                            <li>• 30+ days before departure: 15% cancellation fee</li>
                            <li>• 15-30 days before departure: 50% cancellation fee</li>
                            <li>• Less than 15 days: No refund</li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-4">Important Notes</h4>
                        <ul className="space-y-2 text-slate-700">
                          <li>• Valid ID proof required for all travelers</li>
                          <li>• Weather conditions may affect itinerary</li>
                          <li>• Advance booking recommended during peak season</li>
                          <li>• Additional activities can be arranged on request</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800">Book This Package</CardTitle>
                <CardDescription>Starting from ₹{packageData.price.toLocaleString()} per person</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-600">Duration</span>
                    <span className="font-semibold">{packageData.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-600">Group Size</span>
                    <span className="font-semibold">{packageData.groupSize}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-slate-600">Category</span>
                    <span className="font-semibold">Premium</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
                    Request Quote
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Call: +91 98765 43210</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Email: info@gmbtravelskashmir.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Packages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Similar Packages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockData.packages.filter((_, index) => index !== parseInt(id) - 1).slice(0, 2).map((pkg, index) => (
                  <div key={index} className="flex space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-slate-800 text-sm truncate">{pkg.title}</h5>
                      <p className="text-xs text-slate-600 mt-1">{pkg.duration}</p>
                      <p className="text-sm font-semibold text-amber-600 mt-1">₹{pkg.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                <Link to="/packages">
                  <Button variant="outline" className="w-full mt-4">
                    View All Packages
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;