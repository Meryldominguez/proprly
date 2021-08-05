import React from 'react'
import { Route, Redirect, Switch } from "react-router-dom"

import { Container, CardActions, Button, Grid } from '@material-ui/core';

import useToggle from '../hooks/useToggle';

import SignupForm from '../forms/SignupForm';
import LoginForm from '../forms/LoginForm';
import CardWrapper from "../components/CardWrapper";

 
const AnonRoutes = ({signup, login}) => {

  const [signUp, toggleSignUp] = useToggle(true)

  return (
    <Switch>
        <Route exact path="/">
            <Container maxWidth="sm">
            <Grid container>
                <Grid item xs={12}>
                    <CardWrapper title={signUp? "Sign up":"Log in"}>
                        {signUp? 
                        <SignupForm />
                        : 
                        <LoginForm />}
                        <CardActions>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Button size="small" onClick={toggleSignUp}>
                                    {signUp? "Already have an account?":"Need to Sign up?"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardActions>
                    </ CardWrapper>
                </Grid>
            </Grid>
            </Container>
        </Route>
        <Redirect to="/"/>
    </ Switch>
  )
}
 
export default AnonRoutes