from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
from bson import ObjectId
from pymongo import ReturnDocument
from uuid import uuid4
import os
import datetime as dt

app = FastAPI(title="GMB Travels API")

# ---------------- CORS ----------------
# Allow your custom domains + any Vercel preview domain
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://gmbtourandtravels.com",
    "https://www.gmbtourandtravels.com",
    "https://my-project.vercel.app",
    "https://my-project-six-ivory-20.vercel.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in ALLOWED_ORIGINS if o],
    allow_origin_regex=r"https://.*\.vercel\.app",  # allow all vercel.app previews
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Static: uploads ----------------
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
# served at https://<backend>/uploads/<file>
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ---------------- MongoDB ----------------
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/gmb")
client = AsyncIOMotorClient(MONGODB_URI)
# If URI already contains db name it will be used; else default to "gmb"
db_name_from_uri = MONGODB_URI.rsplit("/", 1)[-1].split("?")[0] if "/" in MONGODB_URI else None
db = client.get_database(db_name_from_uri or "gmb")

@app.on_event("startup")
async def startup_event():
    print("✅ Connected to MongoDB")

@app.on_event("shutdown")
async def shutdown_event():
    client.close()
    print("❌ Disconnected from MongoDB")

# ---------------- Health ----------------
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# ---------------- Helpers ----------------
def to_object_id(id_str: str) -> ObjectId:
    if not ObjectId.is_valid(id_str):
        raise HTTPException(status_code=400, detail="Invalid id")
    return ObjectId(id_str)

def with_id(doc: dict) -> dict:
    d = dict(doc)
    d["id"] = str(d.pop("_id"))
    return d

# ---------------- Models ----------------
class SiteSettingsModel(BaseModel):
    company_name: str
    tagline: str
    logo_url: str = Field(..., alias="logoUrl")

    class Config:
        allow_population_by_field_name = True

class TeamBase(BaseModel):
    # we accept camelCase from the UI and store snake_case
    name: str
    role: Optional[str] = None
    photo_url: Optional[str] = Field(None, alias="photoUrl")
    email: Optional[str] = None
    phone: Optional[str] = None
    username: Optional[str] = None
    department: Optional[str] = None
    joining_date: Optional[dt.date] = Field(None, alias="joiningDate")
    is_active: Optional[bool] = Field(True, alias="isActive")

    class Config:
        allow_population_by_field_name = True

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    # all optional so partial edits work
    name: Optional[str] = None
    role: Optional[str] = None
    photo_url: Optional[str] = Field(None, alias="photoUrl")
    email: Optional[str] = None
    phone: Optional[str] = None
    username: Optional[str] = None
    department: Optional[str] = None
    joining_date: Optional[dt.date] = Field(None, alias="joiningDate")
    is_active: Optional[bool] = Field(None, alias="isActive")

    class Config:
        allow_population_by_field_name = True

class TeamOut(TeamBase):
    id: str

class PopupIn(BaseModel):
    title: str
    message: str
    is_active: bool = Field(True, alias="isActive")

    class Config:
        allow_population_by_field_name = True

class PopupOut(PopupIn):
    id: str

class BlogIn(BaseModel):
    title: str
    content: str
    author: Optional[str] = None
    image_url: Optional[str] = Field(None, alias="imageUrl")

    class Config:
        allow_population_by_field_name = True

class BlogOut(BlogIn):
    id: str

class VehicleIn(BaseModel):
    name: str
    description: Optional[str] = None
    price_per_day: Optional[float] = Field(None, alias="pricePerDay")
    image_url: Optional[str] = Field(None, alias="imageUrl")

    class Config:
        allow_population_by_field_name = True

class VehicleOut(VehicleIn):
    id: str

# ---------------- Site Settings ----------------
SITE_SETTINGS_ID = "site_settings"

