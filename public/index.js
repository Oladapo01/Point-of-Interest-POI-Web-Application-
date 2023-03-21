function SearchForm() {
    const [region, setRegion] = React.useState("");
    const [pointOfInterest, setPointOfInterest] = React.useState([]);

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
            {pointOfInterest.length > 0 && 
            <ul>
                {pointOfInterest.map((poi) => (
                    <li key={poi.id}>
                        <h2>{poi.name}</h2>
                        <h4><p>Description: {poi.description}</p></h4>
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
ReactDOM.render(<SearchForm />, root);