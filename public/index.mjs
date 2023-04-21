

function SearchForm() {
    const [region, setRegion] = React.useState("");
    const [pointOfInterest, setPointOfInterest] = React.useState([]);
    const mapContainerRef = React.useRef(null);
    const mapRef = React.useRef(null);
    const [tempMarker, setTempMarker] =React.useState(null);
    const [addPOI, setAddPOI] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [loggedInUser, setLoggedInUser] = React.useState("");
    const [showLoginForm, setShowLoginForm] = React.useState(false);
    
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
    //let lat = 0;
    //let lon = 0;

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

    async function login(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            });
            if(response.ok) {
                const data = await response.json();
                console.log(data);
                setIsLoggedIn(true);
                setLoggedInUser(username);
                setShowLoginForm(false);
            } else {
                alert('Invalid Username or Password')
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    }
    async function logout() {
        try {
            const response = await fetch('/logout');
            if (response.ok){
                setIsLoggedIn(false);
                setLoggedInUser("");
                setShowLoginForm(false);
            } else {
                alert('Error logging out')
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async function handleAddReview(event, poiId) {
        event.preventDefault();
        const reviewInput = document.getElementById(`review-${poiId}`);
        const review = reviewInput.value.trim();
        if(review.length === 0){
            alert('Please enter a review.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/poi/${poiId}/addReview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ review }),
            });
            if(response.ok) {
                const data = await response.json();
                alert('Review submitted successfully!');
                reviewInput.value='';
                console.log(data);
                
            } else {
                const errorData = await response.json();
                alert('Error adding review');
            }
        }catch (error) {
            console.log('Error:', error)
            alert('Failed to submit the review. Please try again.');
        }
    }

    function showLoginContainerForm(){
        setShowLoginForm(true);
    }
    
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

    
    const handleAddPOI = async (event, lat, lng) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const type = form.type.value;
        const country = form.country.value;
        const region = form.region.value;
        const description = form.description.value;

        // Create a new point of interest object
        setNewPOI({
            name: name,
            type: type,
            country: country,
            region: region,
            lon: lng,
            lat: lat,
            description: description,
            recommendations: 0
        });

        const list = {
            name: name,
            type: type,
            country: country,
            region: region,
            lon: lng,
            lat: lat,
            description: description,
            recommendations: 0
        };
        //Debugging
        console.log("List to be sent to the database", list); 
        try {
            const response = await fetch(`/poi/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(list),
            });
            if (response.status === 401 ){
                // Show user a message that they need to log in
                setAddPOIMessage("You need to log in to add a point of interest");
            } else if(response.ok) { 
                const data = await response.json();
                const poiId = data.id;
                setAddPOIMessage("Point of interest added");
                setAddPOI(false);

                // Reload the point of interest list
                const response2 = await fetch(`/regions/${region}`);
                const data2 = await response2.json();
                setPointOfInterest(data2);
                // Add the new marker to the map
                const marker = L.marker([newPOI.lat, newPOI.lon]).addTo(mapContainerRef.current);
                marker.bindPopup(`<h2>${newPOI.name}</h2><p>${newPOI.description}</p>`).openPopup();

            }else {
                const data = await response.json();
                setAddPOIMessage(data.error);
            } 
        } catch (error) {
            if(error.response && error.response.status !== 401) {
                console.log(error);
                setAddPOIMessage("Error adding point of interest. Please try again");  
            }
          
        }
        if(tempMarker){
            // Remove the temporary marker from the map
            mapRef.current.removeLayer(tempMarker);
            //Reset the temporary marker state
            setTempMarker(null)
        }
    };


    const handleMapClick = (event) => {
            setAddPOI(true);
            const {lat, lng} = event.latlng;
            setNewPOI((prevState) => ({
               ...prevState,
                lat: lat,
                lon: lng,
            }));
            // Create a new marker and add it to the map
            const marker = L.marker([lat, lng]).addTo(mapRef.current);
            // Save the temporary marker to the state
            setTempMarker(marker); 
            const domDiv = document.createElement("div");
            domDiv.innerHTML = `<form id= "form">
            <h2>Add point of interest</h2>
            <label>Name:</label>
            <input type="text" placeholder="Enter name" id="name" required/><br>
            <label>Type:</label>
            <input type="text" placeholder="Enter type" id="type" required/><br>
            <label>Country:</label>
            <input type="text" placeholder="Enter country" id="country" required/><br>
            <label>Region:</label>
            <input type="text" placeholder="Enter region" id="region" required/><br>
            <label>Description:</label>
            <input type="text" placeholder="Enter description" id="description" required/><br>
            <button type="submit" id="add">Add</button>
            </form>`;
            const popup = L.popup()
                .setLatLng([lat, lng])
                .setContent(domDiv)
                .openOn(mapRef.current);
            const form = domDiv.querySelector("form");
            // Add the event listener for the form submission
            form.addEventListener("submit", (event) => {
                handleAddPOI(event, lat, lng)
            }); 
            
        };
    
    React.useEffect(() => {
        let map = null;
        if (mapContainerRef.current){
            map = L.map(mapContainerRef.current).setView([50.908, -1.4], 14);
            // Set the map instance to the mapRef
            mapRef.current = map;
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            // Add markers to the map
            const markers = [];
            pointOfInterest.forEach((poi) => {
                const marker = L.marker([poi.lat, poi.lon]).addTo(map);
                marker.bindPopup(`<h2>${poi.name}</h2><p>${poi.description}</p>
                <textarea id="review-${poi.id}" placeholder="Write your review here..."></textarea>
                <button id= "submitReview-${poi.id}">Submit Review</button>`);
                markers.push(marker);

                // Add the event listener for the submit review button
                marker.on("popupopen", () =>{
                    document.getElementById(`submitReview-${poi.id}`).addEventListener('click', (event) => handleAddReview(event, poi.id));
                }, 0);
            });
            // Add the event listener for the map click
            map.on("click", handleMapClick);

            // Clean up the markers when the component unmounts
            return () => {
                if(map){
                    map.remove();
                }
                markers.forEach((marker) => marker.remove());
                if(map)
                {
                    map.off("click", handleMapClick)
                } 
            }    
        } 
    }, [pointOfInterest]);

    return(
        <div>
            <div id ="authButtonsContainer" style={{ textAlign: "center"}}>
                {!isLoggedIn && !showLoginForm && (
                    <button id="loginButton" onClick={showLoginContainerForm}>Login</button>
                )}
                {showLoginForm && (
                    <div id="loginContainerForm">
                        <form onSubmit={login}>
                            <label>
                                Username:
                                <input type="text" name="username" id="username" placeholder="Username" />
                            </label>
                            <label>
                                Password:
                                <input type="password" name="password" id="password" placeholder="Password" />
                            </label>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                )}
                {isLoggedIn && (
                    <div>
                        <div id="loginStatus">Welcome {loggedInUser}</div>
                        <button onClick={logout}>Logout</button>
                    </div>
                    
                )}
                    
                
            </div>
            <form onSubmit={handleSubmit}>
                <label>
                    Region:
                    <input type="text" value={region} onChange={handleRegionChange} />
                </label>
                <input type="submit" value="Search" />
            </form>
            <div ref={mapContainerRef} style={{height: "400px"}} /*onClick={handleMapClick}*/></div>
            {addPOI &&
            <div>
                {addPOIMessage !== "" && <p>{addPOIMessage}</p>}
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