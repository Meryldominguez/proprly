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
import LocationDashboard from '../components/LocationDashboard'
import LotDashboard from '../components/LotDashboard'
import ProfileForm from "../forms/ProfileForm"
import Dashboard from '../components/Dashboard'

 
const LoggedInRoutes = ({username}) => {
  console.log("logged in routes")
  let {search} = useLocation()
  const queryObj= parse(search)
  return (
    <Container>
    <Switch >
    <Route exact path="/">
      <Dashboard />
    </Route>
    <Route exact path="/productions/:id" />

    <Route path="/lots">
      <CardWrapper title="Items">
        <LotDashboard searchTerm={queryObj.searchTerm} />
      </CardWrapper>
    </Route>

    <Route exact path="/productions" />

    <Route path="/locations">
      <CardWrapper title="Locations">
        <LocationDashboard id={queryObj.id} />
      </CardWrapper>
    </Route> 
   
    {/* <Route exact path="/locations/:id" /> */}

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