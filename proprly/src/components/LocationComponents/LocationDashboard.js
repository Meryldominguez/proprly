import React, {
  useState,
  useContext,
} from 'react';
import {
  useParams,
} from 'react-router-dom';
import {
  Grid,
  Typography,
} from '@material-ui/core';
import UserContext from '../../context/UserContext';
import LocList from './LocationList';
import LocFeature from './LocationFeature';
import LoadingSpinner from '../Spinner';
import CardWrapper from '../CardWrapper';
import {useFetchLocations} from '../../hooks/useFetch';

const LocationDashboard = () => {
  const {profile, isLoading} = useContext(UserContext);
  const {featuredId} = useParams();

  const [view, setView] = useState('1');
  const [id, setId] = useState(featuredId);

  const [locations, locsLoading, search, refreshLocs] = useFetchLocations();

  return !isLoading && !locsLoading ? (
    <Grid
      container
      rowSpacing={3}
      columnSpacing={{xs: 1, sm: 2, md: 3}}
      justifyContent="center"
    >
      <Grid item xs={4}>
        {locations.length > 0 ?
        <LocList
          search={search}
          currentFeature={id}
          feature={(i) => setId(i)}
          locations={locations}
        /> :
        <CardWrapper>
          <Typography spacing={3}>
          No Locations returned!
          </Typography>
          <small>Make some, using the form to the right!</small>
        </CardWrapper>
        }
      </Grid>
      <Grid item xs={8}>
        <LocFeature
          currentFeature={id}
          feature={(i) => setId(i)}
          currentTab={view}
          setTab={(idx) => setView(idx)}
          profile={profile}
          refreshLocs={refreshLocs}
          locations={locations}
        />
      </Grid>
    </Grid>
  ) : <LoadingSpinner />;
};

export default LocationDashboard;
