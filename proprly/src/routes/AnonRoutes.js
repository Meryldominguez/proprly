import React, { useContext } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { Container, Button, Grid } from '@material-ui/core';

import useToggle from '../hooks/useToggle';

import SignupForm from '../forms/SignupForm';
import LoginForm from '../forms/LoginForm';
import CardWrapper from '../components/CardWrapper';
import UserContext from '../context/UserContext';

const AnonRoutes = () => {
  const [signUp, toggleSignUp] = useToggle(true);
  const { signup, login } = useContext(UserContext);
  console.log('anon routes');
  return (
    <Switch>
      <Route exact path="/">
        <Container maxWidth="sm">
          <Grid container>
            <Grid item xs={12}>
              <CardWrapper title={signUp ? 'Make an Account:' : 'Log in:'}>
                {signUp
                  ? <SignupForm userSignup={(data) => signup(data)} />
                  : <LoginForm userLogin={(data) => login(data)} />}
              </CardWrapper>
            </Grid>
            <Grid item xs={12}>
              <Button size="small" fullWidth onClick={toggleSignUp}>
                {signUp ? 'Already have an account?' : 'Need to Sign up?'}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default AnonRoutes;
