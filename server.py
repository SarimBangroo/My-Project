from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os

app = FastAPI(title="GMB Travels API")

# CORS
origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
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
