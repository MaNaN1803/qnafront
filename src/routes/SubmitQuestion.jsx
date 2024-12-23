import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { uploadToCloudinary } from '../utils/cloudinary';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  const [images, setImages] = useState([]);
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

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleNearMe = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedPosition([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setFormData({ ...formData, gpsLocation: `${latitude},${longitude}` });
      },
      (err) => {
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
        images.map(async (image) => {
          const imageUrl = await uploadToCloudinary(image);
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
    <div className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit a Question</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Question Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border border-black rounded mb-4"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border border-black rounded mb-4"
          rows="4"
          required
        ></textarea>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 border border-black rounded mb-4"
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
          className="w-full p-3 border border-black rounded mb-4"
          rows="3"
        ></textarea>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Select Location</h3>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full"
            accept="image/*"
            multiple
          />
          {uploading && <p className="text-blue-500 mt-2">Uploading images...</p>}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full bg-black text-white py-3 rounded transition ${
            uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
          }`}
        >
          {uploading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default SubmitQuestion;
