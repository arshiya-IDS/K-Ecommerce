import axios from "axios";
const API_BASE = "/api/Auth"; 

const API_BASE_URL = "http://ecommerce-admin-backend.i-diligence.com/api/Auth"; // change to your API URL


export const loginUser = async (data) => {
  const res = await axios.post(`${API_BASE}/login`, data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await axios.post(`${API_BASE}/register`, data);
  return res.data;
};
