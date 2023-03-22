import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function SearchForm() {
    const [region, setRegion] = React.useState("");
    const [pointOfInterest, setPointOfInterest] = React.useState([]);

    React.useEffect(() => {
        const map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © OpenStreetMap contributors',
        }).addTo(map);

        //Add a marker layer for the point of interest
        const poiMarker = L.markerClusterGroup();
        poiMarker.addTo(map);

        //Add a click listener for the point of interest
        poiMarker.on('click', (event) => {
            const poi = event.layer.poi;
            L.popup()
                .setLatLng(event.latlng)
                .setContent(`<h2>${poi.name}</h2><p>${poi.description}</p>`)
                .openOn(map);
        });

        //Update the marker layer whenever the pointOfInterest state changes
        poiMarker.clearLayers();
        for (const poi of pointOfInterest) {
            L.marker([poi.lat, poi.lon], {poi})
                .addTo(poiMarker)
                .bindPopup(`<h2>${poi.name}</h2><p>${poi.description}</p>`);
            }
        }, [pointOfInterest]);

    const handleRegionChange = (event) => {
        setRegion(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`/regions/${region}`);
            const data = await response.json();
            setPointOfInterest(data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleRecommend = async (poiId) => {
        try {
            const response = await fetch(`/poi/${poiId}/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            console.log(data);
            const regionResponse = await fetch(`/regions/${region}`);
            const responseData = await regionResponse.json();
            setPointOfInterest(responseData);
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Region:
                    <input type="text" value={region} onChange={handleRegionChange} />
                </label>
                <input type="submit" value="Search" />
            </form>
            <div id="map" style={{ height: "500px" }}></div>
        </div>
        );


}




const root = document.getElementById("root");
ReactDOM.render(<SearchForm />, root);