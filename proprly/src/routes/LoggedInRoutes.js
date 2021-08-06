import React from 'react'
import { 
  Route, 
  Redirect, 
  Switch
} from "react-router-dom"
import {
  Container
} from '@material-ui/core'
import CardWrapper from '../components/CardWrapper'

import ProfileForm from "../forms/ProfileForm"

 
const LoggedInRoutes = ({username}) => {
  console.log("logged in routes")
  return (
    <Container maxWidth="sm">
    <Switch >
  
    <Route exact path="/">
    </Route>
    <Route exact path="/companies/:handle" />

    <Route exact path="/companies" />

    <Route exact path="/jobs" />

    <Route exact path="/profile">
        <CardWrapper title={`${username}'s profile`} >
            <ProfileForm />
        </CardWrapper>
    </Route>
    <Redirect to="/" />
    </Switch>
    </Container>
  )
}
 
export default LoggedInRoutes