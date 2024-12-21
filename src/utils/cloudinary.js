import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = 'qnaupload'; // Replace with your preset name
const CLOUDINARY_CLOUD_NAME = 'du6a5ejvq'; // Replace with your cloud name

export const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};
