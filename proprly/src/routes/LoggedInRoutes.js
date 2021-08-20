import React from 'react';
import {
  useLocation,
  Route, 
  Redirect, 
  Switch
} from 'react-router-dom'
import { parse } from "query-string";
import {
  Container,
} from '@material-ui/core';
import CardWrapper from '../components/CardWrapper';
import LocationDashboard from '../components/LocationComponents/LocationDashboard';
import LotDashboard from '../components/LotComponents/LotDashboard';
import ProductionDashboard from '../components/ProductionComponents/ProductionDashboard';
import ProfileForm from '../forms/ProfileForm'
import Dashboard from '../components/Dashboard';
 
const LoggedInRoutes = ({ username }) => {
  console.log('logged in routes');
  const {search} = useLocation()
  const queryObj = parse(search);
  return (
    <Container>
      <Switch>
      <Route exact path="/">
      <Dashboard />
    </Route>

      <Route exact path="/productions">
      <CardWrapper>
        <ProductionDashboard
          isActive={queryObj.isActive}
          search={queryObj.search}
          year={queryObj.year}
        />
      </CardWrapper>
    </Route>

      <Route exact path="/productions/:featuredId">
      <CardWrapper>
        <ProductionDashboard
          isActive={queryObj.isActive}
          search={queryObj.search}
          year={queryObj.year}
        />
      </CardWrapper>
    </Route>

      <Route exact path="/lots">
      <CardWrapper title="Items">
        <LotDashboard
          searchTerm={queryObj.searchTerm}
        />
      </CardWrapper>
    </Route>
      <Route exact path="/lots/:featuredId">
      <CardWrapper title="Items">
        <LotDashboard
          searchTerm={queryObj.searchTerm}
        />
      </CardWrapper>
    </Route>

      <Route exact path="/locations">
      <CardWrapper title="Locations">
        <LocationDashboard
          id={queryObj.id}
        />
      </CardWrapper>
    </Route>
      <Route exact path="/locations/:featuredId">
      <CardWrapper title="Locations">
        <LocationDashboard
          id={queryObj.id}
        />
      </CardWrapper>
    </Route>


      <Route exact path="/profile">
      <CardWrapper title={`${username}'s profile`}>
          <ProfileForm />
        </CardWrapper>
    </Route>
      <Redirect to="/" />
    </Switch>
    </Container>
  );
};

export default LoggedInRoutes
