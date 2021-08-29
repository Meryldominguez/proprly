import React, {
  useState,
  useContext,
} from 'react';
import {
  useParams,
  // Redirect
} from 'react-router-dom';
import {
  Grid,
  Divider,
  Typography,
} from '@material-ui/core';
import UserContext from '../../context/UserContext';

import {useFetchLots} from '../../hooks/useFetch';
import CardWrapper from '../CardWrapper';
import LoadingSpinner from '../Spinner';

import SearchForm from '../../forms/LotSearchForm';
import LotFeature from './LotFeature';
import LotList from './LotList';

const LotDashboard = ({searchTerm}) => {
  const {profile, isLoading} = useContext(UserContext);
  const {featuredId} = useParams();

  const queryString = searchTerm ? `?searchTerm=${searchTerm}` : '';

  const [view, setView] = useState('1');
  const [id, setId] = useState(featuredId);

  const [lots, lotsLoading, search, refreshLots] = useFetchLots(queryString);

  return !isLoading && !lotsLoading && profile ?
    (
      <Grid
        container
        rowSpacing={3}
        columnSpacing={{xs: 1, sm: 2, md: 3}}
        justifyContent="center"
      >
        <Grid item xs={12}>
          <SearchForm
            query={searchTerm}
            featuredId={featuredId}
            feature={(i) => setId(i)}
            searchLots={(q) => search(q)}
          />
        </Grid>
        <Divider spacing={4} />
        <Grid item xs={4}>
          {lots.length > 0 ?
            <LotList
              currentFeature={id}
              feature={(i) => setId(i)}
              lots={lots}
            /> :
            <CardWrapper>
              <Typography spacing={3}>
                No results for your search
              </Typography>
              <small>Try another term?</small>
            </CardWrapper>
          }
        </Grid>
        <Grid item xs={8}>
          <LotFeature
            currentFeature={id}
            feature={(i) => setId(i)}
            currentTab={view}
            setTab={(idx) => setView(idx)}

            query={queryString}
            profile={profile}
            refreshLots={refreshLots}
          />
        </Grid>
      </Grid>
    ) :
    <LoadingSpinner />;
};

export default LotDashboard;
