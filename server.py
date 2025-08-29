from fastapi import FastAPI, HTTPException, Depends
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
    allow_origins=origins,
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

class Blog(BaseModel):
    title: str
    content: str
    author: str
    image_url: Optional[str] = None

class Vehicle(BaseModel):
    name: str
    description: str
    price_per_day: float
    image_url: Optional[str] = None

# Helper to convert Mongo ObjectId -> string
def serialize_doc(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc


# ------------  SITE SETTINGS ------------

@app.get("/api/site-settings")
async def get_public_site_settings():
    settings = await db.site_settings.find_one({})
    if not settings:
        return {"company_name": "", "tagline": "", "logo_url": ""}
    settings["_id"] = str(settings["_id"])
    return settings

@app.get("/api/admin/site-settings")
async def get_admin_site_settings():
    return await get_public_site_settings()

@app.put("/api/admin/site-settings")
async def update_admin_site_settings(settings: SiteSettings):
    await db.site_settings.delete_many({})
    result = await db.site_settings.insert_one(settings.dict())
    return {"message": "Site settings updated successfully", "id": str(result.inserted_id)}


# ---------------- TEAM ----------------
@app.get("/api/team", response_model=List[TeamMember])
async def get_public_team():
    members = []
    async for member in db.team.find({}):
        member["_id"] = str(member["_id"])
        members.append(member)
    return members

@app.get("/api/admin/team", response_model=List[TeamMember])
async def get_admin_team():
    return await get_public_team()

@app.post("/api/admin/team")
async def add_admin_team_member(member: TeamMember):
    result = await db.team.insert_one(member.dict())
    return {"message": "Team member added", "id": str(result.inserted_id)}


# ---------------- POPUPS ----------------

@app.get("/api/popups", response_model=List[Popup])
async def get_public_popups():
    popups = []
    async for popup in db.popups.find({}):
        popup["_id"] = str(popup["_id"])
        popups.append(popup)
    return popups

@app.get("/api/admin/popups", response_model=List[Popup])
async def get_admin_popups():
    return await get_public_popups()

@app.post("/api/admin/popups")
async def add_admin_popup(popup: Popup):
    result = await db.popups.insert_one(popup.dict())
    return {"message": "Popup added", "id": str(result.inserted_id)}

# =========================
# BLOG ROUTES
# =========================
@app.post("/api/admin/blogs")
async def create_blog(blog: Blog):
    blog_dict = blog.dict()
    result = await db.blogs.insert_one(blog_dict)
    return {"id": str(result.inserted_id), **blog_dict}

@app.get("/api/admin/blogs")
async def get_blogs():
    blogs = []
    cursor = db.blogs.find()
    async for doc in cursor:
        blogs.append(serialize_doc(doc))
    return blogs

@app.get("/api/admin/blogs/{blog_id}")
async def get_blog(blog_id: str):
    blog = await db.blogs.find_one({"_id": ObjectId(blog_id)})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return serialize_doc(blog)

@app.put("/api/admin/blogs/{blog_id}")
async def update_blog(blog_id: str, blog: Blog):
    result = await db.blogs.update_one({"_id": ObjectId(blog_id)}, {"$set": blog.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog updated successfully"}

@app.delete("/api/admin/blogs/{blog_id}")
async def delete_blog(blog_id: str):
    result = await db.blogs.delete_one({"_id": ObjectId(blog_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted successfully"}

# =========================
# VEHICLE ROUTES
# =========================
@app.post("/api/admin/vehicles")
async def create_vehicle(vehicle: Vehicle):
    vehicle_dict = vehicle.dict()
    result = await db.vehicles.insert_one(vehicle_dict)
    return {"id": str(result.inserted_id), **vehicle_dict}

@app.get("/api/admin/vehicles")
async def get_vehicles():
    vehicles = []
    cursor = db.vehicles.find()
    async for doc in cursor:
        vehicles.append(serialize_doc(doc))
    return vehicles

@app.get("/api/admin/vehicles/{vehicle_id}")
async def get_vehicle(vehicle_id: str):
    vehicle = await db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return serialize_doc(vehicle)

@app.put("/api/admin/vehicles/{vehicle_id}")
async def update_vehicle(vehicle_id: str, vehicle: Vehicle):
    result = await db.vehicles.update_one({"_id": ObjectId(vehicle_id)}, {"$set": vehicle.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle updated successfully"}

@app.delete("/api/admin/vehicles/{vehicle_id}")
async def delete_vehicle(vehicle_id: str):
    result = await db.vehicles.delete_one({"_id": ObjectId(vehicle_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle deleted successfully"}

