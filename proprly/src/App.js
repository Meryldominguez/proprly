import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import logo from './logo.png';
import './App.css';

import { ThemeProvider } from '@material-ui/core/styles';
import { ProprlyTheme } from "./ProprlyTheme"

import AlertContext from "./context/AlertContext";
import UserContext from "./context/UserContext";
import  Navbar  from "./Navbar";
import AlertContainer from "./components/AlertContainer"

import useAuth from "./hooks/useAuth"
import {useGetUserProfile} from "./hooks/useFetch"
import Routes from "./routes/Routes";


function App() {
  const [user, signup, login, logout] = useAuth()

  let [[profile, setProfile], isLoading, authProfile, updateProfile, apply] = useGetUserProfile(user?user.username:null)

  const [alerts, setAlerts] = useState([])
  console.log(user, isLoading)

    if (process.env.NODE_ENV !=='production') {
    return (
      <ThemeProvider theme={ProprlyTheme}>
        <div className="App">
        <UserContext.Provider value={{user, signup, login, profile, setProfile, isLoading, authProfile, updateProfile, apply}}>
          <AlertContext.Provider value={{alerts,setAlerts}}>
            <BrowserRouter>
                <Navbar logout={logout}/>
                <AlertContainer alerts={alerts} setAlerts={setAlerts}/>
                {!isLoading && <Routes user={user} isLoading={isLoading}/>}
            </BrowserRouter>
          </AlertContext.Provider>
        </UserContext.Provider>
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
