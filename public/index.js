

function SearchForm() {
    const [region, setRegion] = React.useState("");
    const [pointOfInterest, setPointOfInterest] = React.useState([]);
    const mapContainerRef = React.useRef(null);

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
            // Clean up the markes when the component unmounts
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
            <div ref={mapContainerRef} style={{height: "400px"}}></div>
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