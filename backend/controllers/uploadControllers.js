import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import TryCatch from "../utils/TryCatch.js";

export const uploadFile = TryCatch(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const streamUpload = (buffer) =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "social_media_app", resource_type: "image" },
        (error, result) => (result ? resolve(result) : reject(error))
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });

  const result = await streamUpload(req.file.buffer);

  res.status(201).json({
    message: "File uploaded",
    url: result.secure_url,
    publicId: result.public_id,
  });
});