async def ensure_site_settings():
    doc = await db.site_settings.find_one({"_id": SITE_SETTINGS_ID})
    if not doc:
        doc = {
            "_id": SITE_SETTINGS_ID,
            "company_name": "G.M.B Travels Kashmir",
            "tagline": "Discover Paradise on Earth",
            "logo_url": "https://www.gmbtourandtravels.com/logo.jpg",
            "updated_at": dt.datetime.utcnow(),
        }
        await db.site_settings.insert_one(doc)
    return doc

# public
@app.get("/api/site-settings", response_model=SiteSettingsModel)
async def get_public_site_settings():
    doc = await ensure_site_settings()
    return SiteSettingsModel(
        company_name=doc.get("company_name",""),
        tagline=doc.get("tagline",""),
        logo_url=doc.get("logo_url",""),
    )

# admin read
@app.get("/api/admin/site-settings", response_model=SiteSettingsModel)
async def get_admin_site_settings():
    doc = await ensure_site_settings()
    return SiteSettingsModel(
        company_name=doc.get("company_name",""),
        tagline=doc.get("tagline",""),
        logo_url=doc.get("logo_url",""),
    )

# admin update
@app.put("/api/admin/site-settings", response_model=SiteSettingsModel)
async def update_admin_site_settings(settings: SiteSettingsModel):
    await db.site_settings.update_one(
        {"_id": SITE_SETTINGS_ID},
        {"$set": {
            "company_name": settings.company_name,
            "tagline": settings.tagline,
            "logo_url": settings.logo_url,
            "updated_at": dt.datetime.utcnow(),
        }},
        upsert=True,
    )
    return settings

# optional: admin reset used by UI (no auth yet)
@app.post("/api/admin/site-settings/reset")
async def reset_site_settings():
    await db.site_settings.update_one(
        {"_id": SITE_SETTINGS_ID},
        {"$set": {
            "company_name": "G.M.B Travels Kashmir",
            "tagline": "Discover Paradise on Earth",
            "logo_url": "https://www.gmbtourandtravels.com/logo.jpg",
            "updated_at": dt.datetime.utcnow(),
        }},
        upsert=True,
    )
    return {"status": "ok"}

