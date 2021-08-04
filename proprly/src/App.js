import logo from './logo.png';
import './App.css';
import  Navbar  from "./Navbar";

function App() {
  if (process.env.NODE_ENV !=='production') {
    return (
      <div className="App">
        <Navbar />
      </div>
    );
  }
  
  //placeholder until up and running
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Working on something cool.
        </p>
      </header>
    </div>
  );
}

export default App;
