from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

# Enums for status fields
class BookingStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"

class TestimonialStatus(str, Enum):
    approved = "approved"
    pending = "pending"

class InquiryStatus(str, Enum):
    new = "new"
    replied = "replied"
    closed = "closed"

class PackageStatus(str, Enum):
    active = "active"
    inactive = "inactive"

class TripType(str, Enum):
    oneway = "oneway"
    roundtrip = "roundtrip"
    local = "local"

# Package Models
class ItineraryDay(BaseModel):
    day: int
    title: str
    description: str
    activities: List[str]

class Package(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    title: str
    description: str
    duration: str
    price: float
    groupSize: str
    image: str
    images: List[str] = []
    highlights: List[str] = []
    itinerary: List[ItineraryDay] = []
    inclusions: List[str] = []
    exclusions: List[str] = []
    category: str = "standard"
    status: PackageStatus = PackageStatus.active
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class PackageCreate(BaseModel):
    title: str
    description: str
    duration: str
    price: float
    groupSize: str
    image: str
    images: List[str] = []
    highlights: List[str] = []
    itinerary: List[ItineraryDay] = []
    inclusions: List[str] = []
    exclusions: List[str] = []
    category: str = "standard"

class PackageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    price: Optional[float] = None
    groupSize: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    highlights: Optional[List[str]] = None
    itinerary: Optional[List[ItineraryDay]] = None
    inclusions: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    category: Optional[str] = None
    status: Optional[PackageStatus] = None
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Booking Models
class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    customerName: str
    email: EmailStr
    phone: str
    packageId: Optional[str] = None
    packageTitle: str
    travelDate: datetime
    travelers: int
    totalAmount: float
    status: BookingStatus = BookingStatus.pending
    specialRequests: str = ""
    bookingType: str = "package"  # package or cab
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class BookingCreate(BaseModel):
    customerName: str
    email: EmailStr
    phone: str
    packageId: Optional[str] = None
    packageTitle: str
    travelDate: datetime
    travelers: int
    totalAmount: float
    specialRequests: str = ""
    bookingType: str = "package"

# Testimonial Models
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    customerName: str
    location: str
    rating: int = Field(ge=1, le=5)
    review: str
    packageName: str
    date: str
    images: List[str] = []
    status: TestimonialStatus = TestimonialStatus.pending
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class TestimonialCreate(BaseModel):
    customerName: str
    location: str
    rating: int = Field(ge=1, le=5)
    review: str
    packageName: str
    date: str
    images: List[str] = []

# Cab Booking Models
class CabBooking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    customerName: str
    email: EmailStr
    phone: str
    pickupLocation: str
    dropLocation: str = ""
    pickupDate: datetime
    pickupTime: str
    returnDate: Optional[datetime] = None
    returnTime: Optional[str] = None
    tripType: TripType
    vehicleType: str
    passengers: int
    specialRequests: str = ""
    status: BookingStatus = BookingStatus.pending
    estimatedCost: float = 0.0
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class CabBookingCreate(BaseModel):
    customerName: str
    email: EmailStr
    phone: str
    pickupLocation: str
    dropLocation: str = ""
    pickupDate: datetime
    pickupTime: str
    returnDate: Optional[datetime] = None
    returnTime: Optional[str] = None
    tripType: TripType
    vehicleType: str
    passengers: int
    specialRequests: str = ""

# Contact Models
class ContactInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    email: EmailStr
    phone: str
    subject: str
    inquiryType: str = "general"
    message: str
    preferredContact: str = "email"
    status: InquiryStatus = InquiryStatus.new
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    subject: str
    inquiryType: str = "general"
    message: str
    preferredContact: str = "email"

# Gallery Models
class GalleryImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    title: str
    description: str = ""
    imageUrl: str
    category: str = "gallery"  # package, gallery, testimonial
    tags: List[str] = []
    isActive: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class ImageCreate(BaseModel):
    title: str
    description: str = ""
    imageUrl: str
    category: str = "gallery"
    tags: List[str] = []

# Admin Models
class Admin(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    username: str
    passwordHash: str
    email: EmailStr
    isActive: bool = True
    lastLogin: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class AdminLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Dashboard Stats
class DashboardStats(BaseModel):
    totalPackages: int
    activeBookings: int
    cabBookings: int
    customerReviews: int
    monthlyRevenue: float
    recentBookings: List[Dict[str, Any]]

# Site Settings Models
class ContactInfo(BaseModel):
    phone: List[str] = ["+91 98765 43210", "+91 98765 43211"]
    email: List[str] = ["info@gmbtravelskashmir.com", "bookings@gmbtravelskashmir.com"]
    address: List[str] = ["Main Office: Srinagar, Kashmir, India", "Branch: Dal Lake Area"]
    workingHours: List[str] = ["Mon - Sat: 9:00 AM - 8:00 PM", "Sun: 10:00 AM - 6:00 PM"]
    whatsapp: str = "+919876543210"

class SocialMedia(BaseModel):
    facebook: str = ""
    instagram: str = ""
    twitter: str = ""
    youtube: str = ""
    linkedin: str = ""

class CompanyInfo(BaseModel):
    name: str = "G.M.B Travels Kashmir"
    tagline: str = "Discover Paradise on Earth"
    description: str = "Your trusted partner for exploring the magnificent beauty of Kashmir. We create unforgettable experiences that last a lifetime."
    logo: str = "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u7oxyvzc_logo.jpg"
    aboutText: str = "With years of experience in Kashmir tourism, G.M.B Travels Kashmir has been the trusted companion for travelers seeking authentic experiences in the paradise on earth."
    missionStatement: str = "We specialize in creating unforgettable journeys through Kashmir's breathtaking landscapes."

class HeroSection(BaseModel):
    title: str = "Experience the Beauty of"
    subtitle: str = "Kashmir"
    description: str = "Discover the pristine valleys, serene lakes, and majestic mountains of Kashmir with our expertly crafted tour packages"
    backgroundImage: str = "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg"
    ctaButtonText: str = "Explore Packages"
    secondaryCtaText: str = "Contact Us"

class MapSettings(BaseModel):
    embedUrl: str = ""
    latitude: float = 34.0837
    longitude: float = 74.7973
    zoomLevel: int = 12
    address: str = "Srinagar, Kashmir, India"

class SeoSettings(BaseModel):
    homeTitle: str = "G.M.B Travels Kashmir - Experience Paradise on Earth"
    homeDescription: str = "Discover Kashmir's beauty with our expertly crafted tour packages. Book your dream vacation today!"
    homeKeywords: List[str] = ["Kashmir tours", "Kashmir travel", "Dal Lake", "Gulmarg", "Srinagar tours"]
    siteUrl: str = "https://gmbtravelskashmir.com"
    ogImage: str = "https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg"

class BusinessStats(BaseModel):
    yearsExperience: int = 10
    happyCustomers: int = 500
    tourPackages: int = 50
    supportAvailability: str = "24/7"

class SiteSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    contactInfo: ContactInfo = ContactInfo()
    socialMedia: SocialMedia = SocialMedia()
    companyInfo: CompanyInfo = CompanyInfo()
    heroSection: HeroSection = HeroSection()
    mapSettings: MapSettings = MapSettings()
    seoSettings: SeoSettings = SeoSettings()
    businessStats: BusinessStats = BusinessStats()
    isActive: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class SiteSettingsUpdate(BaseModel):
    contactInfo: Optional[ContactInfo] = None
    socialMedia: Optional[SocialMedia] = None
    companyInfo: Optional[CompanyInfo] = None
    heroSection: Optional[HeroSection] = None
    mapSettings: Optional[MapSettings] = None
    seoSettings: Optional[SeoSettings] = None
    businessStats: Optional[BusinessStats] = None
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Team Management Models
class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    agent = "agent"

class TeamMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    fullName: str
    email: EmailStr
    phone: str
    username: str
    passwordHash: str
    role: UserRole
    department: str
    joiningDate: datetime
    isActive: bool = True
    lastLogin: Optional[datetime] = None
    packagesCreated: int = 0
    clientsManaged: int = 0
    avatar: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class TeamMemberCreate(BaseModel):
    fullName: str
    email: EmailStr
    phone: str
    username: str
    password: str
    role: UserRole
    department: str
    joiningDate: datetime
    isActive: bool = True

class TeamMemberUpdate(BaseModel):
    fullName: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    username: Optional[str] = None
    role: Optional[UserRole] = None
    department: Optional[str] = None
    joiningDate: Optional[datetime] = None
    isActive: Optional[bool] = None
    packagesCreated: Optional[int] = None
    clientsManaged: Optional[int] = None
    avatar: Optional[str] = None
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class PasswordChangeRequest(BaseModel):
    oldPassword: str
    newPassword: str

class TeamLogin(BaseModel):
    username: str
    password: str

# Popup/Announcement Models
class PopupType(str, Enum):
    offer = "offer"
    announcement = "announcement"
    news = "news"
    alert = "alert"

class Popup(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    title: str
    content: str
    popupType: PopupType
    backgroundColor: str = "#ffffff"
    textColor: str = "#000000"
    buttonText: str = "Close"
    buttonColor: str = "#f59e0b"
    imageUrl: Optional[str] = None
    linkUrl: Optional[str] = None
    isActive: bool = True
    showOnPages: List[str] = ["home"]  # pages where popup should show
    displayDuration: int = 5000  # milliseconds
    cookieExpiry: int = 24  # hours before showing again
    startDate: datetime = Field(default_factory=datetime.utcnow)
    endDate: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class PopupCreate(BaseModel):
    title: str
    content: str
    popupType: PopupType
    backgroundColor: str = "#ffffff"
    textColor: str = "#000000"
    buttonText: str = "Close"
    buttonColor: str = "#f59e0b"
    imageUrl: Optional[str] = None
    linkUrl: Optional[str] = None
    showOnPages: List[str] = ["home"]
    displayDuration: int = 5000
    cookieExpiry: int = 24
    startDate: datetime = Field(default_factory=datetime.utcnow)
    endDate: Optional[datetime] = None

class PopupUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    popupType: Optional[PopupType] = None
    backgroundColor: Optional[str] = None
    textColor: Optional[str] = None
    buttonText: Optional[str] = None
    buttonColor: Optional[str] = None
    imageUrl: Optional[str] = None
    linkUrl: Optional[str] = None
    isActive: Optional[bool] = None
    showOnPages: Optional[List[str]] = None
    displayDuration: Optional[int] = None
    cookieExpiry: Optional[int] = None
    startDate: Optional[datetime] = None
    endDate: Optional[datetime] = None
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Enhanced CRM Models
class CommunicationType(str, Enum):
    email = "email"
    phone = "phone" 
    whatsapp = "whatsapp"
    sms = "sms"
    in_person = "in_person"

class ClientStatus(str, Enum):
    lead = "lead"
    interested = "interested"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"

class FollowUpStatus(str, Enum):
    pending = "pending"
    completed = "completed"
    cancelled = "cancelled"

class Communication(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: CommunicationType
    direction: str  # "inbound" or "outbound"
    subject: Optional[str] = None
    message: str
    status: str = "completed"
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    scheduledFor: Optional[datetime] = None
    completedAt: Optional[datetime] = None
    attachments: List[str] = []
    notes: Optional[str] = None

class FollowUp(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: CommunicationType
    scheduledDate: datetime
    message: str
    status: FollowUpStatus = FollowUpStatus.pending
    priority: str = "medium"  # low, medium, high
    assignedTo: Optional[str] = None  # team member ID
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    completedAt: Optional[datetime] = None
    notes: Optional[str] = None

class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    rating: int  # 1-5
    title: str
    content: str
    packageName: Optional[str] = None
    isPublic: bool = False
    isApproved: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    approvedAt: Optional[datetime] = None
    images: List[str] = []

class Client(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    email: EmailStr
    phone: str
    whatsapp: Optional[str] = None
    address: Optional[str] = None
    interests: Optional[str] = None
    budget: Optional[str] = None
    source: str = "website"  # website, referral, social_media, advertisement, walk_in
    status: ClientStatus = ClientStatus.lead
    preferredContact: CommunicationType = CommunicationType.phone
    notes: Optional[str] = None
    tags: List[str] = []
    
    # Enhanced CRM fields
    communicationHistory: List[Communication] = []
    followUps: List[FollowUp] = []
    reviews: List[Review] = []
    totalSpent: float = 0
    bookings: int = 0
    
    # Metadata
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    lastContact: Optional[datetime] = None
    assignedTo: Optional[str] = None  # team member ID

    class Config:
        populate_by_name = True

class ClientCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    whatsapp: Optional[str] = None
    address: Optional[str] = None
    interests: Optional[str] = None
    budget: Optional[str] = None
    source: str = "website"
    status: ClientStatus = ClientStatus.lead
    preferredContact: CommunicationType = CommunicationType.phone
    notes: Optional[str] = None
    tags: List[str] = []
    assignedTo: Optional[str] = None

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    address: Optional[str] = None
    interests: Optional[str] = None
    budget: Optional[str] = None
    source: Optional[str] = None
    status: Optional[ClientStatus] = None
    preferredContact: Optional[CommunicationType] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    totalSpent: Optional[float] = None
    bookings: Optional[int] = None
    assignedTo: Optional[str] = None
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class CommunicationCreate(BaseModel):
    type: CommunicationType
    direction: str
    subject: Optional[str] = None
    message: str
    scheduledFor: Optional[datetime] = None
    attachments: List[str] = []
    notes: Optional[str] = None

class FollowUpCreate(BaseModel):
    type: CommunicationType
    scheduledDate: datetime
    message: str
    priority: str = "medium"
    assignedTo: Optional[str] = None
    notes: Optional[str] = None

class ReviewCreate(BaseModel):
    rating: int
    title: str
    content: str
    packageName: Optional[str] = None
    images: List[str] = []

# Blog Management Models
class BlogStatus(str, Enum):
    draft = "draft"
    pending_approval = "pending_approval"
    approved = "approved"
    published = "published"
    archived = "archived"

class BlogCategory(str, Enum):
    destinations = "destinations"
    travel_tips = "travel_tips"
    culture = "culture"
    adventure = "adventure"
    photography = "photography"
    seasonal = "seasonal"
    news = "news"

class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    title: str
    slug: str
    content: str
    excerpt: str
    category: BlogCategory
    tags: List[str] = []
    status: BlogStatus = BlogStatus.draft
    
    # SEO fields
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None
    seoKeywords: List[str] = []
    
    # Media
    featuredImage: Optional[str] = None
    images: List[str] = []
    
    # AI generation metadata
    isAIGenerated: bool = False
    aiModel: Optional[str] = None
    generationPrompt: Optional[str] = None
    
    # Publishing
    publishedAt: Optional[datetime] = None
    scheduledFor: Optional[datetime] = None
    
    # Authorship
    authorId: Optional[str] = None  # team member who created/approved
    approvedBy: Optional[str] = None  # admin who approved
    
    # Analytics
    views: int = 0
    likes: int = 0
    shares: int = 0
    
    # Metadata
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class BlogPostCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    category: BlogCategory
    tags: List[str] = []
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None
    seoKeywords: List[str] = []
    featuredImage: Optional[str] = None
    images: List[str] = []
    scheduledFor: Optional[datetime] = None

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category: Optional[BlogCategory] = None
    tags: Optional[List[str]] = None
    status: Optional[BlogStatus] = None
    metaTitle: Optional[str] = None
    metaDescription: Optional[str] = None
    seoKeywords: Optional[List[str]] = None
    featuredImage: Optional[str] = None
    images: Optional[List[str]] = None
    publishedAt: Optional[datetime] = None
    scheduledFor: Optional[datetime] = None
    approvedBy: Optional[str] = None
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class AIBlogRequest(BaseModel):
    topic: str
    category: BlogCategory
    keywords: List[str] = []
    targetLength: int = 1500  # words
    tone: str = "informative"  # informative, casual, professional, exciting
    includeImages: bool = True
    focusAreas: List[str] = []  # specific aspects to focus on

class BlogGenerationSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    isAutoGenerationEnabled: bool = False
    generationFrequency: str = "weekly"  # daily, weekly, bi-weekly, monthly
    preferredCategories: List[BlogCategory] = []
    autoApprovalEnabled: bool = False
    aiModel: str = "gpt-4o-mini"
    aiProvider: str = "openai"
    defaultTone: str = "informative"
    defaultLength: int = 1500
    lastGenerated: Optional[datetime] = None
    nextScheduled: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Vehicle Management Models
class VehicleType(str, Enum):
    force_urbania = "force_urbania"
    innova_crysta = "innova_crysta" 
    tempo_traveller = "tempo_traveller"
    mahindra_scorpio = "mahindra_scorpio"
    sedan_dzire = "sedan_dzire"
    luxury_fortuner = "luxury_fortuner"

class FuelType(str, Enum):
    petrol = "petrol"
    diesel = "diesel"
    cng = "cng"
    hybrid = "hybrid"
    electric = "electric"

class TransmissionType(str, Enum):
    manual = "manual"
    automatic = "automatic"
    both = "both"

class VehicleSpecifications(BaseModel):
    fuelType: FuelType
    transmission: TransmissionType
    mileage: str
    luggage: str

class Vehicle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    vehicleType: VehicleType
    name: str
    model: str
    capacity: str
    price: float
    priceUnit: str = "per km"
    features: List[str] = []
    specifications: VehicleSpecifications
    image: str
    badge: Optional[str] = None
    badgeColor: str = "bg-blue-500"
    isActive: bool = True
    isPopular: bool = False
    sortOrder: int = 0
    description: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class VehicleCreate(BaseModel):
    vehicleType: VehicleType
    name: str
    model: str
    capacity: str
    price: float
    priceUnit: str = "per km"
    features: List[str] = []
    specifications: VehicleSpecifications
    image: str
    badge: Optional[str] = None
    badgeColor: str = "bg-blue-500"
    isActive: bool = True
    isPopular: bool = False
    sortOrder: int = 0
    description: Optional[str] = None

class VehicleUpdate(BaseModel):
    vehicleType: Optional[VehicleType] = None
    name: Optional[str] = None
    model: Optional[str] = None
    capacity: Optional[str] = None
    price: Optional[float] = None
    priceUnit: Optional[str] = None
    features: Optional[List[str]] = None
    specifications: Optional[VehicleSpecifications] = None
    image: Optional[str] = None
    badge: Optional[str] = None
    badgeColor: Optional[str] = None
    isActive: Optional[bool] = None
    isPopular: Optional[bool] = None
    sortOrder: Optional[int] = None
    description: Optional[str] = None
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# CRM WhatsApp Integration Models  
class WhatsAppMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    clientId: str
    phoneNumber: str
    message: str
    messageType: str = "text"  # text, image, document, etc.
    direction: str  # inbound, outbound
    status: str = "sent"  # sent, delivered, read, failed
    templateName: Optional[str] = None  # for template messages
    templateData: Optional[Dict[str, Any]] = None
    scheduledFor: Optional[datetime] = None
    sentAt: Optional[datetime] = None
    deliveredAt: Optional[datetime] = None
    readAt: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class WhatsAppTemplate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    category: str  # welcome, booking_confirmation, follow_up, promotional
    message: str
    variables: List[str] = []  # {{client_name}}, {{package_name}}, etc.
    isActive: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class WhatsAppConfig(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    isEnabled: bool = False
    phoneNumber: str
    apiToken: Optional[str] = None
    webhookUrl: Optional[str] = None
    autoReplyEnabled: bool = False
    autoReplyMessage: str = "Thank you for contacting G.M.B Travels Kashmir! We'll get back to you soon."
    businessHours: Dict[str, Any] = {
        "enabled": True,
        "start": "09:00",
        "end": "18:00",
        "timezone": "Asia/Kolkata",
        "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    }
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True