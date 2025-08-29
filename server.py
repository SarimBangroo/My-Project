from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os

app = FastAPI(title="GMB Travels API")

# CORS
origins = [
    "http://localhost:3000",  # for local dev
    "https://my-project.vercel.app",  # your Vercel frontend
    "https://www.gmbtourandtravels.com",  # your custom domain
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
db = client.get_database("gmb")  # default db name

@app.on_event("startup")
async def startup_event():
    print("✅ Connected to MongoDB")

@app.on_event("shutdown")
async def shutdown_event():
    client.close()
    print("❌ Disconnected from MongoDB")

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Example protected admin route (placeholder)
@app.get("/api/admin/vehicles")
async def list_admin_vehicles():
    return {"status": "success", "data": []}

# ------------ SITE SETTINGS ------------
class SiteSettings(BaseModel):
    company_name: str
    tagline: str
    logo_url: str

# temporary in-memory data
site_settings = SiteSettings(
    company_name="G.M.B Travels Kashmir",
    tagline="Discover Paradise on Earth",
    logo_url="https://www.gmbtourandtravels.com/logo.jpg"
)

@app.get("/api/site-settings")
async def get_site_settings():
    return site_settings

@app.put("/api/site-settings")
async def update_site_settings(settings: SiteSettings):
    global site_settings
    site_settings = settings
    return {"message": "Site settings updated successfully", "data": site_settings}
