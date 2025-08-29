// frontend/src/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_URL}/api`,  // 🔥 ensures every call has /api prefix
  withCredentials: false,     // change to true if you add auth later
});

// Example: Team
export const fetchTeam = () => API.get("/api/admin/team");
export const addTeamMember = (data) => API.post("/api/admin/team", data);
export const updateTeamMember = (id, data) => API.put(`/api/admin/team/${id}`, data);
export const deleteTeamMember = (id) => API.delete(`/api/admin/team/${id}`);

// Example: Site Settings
export const fetchSiteSettings = () => API.get("/api/admin/site-settings");
export const updateSiteSettings = (data) => API.put("/api/admin/site-settings", data);

// Example: Vehicles
export const fetchVehicles = () => API.get("/api/admin/vehicles");
export const createVehicle = (data) => API.post("/api/admin/vehicles", data);
export const updateVehicle = (id, data) => API.put(`/api/admin/vehicles/${id}`, data);
export const deleteVehicle = (id) => API.delete(`/api/admin/vehicles/${id}`);

// Example: Blogs
export const fetchBlogs = () => API.get("/api/admin/blogs");
export const createBlog = (data) => API.post("/api/admin/blogs", data);
export const updateBlog = (id, data) => API.put(`/api/admin/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/api/admin/blogs/${id}`);

export default API;
