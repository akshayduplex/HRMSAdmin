import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getEmployeeCountForMapChart } from '../employee/helper/Api_Helper';
import config from '../config/config';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const mapContainerStyle = {
    width: '100%',
    height: '100vh',
};

const center = {
    lat: 22.9734, // Center of India
    lng: 78.6569,
};

const indiaBounds = {
    north: 37.6,
    south: 6.7,
    west: 68.7,
    east: 97.25,
};

const EmployeeGeographicView = ({ projectId }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchEmployeeCountForMapChart = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getEmployeeCountForMapChart(projectId);
                if (response && response.status) {
                    setLocations(response.data || []);
                } else {
                    setLocations([]);
                }
            } catch (error) {
                setError('Error fetching employee count data. Please try again later.');
                console.error("Error fetching employee count data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeCountForMapChart();
    }, [projectId]);

    const handleMarkerClick = useCallback((location) => {
        setSelectedLocation(location);
        // Zoom to the clicked marker location
        if (mapRef.current) {
            mapRef.current.setView([location.lat, location.lng], 10, {
                animate: true,
                duration: 1,
            });
        }
    }, []);

    const totalEmployeeCount = locations.reduce((total, loc) => total + loc.count, 0);

    // Custom marker icon with count badge
    const createCustomIcon = (count) => {
        return L.divIcon({
            html: `
                <div style="
                    background-color: #1976d2;
                    color: white;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 14px;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    cursor: pointer;
                ">
                    ${count}
                </div>
            `,
            className: 'custom-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
        });
    };

    return (
        <div className='geomap'>
            {loading && (
                <div className='loader'>
                    <p>Loading...</p>
                </div>
            )}
            {error && (
                <div className='error'>
                    <p>{error}</p>
                </div>
            )}
            {!loading && !error && (
                <MapContainer
                    center={[center.lat, center.lng]}
                    zoom={5}
                    style={mapContainerStyle}
                    ref={mapRef}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {locations.map((location, index) => (
                        <Marker
                            key={index}
                            position={[location.lat, location.lng]}
                            icon={createCustomIcon(location.count)}
                            eventHandlers={{
                                click: () => handleMarkerClick(location),
                            }}
                        >
                            <Popup>
                                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                                    <h4 style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold' }}>
                                        {location.name}
                                    </h4>
                                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>
                                        Employee Count: <strong>{location.count}</strong>
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            )}
            {!loading && !error && (
                <>
                    <div className='location_employees'>
                        <ul>
                            {locations.map((location, index) => (
                                <li key={index}>{location.name} ({location.count})</li>
                            ))}
                        </ul>
                    </div>
                    <div className='totl_empcount'>
                        <h5>Total Employee Count: <span>{totalEmployeeCount}</span></h5>
                    </div>
                </>
            )}
        </div>
    );
};

export default EmployeeGeographicView;
