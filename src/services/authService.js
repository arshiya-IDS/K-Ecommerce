import axios from "axios";
const API_BASE = "/api/Auth"; 
import api from "../api/axiosInstance";




export const loginUser = async (data) => {
  const res = await api.post(`/Auth/login`, data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await axios.post(`${API_BASE}/register`, data);
  return res.data;
};
