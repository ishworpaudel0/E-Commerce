import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

cloudinary.config({
  cloud_name: config.Cloudinary_Cloud_Name,
  api_key: config.Cloudinary_API_Key,
  api_secret: config.Cloudinary_API_Secret,
});

export default cloudinary;