
function Counter() {

    return (

        <div>

          <p>Count: {count}</p>

          <button onClick={increment}>Increment</button>

        </div>

      );

    }




const root = document.getElementById("root");

ReactDOM.createRoot(root).render(<Counter/>);


