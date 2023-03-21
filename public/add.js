const { useState } = React;

const POIForm = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [lon, setLon] = useState('');
    const [lat, setLat] = useState('');   
    const [description, setDescription] = useState('');
    const [recommendations, setRecommendations] = useState(0); //new state variable 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { name, type, country, region, lon, lat, description, recommendations, recommendations };
            const response = await fetch('/poi/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <label htmlfor="name">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            <label htmlfor="type">Type</label>
            <input type="text" id="type" value={type} onChange={(e) => setType(e.target.value)} />
            <label htmlfor="country">Country</label>
            <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
            <label htmlfor="region">Region</label>
            <input type="text" id="region" value={region} onChange={(e) => setRegion(e.target.value)} />
            <label htmlfor="lat">Latitude</label>
            <input type="text" id="lat" value={lat} onChange={(e) => setLat(e.target.value)} />
            <label htmlfor="lon">Longitude</label>
            <input type="text" id="lon" value={lon} onChange={(e) => setLon(e.target.value)} />
            <label htmlfor="description">Description</label>
            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />

            <input type="submit" value="Add" />
            </form>
            );
};

const root = document.getElementById("root");
ReactDOM.render(<POIForm />, root);

