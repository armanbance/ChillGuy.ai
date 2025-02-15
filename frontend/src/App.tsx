import React, { useEffect } from 'react';
import './App.css';
import { getSocket } from './socket';


function App() {
  useEffect(() => {
    getSocket();
    console.log("Get socket called ")
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
