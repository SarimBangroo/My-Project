// frontend/src/api.js
import axios from "axios";

// Pick backend URL from .env or fallback to local
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,  // all calls automatically start with /api
  withCredentials: false,     // change to true if you add auth later
});

// ===== TEAM =====
export const fetchTeam = () => api.get("/admin/team");
export const addTeamMember = (data) => api.post("/admin/team", data);
export const updateTeamMember = (id, data) => api.put(`/admin/team/${id}`, data);
export const deleteTeamMember = (id) => api.delete(`/admin/team/${id}`);

// ===== SITE SETTINGS =====
export const fetchSiteSettings = () => api.get("/admin/site-settings");
export const updateSiteSettings = (data) => api.put("/admin/site-settings", data);

// ===== VEHICLES =====
export const fetchVehicles = () => api.get("/admin/vehicles");
export const createVehicle = (data) => api.post("/admin/vehicles", data);
export const updateVehicle = (id, data) => api.put(`/admin/vehicles/${id}`, data);
export const deleteVehicle = (id) => api.delete(`/admin/vehicles/${id}`);

// ===== BLOGS =====
export const fetchBlogs = () => api.get("/admin/blogs");
export const createBlog = (data) => api.post("/admin/blogs", data);
export const updateBlog = (id, data) => api.put(`/admin/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/admin/blogs/${id}`);

// Tour Packages
export const fetchPackages = () => API.get("/packages");  
export const createPackage = (data) => API.post("/admin/packages", data);  
export const updatePackage = (id, data) => API.put(`/admin/packages/${id}`, data);  
export const deletePackage = (id) => API.delete(`/admin/packages/${id}`);

export default api;
