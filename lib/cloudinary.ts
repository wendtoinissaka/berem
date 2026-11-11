import "server-only";
import { v2 as cloudinary } from "cloudinary";

let configured = false;

/**
 * Initialise Cloudinary uniquement lors de sa première utilisation.
 */
function getCloudinary() {
  if (!configured) {
    if (!process.env.CLOUDINARY_URL) {
      throw new Error("La variable CLOUDINARY_URL est absente.");
    }

    cloudinary.config({
      secure: true,
    });

    configured = true;
  }

  return cloudinary;
}

export { getCloudinary };