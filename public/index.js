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
                        <p>{poi.description}</p>
                        <p>lat: {poi.lat}</p>
                        <p>lon: {poi.lon}</p>
                    </li>
                )
                )}   
            </ul>
            }
        </div>
        );


}




const root = ReactDOM.createRoot(document.getElementById("root"));