import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configuration/cloudinaryConfig';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'electronics_store/products',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

export const upload = multer({ storage });