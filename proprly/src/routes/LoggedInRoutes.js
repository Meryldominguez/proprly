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
import Location from '../components/Location'
import ProfileForm from "../forms/ProfileForm"

 
const LoggedInRoutes = ({username}) => {
  console.log("logged in routes")
  let {search} = useLocation()
  const queryObj= parse(search)
  console.log(queryObj)
  return (
    <Container maxWidth="sm">
    <Switch >
  
    <Route exact path="/">
    </Route>
    <Route exact path="/productions/:id" />

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