

function SearchForm() {
    const [region, setRegion] = React.useState("");
    const [pointOfInterest, setPointOfInterest] = React.useState([]);
    const mapContainerRef = React.useRef(null);
    const [addPOI, setAddPOI] = React.useState(false);
    const [newPOI, setNewPOI] = React.useState({
        name: "",
        type: "",
        country: "",
        region: "",
        lon: "",
        lat: "",
        description: "",
        recommendations: 0
    });
    const [addPOIMessage, setAddPOIMessage] =React.useState("");

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
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            console.log(data);
            // Reload the point of interest list
            const response2 = await fetch(`/regions/${region}`);
            const data2 = await response2.json();
            setPointOfInterest(data2);
        } catch (error) {
            console.log(error);
        }
    };

    const handleMapClick = (event) => {
        if(event.latlng){
            setNewPOI({
                ...newPOI,
                lat: event.latlng.lat,
                lon: event.latlng.lng,
            });
            setAddPOI(true);
        }

        if (mapContainerRef.current && event.latlng) {
            L.marker([event.latlng.lat, event.latlng.lng]).addTo(mapContainerRef.current);
        }
       
    };

    const handleAddPOI = async () => {
        try {
            const response = await fetch(`/poi/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPOI),
            });
            if(response.ok) {
                setAddPOIMessage("Point of interest added");
                setAddPOI(false);
                const data = await response.json();
                const poiId = data.id;
                // Reload the point of interest list
                const response2 = await fetch(`/regions/${region}`);
                const data2 = await response2.json();
                setPointOfInterest(data2);
                // Add the new marker to the map
                const marker = L.marker([newPOI.lat, newPOI.lon]).addTo(mapContainerRef.current);
                marker.bindPopup(`<h2>${newPOI.name}</h2><p>${newPOI.description}</p>`);
            }else {
                const data = await response.json();
                setAddPOIMessage(data.error);
            } 
        } catch (error) {
            console.log(error);
            setAddPOIMessage("Error adding point of interest. Please try again");  
        }
    };
    
    React.useEffect(() => {
        let map = null;
        if (mapContainerRef.current){
            map = L.map(mapContainerRef.current).setView([50.908, -1.4], 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            // Add markers to the map
            const markers = [];
            pointOfInterest.forEach((poi) => {
                const marker = L.marker([poi.lat, poi.lon]).addTo(map);
                marker.bindPopup(`<h2>${poi.name}</h2><p>${poi.description}</p>`);
                markers.push(marker);
            });
            // Clean up the markers when the component unmounts
            return () => {
                if(map){
                    map.remove();
                }
                markers.forEach((marker) => marker.remove()); 
            };
        }
        
    }, [pointOfInterest]);

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Region:
                    <input type="text" value={region} onChange={handleRegionChange} />
                </label>
                <input type="submit" value="Search" />
            </form>
            <div ref={mapContainerRef} style={{height: "400px"}} onClick={handleMapClick}></div>
            {addPOI &&
                <div>
                    <h2>Add a point of interest</h2>
                    <form>
                        <label>
                            Name:
                            <input type="text" value={newPOI.name} onChange={(event) => setNewPOI({...newPOI, name: event.target.value})} />
                        </label>
                        <label>
                            Type:
                            <input type="text" value={newPOI.type} onChange={(event) => setNewPOI({...newPOI, type: event.target.value})} />
                        </label>
                        <label>
                            Country:
                            <input type="text" value={newPOI.country} onChange={(event) => setNewPOI({...newPOI, country: event.target.value})} />
                        </label>
                        <label>
                            Region:
                            <input type="text" value={newPOI.region} onChange={(event) => setNewPOI({...newPOI, region: event.target.value})} />
                        </label>
                        <label>
                            Latitude:
                            <input type="text" value={newPOI.lat} onChange={(event) => setNewPOI({...newPOI, lat: event.target.value})} />
                        </label>
                        <label>
                            Longitude:
                            <input type="text" value={newPOI.lon} onChange={(event) => setNewPOI({...newPOI, lon: event.target.value})} />
                        </label>
                        <label>
                            Description:
                            <input type="text" value={newPOI.description} onChange={(event) => setNewPOI({...newPOI, description: event.target.value})} />
                        </label>
                        <input type="button" value="Add" onClick={handleAddPOI} />
                    </form>
                    <p>{addPOIMessage}</p>
                </div>
            }
            {pointOfInterest.length > 0 && 
            <ul>
                {pointOfInterest.map((poi) => (
                    <li key={poi.id}>
                        <h2>{poi.name}</h2>
                        <h4><p>{poi.description}</p></h4>
                        <p>Latitude: {poi.lat}</p>
                        <p>Longitude: {poi.lon}</p>
                        <button onClick={() => handleRecommend(poi.id)}>Recommend</button>
                    </li>
                )
                )}   
            </ul>
            }
        </div>
    );
}
const root = document.getElementById("root");
ReactDOM.createRoot(root).render(<SearchForm/>);