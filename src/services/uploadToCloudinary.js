import axios from "axios";

const uploadToCloudinary = async (file, uploadPreset, folderName) => {
  if (!file) throw new Error("No file selected for upload.");

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only PNG, JPEG, JPG, and WEBP are allowed."
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size too large. Max limit is 5MB.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folderName);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Upload failed. Try again."
    );
  }
};

export default uploadToCloudinary;
