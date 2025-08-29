from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
from bson import ObjectId
import os
import datetime as dt
from pymongo import ReturnDocument

app = FastAPI(title="GMB Travels API")

# -------------------- CORS --------------------
origins = [
    "http://localhost:3000",
    "https://my-project.vercel.app",
    "https://www.gmbtourandtravels.com",
    "https://gmbtourandtravels.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- MongoDB --------------------
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


# -------------------- Health check --------------------
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


# -------------------- MODELS --------------------
class SiteSettingsModel(BaseModel):
    company_name: str
    tagline: str
    logo_url: str


class TeamBase(BaseModel):
    name: str
    role: str
    photo_url: str


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    photo_url: Optional[str] = None


class TeamOut(TeamBase):
    id: str


class PopupBase(BaseModel):
    title: str
    message: str
    is_active: bool


class PopupOut(PopupBase):
    id: str


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


# -------------------- HELPERS --------------------
def oid(id_str: str) -> ObjectId:
    if not ObjectId.is_valid(id_str):
        raise HTTPException(status_code=400, detail="Invalid id")
    return ObjectId(id_str)


def serialize_doc(doc):
    """Convert MongoDB doc to dict with id as str"""
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc


def doc_to_team_out(doc) -> TeamOut:
    return TeamOut(
        id=str(doc["_id"]),
        name=doc.get("name", ""),
        role=doc.get("role", ""),
        photo_url=doc.get("photo_url", ""),
    )


def doc_to_popup_out(doc) -> PopupOut:
    return PopupOut(
        id=str(doc["_id"]),
        title=doc.get("title", ""),
        message=doc.get("message", ""),
        is_active=doc.get("is_active", False),
    )


# -------------------- SITE SETTINGS --------------------
SITE_SETTINGS_ID = "site_settings"


async def ensure_site_settings():
    existing = await db.site_settings.find_one({"_id": SITE_SETTINGS_ID})
    if not existing:
        default_doc = {
            "_id": SITE_SETTINGS_ID,
            "company_name": "G.M.B Travels Kashmir",
            "tagline": "Discover Paradise on Earth",
            "logo_url": "https://www.gmbtourandtravels.com/logo.jpg",
            "updated_at": dt.datetime.utcnow(),
        }
        await db.site_settings.insert_one(default_doc)
        return default_doc
    return existing


@app.get("/api/site-settings", response_model=SiteSettingsModel)
async def get_public_site_settings():
    doc = await ensure_site_settings()
    return SiteSettingsModel(
        company_name=doc["company_name"],
        tagline=doc["tagline"],
        logo_url=doc["logo_url"],
    )


@app.get("/api/admin/site-settings", response_model=SiteSettingsModel)
async def get_admin_site_settings():
    doc = await ensure_site_settings()
    return SiteSettingsModel(
        company_name=doc["company_name"],
        tagline=doc["tagline"],
        logo_url=doc["logo_url"],
    )


@app.put("/api/admin/site-settings", response_model=SiteSettingsModel)
async def update_admin_site_settings(settings: SiteSettingsModel):
    await db.site_settings.update_one(
        {"_id": SITE_SETTINGS_ID},
        {
            "$set": {
                "company_name": settings.company_name,
                "tagline": settings.tagline,
                "logo_url": settings.logo_url,
                "updated_at": dt.datetime.utcnow(),
            }
        },
        upsert=True,
    )
    return settings


# -------------------- TEAM --------------------
@app.get("/api/team", response_model=List[TeamOut])
async def get_public_team():
    out: List[TeamOut] = []
    cursor = db.team.find().sort("created_at", -1)
    async for doc in cursor:
        out.append(doc_to_team_out(doc))
    return out


@app.get("/api/admin/team", response_model=List[TeamOut])
async def get_admin_team():
    out: List[TeamOut] = []
    cursor = db.team.find().sort("created_at", -1)
    async for doc in cursor:
        out.append(doc_to_team_out(doc))
    return out


@app.post("/api/admin/team", response_model=TeamOut)
async def add_admin_team_member(member: TeamCreate):
    payload = member.dict()
    payload["created_at"] = dt.datetime.utcnow()
    res = await db.team.insert_one(payload)
    doc = await db.team.find_one({"_id": res.inserted_id})
    return doc_to_team_out(doc)


@app.put("/api/admin/team/{id}", response_model=TeamOut)
async def update_admin_team_member(id: str, patch: TeamUpdate):
    updates = {k: v for k, v in patch.dict().items() if v is not None}
    updates["updated_at"] = dt.datetime.utcnow()

    res = await db.team.find_one_and_update(
        {"_id": oid(id)},
        {"$set": updates},
        return_document=ReturnDocument.AFTER,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Team member not found")
    return doc_to_team_out(res)


@app.delete("/api/admin/team/{id}")
async def delete_admin_team_member(id: str):
    res = await db.team.delete_one({"_id": oid(id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"status": "success"}


# -------------------- POPUPS --------------------
@app.get("/api/popups", response_model=List[PopupOut])
async def get_public_popups():
    out: List[PopupOut] = []
    cursor = db.popups.find()
    async for doc in cursor:
        out.append(doc_to_popup_out(doc))
    return out


@app.get("/api/admin/popups", response_model=List[PopupOut])
async def get_admin_popups():
    return await get_public_popups()


@app.post("/api/admin/popups", response_model=PopupOut)
async def add_admin_popup(popup: PopupBase):
    payload = popup.dict()
    payload["created_at"] = dt.datetime.utcnow()
    res = await db.popups.insert_one(payload)
    doc = await db.popups.find_one({"_id": res.inserted_id})
    return doc_to_popup_out(doc)


# -------------------- BLOGS --------------------
@app.post("/api/admin/blogs")
async def create_blog(blog: Blog):
    blog_dict = blog.dict()
    blog_dict["created_at"] = dt.datetime.utcnow()
    result = await db.blogs.insert_one(blog_dict)
    return {"id": str(result.inserted_id), **blog_dict}


@app.get("/api/admin/blogs")
async def get_blogs():
    blogs = []
    cursor = db.blogs.find().sort("created_at", -1)
    async for doc in cursor:
        blogs.append(serialize_doc(doc))
    return blogs


@app.get("/api/admin/blogs/{blog_id}")
async def get_blog(blog_id: str):
    blog = await db.blogs.find_one({"_id": oid(blog_id)})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return serialize_doc(blog)


@app.put("/api/admin/blogs/{blog_id}")
async def update_blog(blog_id: str, blog: Blog):
    result = await db.blogs.update_one({"_id": oid(blog_id)}, {"$set": blog.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog updated successfully"}


@app.delete("/api/admin/blogs/{blog_id}")
async def delete_blog(blog_id: str):
    result = await db.blogs.delete_one({"_id": oid(blog_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted successfully"}


# -------------------- VEHICLES --------------------
@app.post("/api/admin/vehicles")
async def create_vehicle(vehicle: Vehicle):
    vehicle_dict = vehicle.dict()
    vehicle_dict["created_at"] = dt.datetime.utcnow()
    result = await db.vehicles.insert_one(vehicle_dict)
    return {"id": str(result.inserted_id), **vehicle_dict}


@app.get("/api/admin/vehicles")
async def get_vehicles():
    vehicles = []
    cursor = db.vehicles.find().sort("created_at", -1)
    async for doc in cursor:
        vehicles.append(serialize_doc(doc))
    return vehicles


@app.get("/api/admin/vehicles/{vehicle_id}")
async def get_vehicle(vehicle_id: str):
    vehicle = await db.vehicles.find_one({"_id": oid(vehicle_id)})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return serialize_doc(vehicle)


@app.put("/api/admin/vehicles/{vehicle_id}")
async def update_vehicle(vehicle_id: str, vehicle: Vehicle):
    result = await db.vehicles.update_one({"_id": oid(vehicle_id)}, {"$set": vehicle.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle updated successfully"}


@app.delete("/api/admin/vehicles/{vehicle_id}")
async def delete_vehicle(vehicle_id: str):
    result = await db.vehicles.delete_one({"_id": oid(vehicle_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"message": "Vehicle deleted successfully"}
