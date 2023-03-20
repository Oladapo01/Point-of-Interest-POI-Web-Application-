const { useStatae } = React;

const POIForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { name, description };
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
            <label htmlfor="description">Description</label>
            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="submit" value="Add" />
            </form>
            );
};

const root = document.getElementById("root");
ReactDOM.render(<SearchForm />, root);

