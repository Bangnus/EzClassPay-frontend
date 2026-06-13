import axios from "axios";
import https from "https";
import http from "http"; // เพิ่ม http เข้ามาด้วย

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip,deflate,compress",
  },
  // เพิ่มการตั้งค่า Agent เพื่อบังคับ IPv4 (family: 4)
  httpAgent: new http.Agent({ family: 4 }),
  httpsAgent: new https.Agent({ 
    rejectUnauthorized: false,
    family: 4 
  }),
});