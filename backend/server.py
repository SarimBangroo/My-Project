from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
import logging
from pathlib import Path
from typing import List, Optional
import shutil
import uuid
from datetime import datetime

# Load environment variables
load_dotenv()

# Import models and database
from models import *
from database import connect_to_mongo, close_mongo_connection, get_database, create_default_admin
from auth import AuthManager, admin_required, team_member_required
from pdf_generator import PackagePDFGenerator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# App lifespan manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    await create_default_admin()
    yield
    # Shutdown
    await close_mongo_connection()

# Create FastAPI app
app = FastAPI(title="G.M.B Travels Kashmir API", version="1.0.0", lifespan=lifespan)

# Create API router
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
from fastapi.responses import FileResponse

if os.path.exists("build"):
    app.mount("/", StaticFiles(directory="build", html=True), name="frontend")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve React frontend for any non-API route"""
        index_path = os.path.join("build", "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend build not found"}


# Initialize PDF generator
pdf_generator = PackagePDFGenerator()

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "G.M.B Travels Kashmir API is running"}

# Authentication endpoints
@api_router.post("/auth/login", response_model=TokenResponse)
async def admin_login(login_data: AdminLogin):
    """Admin login endpoint."""
    try:
        db = get_database()
        admin_collection = db.admins
        
        # Find admin by username
        admin = await admin_collection.find_one({"username": login_data.username})
        
        if not admin or not AuthManager.verify_password(login_data.password, admin["passwordHash"]):
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )
        
        # Update last login
        await admin_collection.update_one(
            {"_id": admin["_id"]},
            {"$set": {"lastLogin": datetime.utcnow()}}
        )
        
        # Create access token
        access_token = AuthManager.create_access_token(
            data={"sub": admin["username"], "user_id": str(admin["_id"]), "role": "admin"}
        )
        
        return TokenResponse(access_token=access_token)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/auth/verify")
async def verify_token(current_admin: dict = Depends(admin_required)):
    """Verify admin token."""
    return {"valid": True, "admin": current_admin["sub"]}

# Package endpoints
@api_router.get("/packages", response_model=List[Package])
async def get_packages():
    """Get all active packages (public)."""
    try:
        db = get_database()
        packages_collection = db.packages
        
        packages_cursor = packages_collection.find({"status": "active"}).sort("createdAt", -1)
        packages = await packages_cursor.to_list(length=100)
        
        return [Package(**package) for package in packages]
        
    except Exception as e:
        logger.error(f"Get packages error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch packages")

@api_router.get("/packages/{package_id}", response_model=Package)
async def get_package_by_id(package_id: str):
    """Get package by ID (public)."""
    try:
        db = get_database()
        packages_collection = db.packages
        
        package = await packages_collection.find_one({"_id": package_id, "status": "active"})
        
        if not package:
            raise HTTPException(status_code=404, detail="Package not found")
        
        return Package(**package)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get package error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch package")

# Admin package endpoints
@api_router.get("/admin/packages", response_model=List[Package])
async def admin_get_packages(current_admin: dict = Depends(admin_required)):
    """Get all packages (admin)."""
    try:
        db = get_database()
        packages_collection = db.packages
        
        packages_cursor = packages_collection.find({}).sort("createdAt", -1)
        packages = await packages_cursor.to_list(length=1000)
        
        return [Package(**package) for package in packages]
        
    except Exception as e:
        logger.error(f"Admin get packages error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch packages")

@api_router.post("/admin/packages", response_model=Package)
async def create_package(package_data: PackageCreate, current_admin: dict = Depends(admin_required)):
    """Create new package (admin)."""
    try:
        db = get_database()
        packages_collection = db.packages
        
        package = Package(**package_data.dict())
        
        result = await packages_collection.insert_one(package.dict(by_alias=True))
        package.id = str(result.inserted_id)
        
        return package
        
    except Exception as e:
        logger.error(f"Create package error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create package")

@api_router.put("/admin/packages/{package_id}", response_model=Package)
async def update_package(package_id: str, package_data: PackageUpdate, current_admin: dict = Depends(admin_required)):
    """Update package (admin)."""
    try:
        db = get_database()
        packages_collection = db.packages
        
        # Check if package exists
        existing_package = await packages_collection.find_one({"_id": package_id})
        if not existing_package:
            raise HTTPException(status_code=404, detail="Package not found")
        
        # Update package
        update_data = {k: v for k, v in package_data.dict().items() if v is not None}
        update_data["updatedAt"] = datetime.utcnow()
        
        await packages_collection.update_one(
            {"_id": package_id},
            {"$set": update_data}
        )
        
        # Return updated package
        updated_package = await packages_collection.find_one({"_id": package_id})
        return Package(**updated_package)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update package error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update package")

@api_router.delete("/admin/packages/{package_id}")
async def delete_package(package_id: str, current_admin: dict = Depends(admin_required)):
    """Delete package (admin)."""
    try:
        db = get_database()
        packages_collection = db.packages
        
        result = await packages_collection.delete_one({"_id": package_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Package not found")
        
        return {"message": "Package deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete package error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete package")

# Booking endpoints
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate):
    """Create new booking (public)."""
    try:
        db = get_database()
        bookings_collection = db.bookings
        
        booking = Booking(**booking_data.dict())
        
        result = await bookings_collection.insert_one(booking.dict(by_alias=True))
        booking.id = str(result.inserted_id)
        
        return booking
        
    except Exception as e:
        logger.error(f"Create booking error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create booking")

@api_router.get("/admin/bookings", response_model=List[Booking])
async def admin_get_bookings(current_admin: dict = Depends(admin_required)):
    """Get all bookings (admin)."""
    try:
        db = get_database()
        bookings_collection = db.bookings
        
        bookings_cursor = bookings_collection.find({}).sort("createdAt", -1)
        bookings = await bookings_cursor.to_list(length=1000)
        
        return [Booking(**booking) for booking in bookings]
        
    except Exception as e:
        logger.error(f"Admin get bookings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch bookings")

# Testimonials endpoints
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    """Get approved testimonials (public)."""
    try:
        db = get_database()
        testimonials_collection = db.testimonials
        
        testimonials_cursor = testimonials_collection.find({"status": "approved"}).sort("createdAt", -1)
        testimonials = await testimonials_cursor.to_list(length=100)
        
        return [Testimonial(**testimonial) for testimonial in testimonials]
        
    except Exception as e:
        logger.error(f"Get testimonials error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch testimonials")

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial_data: TestimonialCreate):
    """Submit testimonial (public)."""
    try:
        db = get_database()
        testimonials_collection = db.testimonials
        
        testimonial = Testimonial(**testimonial_data.dict())
        
        result = await testimonials_collection.insert_one(testimonial.dict(by_alias=True))
        testimonial.id = str(result.inserted_id)
        
        return testimonial
        
    except Exception as e:
        logger.error(f"Create testimonial error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create testimonial")

# Cab booking endpoints
@api_router.post("/cab-bookings", response_model=CabBooking)
async def create_cab_booking(cab_booking_data: CabBookingCreate):
    """Create cab booking (public)."""
    try:
        db = get_database()
        cab_bookings_collection = db.cab_bookings
        
        cab_booking = CabBooking(**cab_booking_data.dict())
        
        result = await cab_bookings_collection.insert_one(cab_booking.dict(by_alias=True))
        cab_booking.id = str(result.inserted_id)
        
        return cab_booking
        
    except Exception as e:
        logger.error(f"Create cab booking error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create cab booking")

# Contact endpoints
@api_router.post("/contact", response_model=ContactInquiry)
async def create_contact_inquiry(contact_data: ContactCreate):
    """Submit contact inquiry (public)."""
    try:
        db = get_database()
        contact_collection = db.contact_inquiries
        
        inquiry = ContactInquiry(**contact_data.dict())
        
        result = await contact_collection.insert_one(inquiry.dict(by_alias=True))
        inquiry.id = str(result.inserted_id)
        
        return inquiry
        
    except Exception as e:
        logger.error(f"Create contact inquiry error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create inquiry")

# File upload endpoint
@api_router.post("/admin/upload")
async def upload_image(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    category: str = Form("gallery"),
    current_admin: dict = Depends(admin_required)
):
    """Upload image (admin)."""
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate unique filename
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create database entry
        db = get_database()
        images_collection = db.gallery_images
        
        image = GalleryImage(
            title=title,
            description=description,
            imageUrl=f"/uploads/{unique_filename}",
            category=category
        )
        
        result = await images_collection.insert_one(image.dict(by_alias=True))
        
        return {
            "message": "Image uploaded successfully",
            "image_id": str(result.inserted_id),
            "image_url": f"/uploads/{unique_filename}"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload image error: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload image")

# Dashboard stats endpoint
@api_router.get("/admin/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_admin: dict = Depends(admin_required)):
    """Get dashboard statistics (admin)."""
    try:
        db = get_database()
        
        # Get counts
        total_packages = await db.packages.count_documents({"status": "active"})
        active_bookings = await db.bookings.count_documents({"status": "confirmed"})
        cab_bookings = await db.cab_bookings.count_documents({})
        customer_reviews = await db.testimonials.count_documents({"status": "approved"})
        
        # Get recent bookings
        recent_bookings_cursor = db.bookings.find({}).sort("createdAt", -1).limit(5)
        recent_bookings = await recent_bookings_cursor.to_list(length=5)
        
        # Calculate monthly revenue (mock calculation)
        monthly_revenue = 125000.0  # This would be calculated based on confirmed bookings
        
        return DashboardStats(
            totalPackages=total_packages,
            activeBookings=active_bookings,
            cabBookings=cab_bookings,
            customerReviews=customer_reviews,
            monthlyRevenue=monthly_revenue,
            recentBookings=[
                {
                    "id": str(booking["_id"]),
                    "customer": booking["customerName"],
                    "package": booking["packageTitle"],
                    "date": booking["createdAt"].isoformat(),
                    "status": booking["status"]
                }
                for booking in recent_bookings
            ]
        )
        
    except Exception as e:
        logger.error(f"Get dashboard stats error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard stats")

# PDF Generation endpoints
@api_router.post("/admin/packages/{package_id}/generate-pdf")
async def generate_package_pdf(
    package_id: str, 
    client_name: Optional[str] = Query(None),
    client_email: Optional[str] = Query(None),
    client_phone: Optional[str] = Query(None),
    travel_date: Optional[str] = Query(None),
    travelers: Optional[int] = Query(None),
    current_admin: dict = Depends(admin_required)
):
    """Generate PDF for a specific package (admin)."""
    try:
        db = get_database()
        packages_collection = db.packages
        
        # Get package data
        package = await packages_collection.find_one({"_id": package_id})
        if not package:
            raise HTTPException(status_code=404, detail="Package not found")
        
        # Prepare client info if provided
        client_info = None
        if client_name:
            client_info = {
                'name': client_name,
                'email': client_email or '',
                'phone': client_phone or '',
                'travel_date': travel_date or 'To be confirmed',
                'travelers': travelers or 1
            }
        
        # Generate PDF
        pdf_result = pdf_generator.create_package_pdf(package, client_info)
        
        return {
            "success": True,
            "message": "PDF generated successfully",
            "pdf": pdf_result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Generate PDF error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate PDF")

@api_router.get("/admin/packages/{package_id}/download-pdf")
async def download_package_pdf(
    package_id: str,
    client_name: Optional[str] = Query(None),
    client_email: Optional[str] = Query(None),
    client_phone: Optional[str] = Query(None),
    travel_date: Optional[str] = Query(None),
    travelers: Optional[int] = Query(None),
    current_admin: dict = Depends(admin_required)
):
    """Download PDF for a specific package (admin)."""
    try:
        db = get_database()
        packages_collection = db.packages
        
        # Get package data
        package = await packages_collection.find_one({"_id": package_id})
        if not package:
            raise HTTPException(status_code=404, detail="Package not found")
        
        # Prepare client info if provided
        client_info = None
        if client_name:
            client_info = {
                'name': client_name,
                'email': client_email or '',
                'phone': client_phone or '',
                'travel_date': travel_date or 'To be confirmed',
                'travelers': travelers or 1
            }
        
        # Generate PDF
        pdf_result = pdf_generator.create_package_pdf(package, client_info)
        
        # Return file for download
        return FileResponse(
            path=pdf_result['filepath'],
            filename=pdf_result['filename'],
            media_type='application/pdf'
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Download PDF error: {e}")
        raise HTTPException(status_code=500, detail="Failed to download PDF")

@api_router.get("/admin/generate-sample-pdf")
async def generate_sample_pdf(current_admin: dict = Depends(admin_required)):
    """Generate a sample PDF to test the system (admin)."""
    try:
        from pdf_generator import generate_sample_pdf
        
        pdf_result = generate_sample_pdf()
        
        return {
            "success": True,
            "message": "Sample PDF generated successfully",
            "pdf": pdf_result
        }
        
    except Exception as e:
        logger.error(f"Generate sample PDF error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate sample PDF")

# Site Settings endpoints
@api_router.get("/site-settings", response_model=SiteSettings)
async def get_site_settings():
    """Get site settings (public)."""
    try:
        db = get_database()
        settings_collection = db.site_settings
        
        settings = await settings_collection.find_one({"isActive": True})
        
        if not settings:
            # Create default settings if none exist
            default_settings = SiteSettings()
            await settings_collection.insert_one(default_settings.dict(by_alias=True))
            return default_settings
        
        return SiteSettings(**settings)
        
    except Exception as e:
        logger.error(f"Get site settings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch site settings")

@api_router.get("/admin/site-settings", response_model=SiteSettings)
async def admin_get_site_settings(current_admin: dict = Depends(admin_required)):
    """Get site settings (admin)."""
    try:
        db = get_database()
        settings_collection = db.site_settings
        
        settings = await settings_collection.find_one({"isActive": True})
        
        if not settings:
            # Create default settings if none exist
            default_settings = SiteSettings()
            await settings_collection.insert_one(default_settings.dict(by_alias=True))
            return default_settings
        
        return SiteSettings(**settings)
        
    except Exception as e:
        logger.error(f"Admin get site settings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch site settings")

@api_router.put("/admin/site-settings", response_model=SiteSettings)
async def update_site_settings(settings_data: SiteSettingsUpdate, current_admin: dict = Depends(admin_required)):
    """Update site settings (admin)."""
    try:
        db = get_database()
        settings_collection = db.site_settings
        
        # Find existing settings
        existing_settings = await settings_collection.find_one({"isActive": True})
        
        if not existing_settings:
            # Create new settings if none exist
            new_settings = SiteSettings(**settings_data.dict(exclude_unset=True))
            await settings_collection.insert_one(new_settings.dict(by_alias=True))
            return new_settings
        else:
            # Update existing settings
            update_data = settings_data.dict(exclude_unset=True)
            
            await settings_collection.update_one(
                {"_id": existing_settings["_id"]},
                {"$set": update_data}
            )
            
            # Return updated settings
            updated_settings = await settings_collection.find_one({"_id": existing_settings["_id"]})
            return SiteSettings(**updated_settings)
        
    except Exception as e:
        logger.error(f"Update site settings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update site settings")

@api_router.post("/admin/site-settings/reset")
async def reset_site_settings(current_admin: dict = Depends(admin_required)):
    """Reset site settings to defaults (admin)."""
    try:
        db = get_database()
        settings_collection = db.site_settings
        
        # Delete existing settings
        await settings_collection.delete_many({"isActive": True})
        
        # Create new default settings
        default_settings = SiteSettings()
        await settings_collection.insert_one(default_settings.dict(by_alias=True))
        
        return {"message": "Site settings reset to defaults", "settings": default_settings}
        
    except Exception as e:
        logger.error(f"Reset site settings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to reset site settings")

# Team Management endpoints
@api_router.post("/team/login", response_model=TokenResponse)
async def team_login(login_data: TeamLogin):
    """Team member login endpoint."""
    try:
        db = get_database()
        team_collection = db.team_members
        
        # Find team member by username
        team_member = await team_collection.find_one({"username": login_data.username, "isActive": True})
        
        if not team_member or not AuthManager.verify_password(login_data.password, team_member["passwordHash"]):
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )
        
        # Update last login
        await team_collection.update_one(
            {"_id": team_member["_id"]},
            {"$set": {"lastLogin": datetime.utcnow()}}
        )
        
        # Create access token
        access_token = AuthManager.create_access_token(
            data={"sub": team_member["username"], "user_id": str(team_member["_id"]), "role": team_member["role"]}
        )
        
        return TokenResponse(access_token=access_token)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Team login error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/admin/team", response_model=List[TeamMember])
async def get_team_members(current_admin: dict = Depends(admin_required)):
    """Get all team members (admin)."""
    try:
        db = get_database()
        team_collection = db.team_members
        
        team_cursor = team_collection.find({}).sort("createdAt", -1)
        team_members = await team_cursor.to_list(length=1000)
        
        return [TeamMember(**member) for member in team_members]
        
    except Exception as e:
        logger.error(f"Get team members error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch team members")

@api_router.post("/admin/team", response_model=TeamMember)
async def create_team_member(team_data: TeamMemberCreate, current_admin: dict = Depends(admin_required)):
    """Create new team member (admin)."""
    try:
        db = get_database()
        team_collection = db.team_members
        
        # Check if username or email already exists
        existing_member = await team_collection.find_one({
            "$or": [{"username": team_data.username}, {"email": team_data.email}]
        })
        
        if existing_member:
            raise HTTPException(status_code=400, detail="Username or email already exists")
        
        # Create team member with hashed password
        team_member = TeamMember(
            **team_data.dict(exclude={'password'}),
            passwordHash=AuthManager.get_password_hash(team_data.password)
        )
        
        result = await team_collection.insert_one(team_member.dict(by_alias=True))
        team_member.id = str(result.inserted_id)
        
        return team_member
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create team member error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create team member")

@api_router.put("/admin/team/{member_id}", response_model=TeamMember)
async def update_team_member(member_id: str, team_data: TeamMemberUpdate, current_admin: dict = Depends(admin_required)):
    """Update team member (admin)."""
    try:
        db = get_database()
        team_collection = db.team_members
        
        # Check if member exists
        existing_member = await team_collection.find_one({"_id": member_id})
        if not existing_member:
            raise HTTPException(status_code=404, detail="Team member not found")
        
        # Update member
        update_data = {k: v for k, v in team_data.dict().items() if v is not None}
        
        await team_collection.update_one(
            {"_id": member_id},
            {"$set": update_data}
        )
        
        # Return updated member
        updated_member = await team_collection.find_one({"_id": member_id})
        return TeamMember(**updated_member)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update team member error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update team member")

@api_router.delete("/admin/team/{member_id}")
async def delete_team_member(member_id: str, current_admin: dict = Depends(admin_required)):
    """Delete team member (admin)."""
    try:
        db = get_database()
        team_collection = db.team_members
        
        result = await team_collection.delete_one({"_id": member_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Team member not found")
        
        return {"message": "Team member deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete team member error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete team member")

@api_router.post("/admin/team/{member_id}/change-password")
async def admin_change_team_password(
    member_id: str, 
    new_password: str = Form(...),
    current_admin: dict = Depends(admin_required)
):
    """Change team member password (admin)."""
    try:
        db = get_database()
        team_collection = db.team_members
        
        # Check if member exists
        existing_member = await team_collection.find_one({"_id": member_id})
        if not existing_member:
            raise HTTPException(status_code=404, detail="Team member not found")
        
        # Hash new password and update
        new_password_hash = AuthManager.get_password_hash(new_password)
        
        await team_collection.update_one(
            {"_id": member_id},
            {"$set": {"passwordHash": new_password_hash, "updatedAt": datetime.utcnow()}}
        )
        
        return {"message": "Password updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Change team password error: {e}")
        raise HTTPException(status_code=500, detail="Failed to change password")

# Popup/Announcement endpoints
@api_router.get("/popups", response_model=List[Popup])
async def get_active_popups():
    """Get active popups (public)."""
    try:
        db = get_database()
        popup_collection = db.popups
        
        # Get active popups that haven't expired
        current_time = datetime.utcnow()
        popup_cursor = popup_collection.find({
            "isActive": True,
            "startDate": {"$lte": current_time},
            "$or": [
                {"endDate": None},
                {"endDate": {"$gte": current_time}}
            ]
        }).sort("createdAt", -1)
        
        popups = await popup_cursor.to_list(length=100)
        return [Popup(**popup) for popup in popups]
        
    except Exception as e:
        logger.error(f"Get popups error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch popups")

@api_router.get("/admin/popups", response_model=List[Popup])
async def admin_get_popups(current_admin: dict = Depends(admin_required)):
    """Get all popups (admin)."""
    try:
        db = get_database()
        popup_collection = db.popups
        
        popup_cursor = popup_collection.find({}).sort("createdAt", -1)
        popups = await popup_cursor.to_list(length=1000)
        
        return [Popup(**popup) for popup in popups]
        
    except Exception as e:
        logger.error(f"Admin get popups error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch popups")

@api_router.post("/admin/popups", response_model=Popup)
async def create_popup(popup_data: PopupCreate, current_admin: dict = Depends(admin_required)):
    """Create new popup (admin)."""
    try:
        db = get_database()
        popup_collection = db.popups
        
        popup = Popup(**popup_data.dict())
        
        result = await popup_collection.insert_one(popup.dict(by_alias=True))
        popup.id = str(result.inserted_id)
        
        return popup
        
    except Exception as e:
        logger.error(f"Create popup error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create popup")

@api_router.put("/admin/popups/{popup_id}", response_model=Popup)
async def update_popup(popup_id: str, popup_data: PopupUpdate, current_admin: dict = Depends(admin_required)):
    """Update popup (admin)."""
    try:
        db = get_database()
        popup_collection = db.popups
        
        # Check if popup exists
        existing_popup = await popup_collection.find_one({"_id": popup_id})
        if not existing_popup:
            raise HTTPException(status_code=404, detail="Popup not found")
        
        # Update popup
        update_data = {k: v for k, v in popup_data.dict().items() if v is not None}
        
        await popup_collection.update_one(
            {"_id": popup_id},
            {"$set": update_data}
        )
        
        # Return updated popup
        updated_popup = await popup_collection.find_one({"_id": popup_id})
        return Popup(**updated_popup)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update popup error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update popup")

@api_router.delete("/admin/popups/{popup_id}")
async def delete_popup(popup_id: str, current_admin: dict = Depends(admin_required)):
    """Delete popup (admin)."""
    try:
        db = get_database()
        popup_collection = db.popups
        
        result = await popup_collection.delete_one({"_id": popup_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Popup not found")
        
        return {"message": "Popup deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete popup error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete popup")

# Enhanced CRM endpoints
@api_router.get("/admin/clients", response_model=List[Client])
async def get_clients(current_user: dict = Depends(team_member_required)):
    """Get all clients (team members)."""
    try:
        db = get_database()
        client_collection = db.clients
        
        client_cursor = client_collection.find({}).sort("createdAt", -1)
        clients = await client_cursor.to_list(length=1000)
        
        return [Client(**client) for client in clients]
        
    except Exception as e:
        logger.error(f"Get clients error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch clients")

@api_router.post("/admin/clients", response_model=Client)
async def create_client(client_data: ClientCreate, current_user: dict = Depends(team_member_required)):
    """Create new client (team members)."""
    try:
        db = get_database()
        client_collection = db.clients
        
        # Check if email already exists
        existing_client = await client_collection.find_one({"email": client_data.email})
        if existing_client:
            raise HTTPException(status_code=400, detail="Client with this email already exists")
        
        client = Client(
            **client_data.dict(),
            assignedTo=current_user.get("user_id")
        )
        
        result = await client_collection.insert_one(client.dict(by_alias=True))
        client.id = str(result.inserted_id)
        
        return client
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create client error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create client")

@api_router.put("/admin/clients/{client_id}", response_model=Client)
async def update_client(client_id: str, client_data: ClientUpdate, current_user: dict = Depends(team_member_required)):
    """Update client (team members)."""
    try:
        db = get_database()
        client_collection = db.clients
        
        # Check if client exists
        existing_client = await client_collection.find_one({"_id": client_id})
        if not existing_client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        # Update client
        update_data = {k: v for k, v in client_data.dict().items() if v is not None}
        
        await client_collection.update_one(
            {"_id": client_id},
            {"$set": update_data}
        )
        
        # Return updated client
        updated_client = await client_collection.find_one({"_id": client_id})
        return Client(**updated_client)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update client error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update client")

@api_router.delete("/admin/clients/{client_id}")
async def delete_client(client_id: str, current_user: dict = Depends(team_member_required)):
    """Delete client (team members)."""
    try:
        db = get_database()
        client_collection = db.clients
        
        result = await client_collection.delete_one({"_id": client_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Client not found")
        
        return {"message": "Client deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete client error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete client")

@api_router.post("/admin/clients/{client_id}/communication", response_model=Client)
async def add_client_communication(
    client_id: str, 
    communication_data: CommunicationCreate, 
    current_user: dict = Depends(team_member_required)
):
    """Add communication to client (team members)."""
    try:
        db = get_database()
        client_collection = db.clients
        
        # Check if client exists
        existing_client = await client_collection.find_one({"_id": client_id})
        if not existing_client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        # Create communication record
        communication = Communication(
            **communication_data.dict(),
            completedAt=datetime.utcnow() if communication_data.scheduledFor is None else None
        )
        
        # Update client with new communication and last contact time
        await client_collection.update_one(
            {"_id": client_id},
            {
                "$push": {"communicationHistory": communication.dict()},
                "$set": {"lastContact": datetime.utcnow(), "updatedAt": datetime.utcnow()}
            }
        )
        
        # Return updated client
        updated_client = await client_collection.find_one({"_id": client_id})
        return Client(**updated_client)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Add communication error: {e}")
        raise HTTPException(status_code=500, detail="Failed to add communication")

@api_router.post("/admin/clients/{client_id}/followup", response_model=Client)
async def add_client_followup(
    client_id: str, 
    followup_data: FollowUpCreate, 
    current_user: dict = Depends(team_member_required)
):
    """Add follow-up to client (team members)."""
    try:
        db = get_database()
        client_collection = db.clients
        
        # Check if client exists
        existing_client = await client_collection.find_one({"_id": client_id})
        if not existing_client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        # Create follow-up record
        followup = FollowUp(
            **followup_data.dict(),
            assignedTo=followup_data.assignedTo or current_user.get("user_id")
        )
        
        # Update client with new follow-up
        await client_collection.update_one(
            {"_id": client_id},
            {
                "$push": {"followUps": followup.dict()},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        # Return updated client
        updated_client = await client_collection.find_one({"_id": client_id})
        return Client(**updated_client)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Add follow-up error: {e}")
        raise HTTPException(status_code=500, detail="Failed to add follow-up")

@api_router.post("/admin/clients/{client_id}/review", response_model=Client)
async def add_client_review(
    client_id: str, 
    review_data: ReviewCreate, 
    current_user: dict = Depends(team_member_required)
):
    """Add review from client (team members)."""
    try:
        db = get_database()
        client_collection = db.clients
        
        # Check if client exists
        existing_client = await client_collection.find_one({"_id": client_id})
        if not existing_client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        # Create review record
        review = Review(**review_data.dict())
        
        # Update client with new review
        await client_collection.update_one(
            {"_id": client_id},
            {
                "$push": {"reviews": review.dict()},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        # Return updated client
        updated_client = await client_collection.find_one({"_id": client_id})
        return Client(**updated_client)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Add review error: {e}")
        raise HTTPException(status_code=500, detail="Failed to add review")

# Blog Management endpoints
@api_router.get("/blog/posts", response_model=List[BlogPost])
async def get_published_blog_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    limit: int = Query(default=20, le=100)
):
    """Get published blog posts (public)."""
    try:
        db = get_database()
        blog_collection = db.blog_posts
        
        # Build query
        query = {"status": "published"}
        if category:
            query["category"] = category
        if tag:
            query["tags"] = {"$in": [tag]}
        
        blog_cursor = blog_collection.find(query).sort("publishedAt", -1).limit(limit)
        blogs = await blog_cursor.to_list(length=limit)
        
        return [BlogPost(**blog) for blog in blogs]
        
    except Exception as e:
        logger.error(f"Get blog posts error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blog posts")

@api_router.get("/blog/posts/{slug}", response_model=BlogPost)
async def get_blog_post_by_slug(slug: str):
    """Get blog post by slug (public)."""
    try:
        db = get_database()
        blog_collection = db.blog_posts
        
        blog = await blog_collection.find_one({"slug": slug, "status": "published"})
        
        if not blog:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Increment view count
        await blog_collection.update_one(
            {"_id": blog["_id"]},
            {"$inc": {"views": 1}}
        )
        
        return BlogPost(**blog)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get blog post error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blog post")

@api_router.get("/admin/blog/posts", response_model=List[BlogPost])
async def admin_get_blog_posts(current_user: dict = Depends(team_member_required)):
    """Get all blog posts (team members)."""
    try:
        db = get_database()
        blog_collection = db.blog_posts
        
        blog_cursor = blog_collection.find({}).sort("createdAt", -1)
        blogs = await blog_cursor.to_list(length=1000)
        
        return [BlogPost(**blog) for blog in blogs]
        
    except Exception as e:
        logger.error(f"Admin get blog posts error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blog posts")

@api_router.post("/admin/blog/posts", response_model=BlogPost)
async def create_blog_post(blog_data: BlogPostCreate, current_user: dict = Depends(team_member_required)):
    """Create new blog post (team members)."""
    try:
        db = get_database()
        blog_collection = db.blog_posts
        
        # Check if slug already exists
        slug = blog_data.title.lower().replace(" ", "-").replace("'", "")[:50]
        existing_blog = await blog_collection.find_one({"slug": slug})
        if existing_blog:
            # Add timestamp to make slug unique
            slug = f"{slug}-{int(datetime.utcnow().timestamp())}"
        
        blog = BlogPost(
            **blog_data.dict(),
            slug=slug,
            authorId=current_user.get("user_id")
        )
        
        result = await blog_collection.insert_one(blog.dict(by_alias=True))
        blog.id = str(result.inserted_id)
        
        return blog
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create blog post error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create blog post")

@api_router.put("/admin/blog/posts/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, blog_data: BlogPostUpdate, current_user: dict = Depends(team_member_required)):
    """Update blog post (team members)."""
    try:
        db = get_database()
        blog_collection = db.blog_posts
        
        # Check if blog exists
        existing_blog = await blog_collection.find_one({"_id": post_id})
        if not existing_blog:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Handle status changes
        update_data = {k: v for k, v in blog_data.dict().items() if v is not None}
        
        if "status" in update_data:
            if update_data["status"] == "published" and not existing_blog.get("publishedAt"):
                update_data["publishedAt"] = datetime.utcnow()
            elif update_data["status"] == "approved":
                update_data["approvedBy"] = current_user.get("user_id")
        
        await blog_collection.update_one(
            {"_id": post_id},
            {"$set": update_data}
        )
        
        # Return updated blog
        updated_blog = await blog_collection.find_one({"_id": post_id})
        return BlogPost(**updated_blog)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update blog post error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update blog post")

@api_router.delete("/admin/blog/posts/{post_id}")
async def delete_blog_post(post_id: str, current_user: dict = Depends(admin_required)):
    """Delete blog post (admin only)."""
    try:
        db = get_database()
        blog_collection = db.blog_posts
        
        result = await blog_collection.delete_one({"_id": post_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        return {"message": "Blog post deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete blog post error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete blog post")

# AI Blog Generation endpoints
@api_router.post("/admin/blog/generate", response_model=BlogPost)
async def generate_ai_blog_post(request_data: AIBlogRequest, current_user: dict = Depends(team_member_required)):
    """Generate blog post using AI (team members)."""
    try:
        from ai_blog_generator import ai_blog_generator
        
        # Generate blog post
        blog_data = await ai_blog_generator.generate_blog_post(
            topic=request_data.topic,
            category=request_data.category.value,
            keywords=request_data.keywords,
            target_length=request_data.targetLength,
            tone=request_data.tone,
            focus_areas=request_data.focusAreas
        )
        
        # Create blog post in database
        db = get_database()
        blog_collection = db.blog_posts
        
        # Ensure unique slug
        base_slug = blog_data["slug"]
        slug = base_slug
        counter = 1
        while await blog_collection.find_one({"slug": slug}):
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        blog = BlogPost(
            **blog_data,
            slug=slug,
            status=BlogStatus.pending_approval,
            authorId=current_user.get("user_id"),
            isAIGenerated=True
        )
        
        result = await blog_collection.insert_one(blog.dict(by_alias=True))
        blog.id = str(result.inserted_id)
        
        return blog
        
    except Exception as e:
        logger.error(f"Generate AI blog error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate blog post: {str(e)}")

@api_router.get("/admin/blog/topics/{category}")
async def get_topic_suggestions(category: str, count: int = Query(default=5, le=20), current_user: dict = Depends(team_member_required)):
    """Get AI-generated topic suggestions (team members)."""
    try:
        from ai_blog_generator import ai_blog_generator
        
        topics = await ai_blog_generator.generate_topic_suggestions(category, count)
        return {"topics": topics}
        
    except Exception as e:
        logger.error(f"Get topic suggestions error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate topic suggestions")

@api_router.get("/admin/blog/settings", response_model=BlogGenerationSettings)
async def get_blog_generation_settings(current_admin: dict = Depends(admin_required)):
    """Get blog generation settings (admin)."""
    try:
        db = get_database()
        settings_collection = db.blog_generation_settings
        
        settings = await settings_collection.find_one({"_id": {"$exists": True}})
        
        if not settings:
            # Create default settings
            default_settings = BlogGenerationSettings()
            await settings_collection.insert_one(default_settings.dict(by_alias=True))
            return default_settings
        
        return BlogGenerationSettings(**settings)
        
    except Exception as e:
        logger.error(f"Get blog settings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch blog settings")

@api_router.put("/admin/blog/settings", response_model=BlogGenerationSettings)
async def update_blog_generation_settings(settings_data: dict, current_admin: dict = Depends(admin_required)):
    """Update blog generation settings (admin)."""
    try:
        db = get_database()
        settings_collection = db.blog_generation_settings
        
        # Find existing settings
        existing_settings = await settings_collection.find_one({"_id": {"$exists": True}})
        
        update_data = {k: v for k, v in settings_data.items() if k != "_id"}
        update_data["updatedAt"] = datetime.utcnow()
        
        if existing_settings:
            await settings_collection.update_one(
                {"_id": existing_settings["_id"]},
                {"$set": update_data}
            )
            updated_settings = await settings_collection.find_one({"_id": existing_settings["_id"]})
        else:
            new_settings = BlogGenerationSettings(**update_data)
            await settings_collection.insert_one(new_settings.dict(by_alias=True))
            updated_settings = new_settings.dict(by_alias=True)
        
        return BlogGenerationSettings(**updated_settings)
        
    except Exception as e:
        logger.error(f"Update blog settings error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update blog settings")

@api_router.post("/admin/blog/test-ai")
async def test_ai_connection(current_admin: dict = Depends(admin_required)):
    """Test AI connection (admin)."""
    try:
        from ai_blog_generator import ai_blog_generator
        
        is_working = await ai_blog_generator.test_ai_connection()
        
        return {
            "status": "success" if is_working else "failed",
            "message": "AI connection is working properly" if is_working else "AI connection test failed",
            "timestamp": datetime.utcnow()
        }
        
    except Exception as e:
        logger.error(f"AI connection test error: {e}")
        return {
            "status": "error",
            "message": f"AI connection test error: {str(e)}",
            "timestamp": datetime.utcnow()
        }

# ============================================================================
# VEHICLE MANAGEMENT ENDPOINTS
# ============================================================================

@api_router.get("/vehicles", tags=["vehicles"])
async def get_vehicles(
    active_only: bool = Query(True, description="Return only active vehicles")
):
    """Get all vehicles (public endpoint)."""
    try:
        db = get_database()
        filter_criteria = {}
        if active_only:
            filter_criteria["isActive"] = True
        
        vehicles_cursor = db.vehicles.find(filter_criteria)
        vehicles = await vehicles_cursor.sort("sortOrder", 1).to_list(length=100)
        
        # Convert ObjectId to string for each vehicle
        for vehicle in vehicles:
            vehicle["_id"] = str(vehicle["_id"])
        
        return {"status": "success", "data": vehicles}
        
    except Exception as e:
        logger.error(f"Get vehicles error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/vehicles", tags=["admin-vehicles"])
async def get_admin_vehicles(
    current_admin: dict = Depends(admin_required)
):
    """Get all vehicles for admin management."""
    try:
        db = get_database()
        vehicles_cursor = db.vehicles.find({})
        vehicles = await vehicles_cursor.sort("sortOrder", 1).to_list(length=100)
        
        # Convert ObjectId to string for each vehicle
        for vehicle in vehicles:
            vehicle["_id"] = str(vehicle["_id"])
        
        return {"status": "success", "data": vehicles}
        
    except Exception as e:
        logger.error(f"Get admin vehicles error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/admin/vehicles", tags=["admin-vehicles"])
async def create_vehicle(
    vehicle_data: VehicleCreate,
    current_admin: dict = Depends(admin_required)
):
    """Create a new vehicle (admin)."""
    try:
        db = get_database()
        
        # Create Vehicle instance to get proper UUID ID
        vehicle = Vehicle(**vehicle_data.dict())
        vehicle_dict = vehicle.dict(by_alias=True)
        
        result = await db.vehicles.insert_one(vehicle_dict)
        
        # Get the created vehicle
        created_vehicle = await db.vehicles.find_one({"_id": vehicle.id})
        created_vehicle["_id"] = str(created_vehicle["_id"])
        
        return {
            "status": "success",
            "message": "Vehicle created successfully",
            "data": created_vehicle
        }
        
    except Exception as e:
        logger.error(f"Create vehicle error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/admin/vehicles/{vehicle_id}", tags=["admin-vehicles"])
async def update_vehicle(
    vehicle_id: str,
    vehicle_data: VehicleUpdate,
    current_admin: dict = Depends(admin_required)
):
    """Update a vehicle (admin)."""
    try:
        db = get_database()
        update_data = {k: v for k, v in vehicle_data.dict().items() if v is not None}
        update_data["updatedAt"] = datetime.utcnow()
        
        result = await db.vehicles.update_one(
            {"_id": vehicle_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        
        # Get the updated vehicle
        updated_vehicle = await db.vehicles.find_one({"_id": vehicle_id})
        updated_vehicle["_id"] = str(updated_vehicle["_id"])
        
        return {
            "status": "success",
            "message": "Vehicle updated successfully",
            "data": updated_vehicle
        }
        
    except Exception as e:
        logger.error(f"Update vehicle error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/admin/vehicles/{vehicle_id}", tags=["admin-vehicles"])
async def delete_vehicle(
    vehicle_id: str,
    current_admin: dict = Depends(admin_required)
):
    """Delete a vehicle (admin)."""
    try:
        db = get_database()
        result = await db.vehicles.delete_one({"_id": vehicle_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        
        return {
            "status": "success",
            "message": "Vehicle deleted successfully"
        }
        
    except Exception as e:
        logger.error(f"Delete vehicle error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# WHATSAPP CRM INTEGRATION ENDPOINTS
# ============================================================================

@api_router.get("/admin/whatsapp/config", tags=["whatsapp-crm"])
async def get_whatsapp_config(
    current_admin: dict = Depends(admin_required)
):
    """Get WhatsApp configuration (admin)."""
    try:
        db = get_database()
        config = await db.whatsapp_config.find_one({})
        
        if not config:
            # Create default config
            default_config = WhatsAppConfig().dict()
            result = await db.whatsapp_config.insert_one(default_config)
            config = await db.whatsapp_config.find_one({"_id": result.inserted_id})
        
        config["_id"] = str(config["_id"])
        # Don't expose sensitive data
        if "apiToken" in config:
            config["apiToken"] = "***hidden***" if config["apiToken"] else None
        
        return {"status": "success", "data": config}
        
    except Exception as e:
        logger.error(f"Get WhatsApp config error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/admin/whatsapp/config", tags=["whatsapp-crm"])
async def update_whatsapp_config(
    config_data: dict,
    current_admin: dict = Depends(admin_required)
):
    """Update WhatsApp configuration (admin)."""
    try:
        db = get_database()
        config_data["updatedAt"] = datetime.utcnow()
        
        # Update or create config
        result = await db.whatsapp_config.update_one(
            {},
            {"$set": config_data},
            upsert=True
        )
        
        return {
            "status": "success",
            "message": "WhatsApp configuration updated successfully"
        }
        
    except Exception as e:
        logger.error(f"Update WhatsApp config error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/whatsapp/templates", tags=["whatsapp-crm"])
async def get_whatsapp_templates(
    current_admin: dict = Depends(admin_required)
):
    """Get all WhatsApp message templates (admin)."""
    try:
        db = get_database()
        templates_cursor = db.whatsapp_templates.find({"isActive": True})
        templates = await templates_cursor.to_list(length=100)
        
        # Convert ObjectId to string
        for template in templates:
            template["_id"] = str(template["_id"])
        
        return {"status": "success", "data": templates}
        
    except Exception as e:
        logger.error(f"Get WhatsApp templates error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/admin/whatsapp/templates", tags=["whatsapp-crm"])
async def create_whatsapp_template(
    template_data: WhatsAppTemplate,
    current_admin: dict = Depends(admin_required)
):
    """Create a new WhatsApp message template (admin)."""
    try:
        db = get_database()
        template_dict = template_data.dict()
        template_dict["createdAt"] = datetime.utcnow()
        template_dict["updatedAt"] = datetime.utcnow()
        
        result = await db.whatsapp_templates.insert_one(template_dict)
        
        # Get the created template
        created_template = await db.whatsapp_templates.find_one({"_id": result.inserted_id})
        created_template["_id"] = str(created_template["_id"])
        
        return {
            "status": "success",
            "message": "WhatsApp template created successfully",
            "data": created_template
        }
        
    except Exception as e:
        logger.error(f"Create WhatsApp template error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/admin/whatsapp/send", tags=["whatsapp-crm"])
async def send_whatsapp_message(
    message_data: dict,
    current_admin: dict = Depends(admin_required)
):
    """Send WhatsApp message to client (admin)."""
    try:
        db = get_database()
        client_id = message_data.get("clientId")
        phone_number = message_data.get("phoneNumber")
        message = message_data.get("message")
        template_name = message_data.get("templateName")
        
        if not phone_number or not message:
            raise HTTPException(status_code=400, detail="Phone number and message are required")
        
        # Get WhatsApp config
        config = await db.whatsapp_config.find_one({})
        if not config or not config.get("isEnabled"):
            raise HTTPException(status_code=400, detail="WhatsApp integration is not enabled")
        
        # Create message record
        whatsapp_message = WhatsAppMessage(
            clientId=client_id,
            phoneNumber=phone_number,
            message=message,
            direction="outbound",
            templateName=template_name,
            sentAt=datetime.utcnow()
        )
        
        message_dict = whatsapp_message.dict()
        result = await db.whatsapp_messages.insert_one(message_dict)
        
        # TODO: Integrate with actual WhatsApp API here
        # For now, we'll just log the message
        logger.info(f"WhatsApp message to {phone_number}: {message}")
        
        # Update client communication history if clientId provided
        if client_id:
            communication = Communication(
                type=CommunicationType.whatsapp,
                direction="outbound",
                message=message,
                completedAt=datetime.utcnow()
            )
            
            await db.clients.update_one(
                {"_id": client_id},
                {
                    "$push": {"communicationHistory": communication.dict()},
                    "$set": {"lastContact": datetime.utcnow()}
                }
            )
        
        return {
            "status": "success",
            "message": "WhatsApp message sent successfully",
            "messageId": str(result.inserted_id)
        }
        
    except Exception as e:
        logger.error(f"Send WhatsApp message error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/admin/whatsapp/messages", tags=["whatsapp-crm"])
async def get_whatsapp_messages(
    client_id: Optional[str] = Query(None, description="Filter by client ID"),
    limit: int = Query(50, description="Number of messages to return"),
    current_admin: dict = Depends(admin_required)
):
    """Get WhatsApp messages (admin)."""
    try:
        db = get_database()
        filter_criteria = {}
        if client_id:
            filter_criteria["clientId"] = client_id
        
        messages_cursor = db.whatsapp_messages.find(filter_criteria)
        messages = await messages_cursor.sort("createdAt", -1).to_list(length=limit)
        
        # Convert ObjectId to string
        for message in messages:
            message["_id"] = str(message["_id"])
        
        return {"status": "success", "data": messages}
        
    except Exception as e:
        logger.error(f"Get WhatsApp messages error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include router in app
app.include_router(api_router)

# ============================================================================
# IMAGE UPLOAD ENDPOINTS
# ============================================================================

@api_router.post("/admin/upload-image", tags=["admin-images"])
async def upload_image(
    file: UploadFile = File(...),
    category: str = Form("general"),
    current_admin: dict = Depends(admin_required)
):
    """Upload image for admin use (vehicles, packages, etc.)"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Validate file size (max 5MB)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > 5 * 1024 * 1024:  # 5MB
            raise HTTPException(status_code=400, detail="File size must be less than 5MB")
        
        # Create uploads directory if it doesn't exist
        upload_dir = Path("uploads") / category
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = upload_dir / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        # Return file URL
        file_url = f"/uploads/{category}/{unique_filename}"
        
        logger.info(f"Image uploaded successfully: {file_url}")
        
        return {
            "status": "success",
            "message": "Image uploaded successfully",
            "url": file_url,
            "filename": unique_filename
        }
        
    except Exception as e:
        logger.error(f"Image upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to GMB Travels API"}

# Serve React frontend
from fastapi.responses import FileResponse

# Mount frontend build/static files
if os.path.exists("build"):
    app.mount("/", StaticFiles(directory="build", html=True), name="frontend")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve React frontend for any non-API route"""
        index_path = os.path.join("build", "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend build not found"}

