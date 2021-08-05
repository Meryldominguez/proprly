import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import logo from './logo.png';
import './App.css';
import { ThemeProvider } from '@material-ui/core/styles';
import {ProprlyTheme} from "./ProprlyTheme"

import  Navbar  from "./Navbar";

import useAuth from "./hooks/useAuth"
import AnonRoutes from "./routes/AnonRoutes";


function App() {
  const [user, signup, login, logout] = useAuth()
  

  if (process.env.NODE_ENV !=='production') {
    return (
      <ThemeProvider theme={ProprlyTheme}>
        <div className="App">
        <BrowserRouter>
            <Navbar logout={logout}/>
            <AnonRoutes />
          
        </BrowserRouter>
          
        </div>
      </ThemeProvider>
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