# ---------------- Team ----------------
# public
@app.get("/api/team", response_model=List[TeamOut])
async def get_public_team():
    out: List[TeamOut] = []
    cursor = db.team.find().sort("created_at", -1)
    async for doc in cursor:
        out.append(TeamOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"}))
    return out

# admin list
@app.get("/api/admin/team", response_model=List[TeamOut])
async def get_admin_team():
    return await get_public_team()

# create
@app.post("/api/admin/team", response_model=TeamOut)
async def create_team_member(member: TeamCreate):
    payload = member.dict(by_alias=False, exclude_none=True)
    payload["created_at"] = dt.datetime.utcnow()
    res = await db.team.insert_one(payload)
    doc = await db.team.find_one({"_id": res.inserted_id})
    return TeamOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"})

# update
@app.put("/api/admin/team/{id}", response_model=TeamOut)
async def update_team_member(id: str, patch: TeamUpdate):
    updates = {k: v for k, v in patch.dict(by_alias=False).items() if v is not None}
    updates["updated_at"] = dt.datetime.utcnow()
    doc = await db.team.find_one_and_update(
        {"_id": to_object_id(id)},
        {"$set": updates},
        return_document=ReturnDocument.AFTER,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Team member not found")
    return TeamOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"})

# delete
@app.delete("/api/admin/team/{id}")
async def delete_team_member(id: str):
    res = await db.team.delete_one({"_id": to_object_id(id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"status": "success"}

# ---------------- Popups ----------------
@app.get("/api/popups", response_model=List[PopupOut])
async def get_public_popups():
    items: List[PopupOut] = []
    async for doc in db.popups.find().sort("created_at", -1):
        items.append(PopupOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"}))
    return items

@app.get("/api/admin/popups", response_model=List[PopupOut])
async def get_admin_popups():
    return await get_public_popups()

@app.post("/api/admin/popups", response_model=PopupOut)
async def add_popup(popup: PopupIn):
    payload = popup.dict(by_alias=False)
    payload["created_at"] = dt.datetime.utcnow()
    res = await db.popups.insert_one(payload)
    doc = await db.popups.find_one({"_id": res.inserted_id})
    return PopupOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"})

@app.delete("/api/admin/popups/{id}")
async def delete_popup(id: str):
    res = await db.popups.delete_one({"_id": to_object_id(id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Popup not found")
    return {"status": "success"}

# ---------------- Blogs ----------------
@app.post("/api/admin/blogs", response_model=BlogOut)
async def create_blog(blog: BlogIn):
    payload = blog.dict(by_alias=False)
    payload["created_at"] = dt.datetime.utcnow()
    res = await db.blogs.insert_one(payload)
    doc = await db.blogs.find_one({"_id": res.inserted_id})
    return BlogOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"})

@app.get("/api/admin/blogs", response_model=List[BlogOut])
async def list_blogs_admin():
    items: List[BlogOut] = []
    async for doc in db.blogs.find().sort("created_at", -1):
        items.append(BlogOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"}))
    return items

@app.get("/api/admin/blogs/{id}", response_model=BlogOut)
async def get_blog_admin(id: str):
    doc = await db.blogs.find_one({"_id": to_object_id(id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    return BlogOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"})

@app.put("/api/admin/blogs/{id}", response_model=BlogOut)
async def update_blog_admin(id: str, blog: BlogIn):
    doc = await db.blogs.find_one_and_update(
        {"_id": to_object_id(id)},
        {"$set": blog.dict(by_alias=False)},
        return_document=ReturnDocument.AFTER,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    return BlogOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"})

@app.delete("/api/admin/blogs/{id}")
async def delete_blog_admin(id: str):
    res = await db.blogs.delete_one({"_id": to_object_id(id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"status": "success"}

# ---------------- Vehicles ----------------
@app.post("/api/admin/vehicles", response_model=VehicleOut)
async def create_vehicle(vehicle: VehicleIn):
    payload = vehicle.dict(by_alias=False)
    payload["created_at"] = dt.datetime.utcnow()
    res = await db.vehicles.insert_one(payload)
    doc = await db.vehicles.find_one({"_id": res.inserted_id})
    return VehicleOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"})

@app.get("/api/admin/vehicles", response_model=List[VehicleOut])
async def list_vehicles():
    items: List[VehicleOut] = []
    async for doc in db.vehicles.find().sort("created_at", -1):
        items.append(VehicleOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"}))
    return items

@app.get("/api/admin/vehicles/{id}", response_model=VehicleOut)
async def get_vehicle(id: str):
    doc = await db.vehicles.find_one({"_id": to_object_id(id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return VehicleOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"})

@app.put("/api/admin/vehicles/{id}", response_model=VehicleOut)
async def update_vehicle(id: str, vehicle: VehicleIn):
    doc = await db.vehicles.find_one_and_update(
        {"_id": to_object_id(id)},
        {"$set": vehicle.dict(by_alias=False)},
        return_document=ReturnDocument.AFTER,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return VehicleOut(id=str(doc["_id"]), **{k: v for k, v in doc.items() if k != "_id"})

@app.delete("/api/admin/vehicles/{id}")
async def delete_vehicle(id: str):
    res = await db.vehicles.delete_one({"_id": to_object_id(id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"status": "success"}

# ---------------- Upload image ----------------
@app.post("/api/admin/upload-image")
async def upload_image(file: UploadFile = File(...), category: Optional[str] = Form(None)):
    # Validate extension
    _, ext = os.path.splitext(file.filename or "")
    ext = ext.lower()
    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    # Unique name
    filename = f"{uuid4().hex}{ext}"
    dest = os.path.join(UPLOAD_DIR, filename)
    # Save
    data = await file.read()
    with open(dest, "wb") as f:
        f.write(data)
    # Return relative URL so UI can prefix with backend base
    return {"status": "success", "url": f"/uploads/{filename}"}
