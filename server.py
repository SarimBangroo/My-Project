from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os

app = FastAPI(title="GMB Travels API")

# CORS
origins = [
    "http://localhost:3000",
    "https://my-project.vercel.app",
    "https://www.gmbtourandtravels.com",
    "https://gmbtourandtravels.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URI)
db = client.get_database("gmb")

@app.on_event("startup")
async def startup_event():
    print("✅ Connected to MongoDB")

@app.on_event("shutdown")
async def shutdown_event():
    client.close()
    print("❌ Disconnected from MongoDB")

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# ------------ MODELS ------------
class SiteSettings(BaseModel):
    company_name: str
    tagline: str
    logo_url: str

class TeamMember(BaseModel):
    id: int
    name: str
    role: str
    photo_url: str

class Popup(BaseModel):
    id: int
    title: str
    message: str
    is_active: bool

# ------------ DUMMY DATA ------------
site_settings = SiteSettings(
    company_name="G.M.B Travels Kashmir",
    tagline="Discover Paradise on Earth",
    logo_url="https://www.gmbtourandtravels.com/logo.jpg"
)

dummy_team = [
    {"id": 1, "name": "John Doe", "role": "CEO", "photo_url": "https://via.placeholder.com/150"},
    {"id": 2, "name": "Jane Smith", "role": "Manager", "photo_url": "https://via.placeholder.com/150"},
]

dummy_popups = [
    {"id": 1, "title": "Special Offer", "message": "Get 10% off on bookings!", "is_active": True}
]

# ------------ PUBLIC ROUTES (for website) ------------
@app.get("/api/site-settings")
async def get_public_site_settings():
    return site_settings

@app.get("/api/team", response_model=List[TeamMember])
async def get_public_team():
    return dummy_team

@app.get("/api/popups", response_model=List[Popup])
async def get_public_popups():
    return dummy_popups

# ------------ ADMIN ROUTES (for dashboard) ------------
@app.get("/api/admin/site-settings")
async def get_admin_site_settings():
    return site_settings

@app.put("/api/admin/site-settings")
async def update_admin_site_settings(settings: SiteSettings):
    global site_settings
    site_settings = settings
    return {"message": "Site settings updated successfully", "data": site_settings}

@app.get("/api/admin/team", response_model=List[TeamMember])
async def get_admin_team():
    return dummy_team

@app.post("/api/admin/team", response_model=TeamMember)
async def add_admin_team_member(member: TeamMember):
    dummy_team.append(member.dict())
    return member

@app.get("/api/admin/popups", response_model=List[Popup])
async def get_admin_popups():
    return dummy_popups

@app.post("/api/admin/popups", response_model=Popup)
async def add_admin_popup(popup: Popup):
    dummy_popups.append(popup.dict())
    return popup
