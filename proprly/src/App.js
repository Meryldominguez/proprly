import React, {useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import './App.css';
import {ThemeProvider} from '@material-ui/core/styles';
import {Container} from '@material-ui/core';
import ProprlyTheme from './ProprlyTheme';
import AlertContext from './context/AlertContext';
import UserContext from './context/UserContext';
import Navbar from './Navbar';
import AlertContainer from './components/AlertContainer';

import useAuth from './hooks/useAuth';
import {useGetUserProfile} from './hooks/useFetch';
import Routes from './routes/Routes';

// eslint-disable-next-line require-jsdoc
function App() {
  const [user, signup, login, logout] = useAuth();

  const [
    [profile, setProfile],
    isLoading,
    authProfile,
    updateProfile,
  ] = useGetUserProfile(user ? user.username : null);

  const [alerts, setAlerts] = useState([]);
  return (
    <ThemeProvider theme={ProprlyTheme}>
      <Container className="App">
        <UserContext.Provider value={{
          user,
          profile,
          setProfile,
          isLoading,
          authProfile,
          updateProfile,
        }}
        >
          <BrowserRouter>
            <AlertContext.Provider value={{alerts, setAlerts}}>
              <Navbar user={user} logout={logout} />
              <AlertContainer alerts={alerts} setAlerts={setAlerts} />
              {!isLoading &&
                  <Routes
                    user={user}
                    signup={signup}
                    login={login}
                    isLoading={isLoading}
                  />}
            </AlertContext.Provider>
          </BrowserRouter>
        </UserContext.Provider>
      </Container>
    </ThemeProvider>
  );
}

export default App;
