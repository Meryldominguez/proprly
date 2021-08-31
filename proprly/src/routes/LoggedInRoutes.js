import React from 'react';
import {
  useLocation,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {parse} from 'query-string';
import {
  Container,
} from '@material-ui/core';
import CardWrapper from '../components/CardWrapper';
import LocationDashboard from '../components/LocationComponents/LocationDashboard';
import LotDashboard from '../components/LotComponents/LotDashboard';
import ProductionDashboard from '../components/ProductionComponents/ProductionDashboard';
import ProfileForm from '../forms/ProfileForm';
import PropDashboard from '../components/PropComponents/PropDashboard';

const LoggedInRoutes = ({username}) => {
  const {search} = useLocation();
  const queryObj = parse(search);
  return (
    <Container>
      <Switch>
        <Route exact path="/">
          <Redirect to='/props/0' />
        </Route>

        <Route exact path="/props/:featuredId">
          <CardWrapper title="Manage Props">
            <PropDashboard />
          </CardWrapper>
        </Route>

        <Route exact path="/productions">
          <CardWrapper title="Productions">
            <ProductionDashboard
              isActive={queryObj.isActive}
              search={queryObj.search}
              year={queryObj.year}
            />
          </CardWrapper>
        </Route>

        <Route exact path="/productions/:featuredId">
          <CardWrapper title="Productions">
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

export default LoggedInRoutes;
