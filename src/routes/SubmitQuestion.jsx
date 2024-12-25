import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { uploadToCloudinary } from '../utils/cloudinary';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Register FilePond plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

const SubmitQuestion = () => {
  const categories = [
    "Waste Management",
    "Road Maintenance",
    "Public Safety",
    "Water Supply",
    "Sanitation",
    "Electricity",
    "Garbage Collection",
    "Colony Issue",
    "Public Transport",
    "Public Health",
    "Pollution",
    "Other",
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    gpsLocation: '',
    attempts: '',
  });
  const [filePondFiles, setFilePondFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState([28.6139, 77.2090]);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const navigate = useNavigate();

  const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [30, 30],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNearMe = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedPosition([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setFormData({ ...formData, gpsLocation: `${latitude},${longitude}` });
      },
      () => {
        setError('Failed to fetch location. Please allow location access.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      // Upload images to Cloudinary
      const imageUrls = await Promise.all(
        filePondFiles.map(async (file) => {
          const imageUrl = await uploadToCloudinary(file.file);
          return imageUrl;
        })
      );

      // Create question with Cloudinary URLs
      const questionData = {
        ...formData,
        gpsLocation: selectedPosition.join(','),
        images: imageUrls,
      };

      const token = localStorage.getItem('token');
      await apiRequest('/questions', 'POST', questionData, token);
      navigate('/');
    } catch (error) {
      setError('Failed to submit question. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const UpdateMapCenter = () => {
    const map = useMap();
    if (mapCenter) {
      map.setView(mapCenter, 15);
    }
    return null;
  };

  return (
    <div className="max-w-lg mx-auto mt-20 bg-white dark:bg-gray-800 p-6 rounded shadow dark:border-gray-700 dark:text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit a Question</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Question Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border border-black dark:border-gray-600 rounded mb-4 dark:bg-gray-700 dark:text-white"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border border-black dark:border-gray-600 rounded mb-4 dark:bg-gray-700 dark:text-white"
          rows="4"
          required
        ></textarea>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 border border-black dark:border-gray-600 rounded mb-4 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <textarea
          name="attempts"
          placeholder="Previous attempts to resolve the issue"
          value={formData.attempts}
          onChange={handleChange}
          className="w-full p-3 border border-black dark:border-gray-600 rounded mb-4 dark:bg-gray-700 dark:text-white"
          rows="3"
        ></textarea>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Select Location where the issue has occurred :</h3>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
            />
            <UpdateMapCenter />
            <Marker
              position={selectedPosition}
              draggable={true}
              icon={customMarkerIcon}
              eventHandlers={{
                dragend: (event) => {
                  const latlng = event.target.getLatLng();
                  setSelectedPosition([latlng.lat, latlng.lng]);
                  setFormData({ ...formData, gpsLocation: `${latlng.lat},${latlng.lng}` });
                },
              }}
            />
          </MapContainer>
          <button
            type="button"
            onClick={handleNearMe}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Use my current location
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Upload Images for the reference :</h3>
          <FilePond
            files={filePondFiles}
            onupdatefiles={setFilePondFiles}
            allowMultiple={true}
            acceptedFileTypes={['image/*']}
            labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
          />
          {uploading && <p className="text-blue-500 mt-2">Uploading images...</p>}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full bg-black text-white py-3 rounded transition ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 dark:hover:bg-gray-600'}`}
        >
          {uploading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default SubmitQuestion;
