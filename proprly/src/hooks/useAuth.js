import {useEffect, useState} from 'react';
import ProprlyApi from '../api';

const useAuth = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    if (window.localStorage.username) {
      setUser(window.localStorage);
      ProprlyApi.token = window.localStorage.token;
      return;
    }
    setUser();
  }, [user]);

  const signup = async (formData) => {
    const resp = await ProprlyApi.signup(formData);
    if (!resp.error) {
      ProprlyApi.token = resp.token;
      window.localStorage.setItem('username', resp.username);
      window.localStorage.setItem('token', resp.token);

      setUser({...resp});
      return resp;
    }
    return resp.error;
  };

  const login = async ({username, password}) => {
    const resp = await ProprlyApi.login({username, password});
    if (!resp.error) {
      ProprlyApi.token = resp.token;
      window.localStorage.setItem('username', resp.username);
      window.localStorage.setItem('token', resp.token);

      setUser({...resp, username});
      return resp;
    }
    return resp.error;
  };
  const logout = () => {
    window.localStorage.clear();
    setUser();
    window.open('/', '_self');
  };

  return [user, signup, login, logout];
};
export default useAuth;
