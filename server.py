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



