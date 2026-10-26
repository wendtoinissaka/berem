import "server-only";
import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_URL) {
  throw new Error("La variable CLOUDINARY_URL est absente.");
}

cloudinary.config({
  secure: true,
});

export { cloudinary };