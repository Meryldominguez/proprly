import React, {
  useState,
  useContext,
} from 'react';
import {
  useParams,
} from 'react-router-dom';
import {
  Grid,
} from '@material-ui/core';
import UserContext from '../../context/UserContext';
import LocList from './LocationList';
import LocFeature from './LocationFeature';
import LoadingSpinner from '../Spinner';
import { useFetchLocations } from '../../hooks/useFetch';

const LocationDashboard = () => {
  const { profile, isLoading } = useContext(UserContext);
  const { featuredId } = useParams();

  const [view, setView] = useState('1');
  const [id, setId] = useState(featuredId);

  const [locations, locsLoading, refreshLocs] = useFetchLocations();

  return !isLoading && !locsLoading ? (
    <Grid
      container
      rowSpacing={3}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      justifyContent="center"
    >
      <Grid item xs={4}>
        <LocList
          currentFeature={id}
          locations={locations}
          isLoading={locsLoading}
          setTab={(idx) => setView(idx)}
          feature={(i) => setId(i)}
        />
      </Grid>
      <Grid item xs={8}>
        <LocFeature
          currentFeature={id}
          currentTab={view}
          setTab={(idx) => setView(idx)}
          locations={locations}
          profile={profile}
          setFeature={(i) => setId(i)}
          refreshLocs={refreshLocs}
        />
      </Grid>
    </Grid>
  ) : <LoadingSpinner />;
};

export default LocationDashboard;
