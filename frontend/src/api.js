import axios from "axios";

// Base URL from environment variable
const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
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
