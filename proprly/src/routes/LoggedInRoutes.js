import React from 'react'
import {
  useLocation
} from 'react-router-dom'
import { parse } from "query-string";
import { 
  Route, 
  Redirect, 
  Switch
} from "react-router-dom"
import {
  Container
} from '@material-ui/core'
import CardWrapper from '../components/CardWrapper'
import Location from '../components/LocationDashboard'
import ProfileForm from "../forms/ProfileForm"
import Dashboard from '../components/Dashboard'

 
const LoggedInRoutes = ({username}) => {
  console.log("logged in routes")
  let {search} = useLocation()
  const queryObj= parse(search)
  return (
    <Container maxWidth="sm">
    <Switch >
    <Route exact path="/">
      <Dashboard />
    </Route>
    <Route exact path="/productions/:id" />

    <Route exact path="/lots" />
    <Route exact path="/productions" />

    <Route path="/locations">
      <Location id={queryObj.id} />
    </Route> 
   
    <Route exact path="/locations/:id" />

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