import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { MapContainer, TileLayer, Marker, useMapEvents,useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const SubmitQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    gpsLocation: '', // Field for GPS Location
    attempts: '', // Field for previous attempts
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const navigate = useNavigate();

  // Custom icon for the marker
  const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [30, 30],
  });

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // Handle "Near Me" button click to use user's location
  const handleNearMe = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedPosition([latitude, longitude]);
        setMapCenter([latitude, longitude]); // Update map center
        setFormData({ ...formData, gpsLocation: `${latitude},${longitude}` });
      },
      (err) => {
        setError('Failed to fetch location. Please allow location access.');
      }
    );
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      images.forEach((image) => form.append('images', image));

      await apiRequest('/questions', 'POST', form, token, true); // true for multipart/form-data
      navigate('/home');
    } catch (error) {
      setError('Failed to submit question. Please try again.');
    }
  };

  // Map click handler for setting location on map click
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setSelectedPosition([lat, lng]);
        setFormData({ ...formData, gpsLocation: `${lat},${lng}` });
      },
    });
    return selectedPosition ? (
      <Marker position={selectedPosition} icon={customMarkerIcon} />
    ) : null;
  };

  // Component to update map center
const UpdateMapCenter = () => {
  const map = useMap();
  if (mapCenter) {
    map.setView(mapCenter, 15); // Set view to the new center with a zoom level of 13
  }
  return null;
};

const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default to Delhi


  return (
    <div className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit a Question</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Question Title */}
        <input
          type="text"
          name="title"
          placeholder="Question Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border border-black rounded mb-4"
          required
        />

        {/* Question Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border border-black rounded mb-4"
          rows="4"
          required
        ></textarea>

        {/* Category */}
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
          <option value="Waste Management">Waste Management</option>
          <option value="Road Maintenance">Road Maintenance</option>
          <option value="Public Safety">Public Safety</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Electricity">Electricity</option>
          <option value="Garbage Collection">Garbage Collection</option>
          <option value="Colony issue">colony issue</option>
          <option value="Public Transport">Public Transport</option>
          <option value="Public Health">Public Health</option>
          <option value="Pollution">Pollution</option>

          <option value="Other">Other</option>

        </select>

        {/* Previous Attempts */}
        <textarea
          name="attempts"
          placeholder="Previous attempts to resolve the issue"
          value={formData.attempts}
          onChange={handleChange}
          className="w-full p-3 border border-black  rounded mb-4"
          rows="3"
        ></textarea>

        {/* Map for selecting GPS Location */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Select Your Location where the issue has occured</h3>
          <MapContainer
            center={[28.6139, 77.2090]} // Default to Delhi
            zoom={13}
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
           <UpdateMapCenter />
           <MapClickHandler />
          </MapContainer>
          <button
            type="button"
            onClick={handleNearMe}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Use my current location
          </button>
        </div>

        {/* Image Upload */}
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full mb-4"
          accept="image/*"
          multiple
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitQuestion;
