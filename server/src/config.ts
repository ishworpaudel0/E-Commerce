import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  Super_Admin_Name: process.env.Super_Admin_Name || "",
  Super_Admin_Email: process.env.Super_Admin_Email || "",
  Super_Admin_Password: process.env.Super_Admin_Password || "",
  Cloudinary_Cloud_Name: process.env.Cloudinary_Cloud_Name || "",
  Cloudinary_API_Key: process.env.Cloudinary_API_Key || "",
  Cloudinary_API_Secret: process.env.Cloudinary_API_Secret || ""

};