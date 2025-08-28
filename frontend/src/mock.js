import { Mountain, Car, Bed, MapPin, Phone, Mail } from 'lucide-react';

export const mockData = {
  services: [
    {
      icon: Mountain,
      title: "Kashmir Tour Packages",
      description: "Explore the breathtaking valleys, pristine lakes, and snow-capped mountains of Kashmir with our expertly designed tour packages for all types of travelers."
    },
    {
      icon: Bed,
      title: "Hotel & Houseboat Bookings",
      description: "Experience authentic Kashmir hospitality with our carefully selected hotels and traditional houseboats on Dal Lake for a truly memorable stay."
    },
    {
      icon: Car,
      title: "Transportation Services", 
      description: "Comfortable and reliable transportation including car rentals, airport transfers, and guided tours with experienced local drivers."
    }
  ],
  
  packages: [
    {
      title: "Kashmir Valley Explorer - 7 Days 6 Nights",
      description: "Complete Kashmir experience covering Srinagar, Gulmarg, Pahalgam, and Sonamarg",
      duration: "7D/6N",
      price: 25000,
      groupSize: "2-6 People",
      image: "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/bm97gdwu_pexels-azam-khan-12040331.jpg",
      highlights: [
        "Stay in Dal Lake Houseboat",
        "Gulmarg Gondola Ride",
        "Pahalgam Valley Tour",
        "Sonamarg Glacier Visit",
        "Srinagar City Sightseeing",
        "Mughal Gardens Tour"
      ]
    },
    {
      title: "Srinagar Deluxe Package - 5 Days 4 Nights", 
      description: "Luxury stay and experiences in the summer capital of Kashmir",
      duration: "5D/4N",
      price: 18000,
      groupSize: "2-4 People", 
      image: "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/rudsgdbz_pexels-azeen-shah-10542627.jpg",
      highlights: [
        "3-Star Deluxe Accommodation",
        "Dal Lake Shikara Ride",
        "Nishat & Shalimar Gardens",
        "Shankaracharya Temple",
        "Local Market Shopping",
        "Traditional Kashmiri Cuisine"
      ]
    },
    {
      title: "Kashmir Adventure Special",
      description: "Perfect blend of adventure and scenic beauty for thrill seekers",
      duration: "6D/5N",
      price: 22000,
      groupSize: "4-8 People",
      image: "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg", 
      highlights: [
        "Trekking in Pahalgam",
        "River Rafting in Lidder",
        "Gulmarg Skiing (Season)",
        "Sonamarg Pony Rides",
        "Camping Experience",
        "Adventure Sports Activities"
      ]
    }
  ],
  
  itinerary: [
    {
      day: 1,
      title: "Arrival in Srinagar",
      description: "Arrive at Srinagar airport, transfer to houseboat, Dal Lake shikara ride, overnight stay",
      activities: ["Airport Transfer", "Houseboat Check-in", "Dal Lake", "Shikara Ride"]
    },
    {
      day: 2,
      title: "Srinagar Sightseeing",
      description: "Visit Mughal Gardens, Shankaracharya Temple, local markets, evening at leisure",
      activities: ["Nishat Garden", "Shalimar Garden", "Temple Visit", "Shopping"]
    },
    {
      day: 3,
      title: "Gulmarg Excursion",
      description: "Day trip to Gulmarg, Gondola ride, snow activities, return to Srinagar",
      activities: ["Gulmarg", "Gondola Ride", "Snow Activities", "Photography"]
    },
    {
      day: 4,
      title: "Pahalgam Valley",
      description: "Drive to Pahalgam, Betaab Valley, Aru Valley, riverside walk, overnight stay",
      activities: ["Pahalgam", "Betaab Valley", "Aru Valley", "River Walk"]
    },
    {
      day: 5,
      title: "Sonamarg Day Trip",
      description: "Visit Sonamarg glacier, pony ride, Thajiwas glacier, return to Srinagar",
      activities: ["Sonamarg", "Glacier Visit", "Pony Ride", "Nature Walk"]
    }
  ],

  inclusions: [
    "Airport transfers",
    "Accommodation as per itinerary",
    "All meals (breakfast, lunch, dinner)",
    "Transportation in AC vehicle",
    "Professional tour guide",
    "Entry tickets to attractions",
    "Houseboat stay",
    "Shikara ride",
    "All taxes and service charges"
  ],

  exclusions: [
    "Airfare to/from Srinagar",
    "Personal expenses",
    "Tips and gratuities",
    "Travel insurance",
    "Additional activities not mentioned",
    "Laundry charges",
    "Phone calls",
    "Alcoholic beverages"
  ],
  
  contactInfo: [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 98765 43210"
    },
    {
      icon: Mail,
      label: "Email", 
      value: "info@gmbtravelskashmir.com"
    },
    {
      icon: MapPin,
      label: "Address",
      value: "Srinagar, Kashmir, India"
    }
  ]
};