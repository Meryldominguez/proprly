import React, {
  useState,
  useContext,
} from 'react';
import UserContext from '../../context/UserContext';
import {
  useParams,
} from 'react-router-dom';
import {
  Grid,
} from '@material-ui/core';
import LoadingSpinner from '../Spinner';
import ProdList from './ProductionList';
import ProdFeature from './ProductionFeature';
import {useFetchProductions} from '../../hooks/useFetch';


const ProductionDashboard = ({isActive, searchTerms, year}) => {
  const {profile, isLoading} = useContext(UserContext);
  const {featuredId} = useParams();

  const queryString = '';

  const [view, setView] = useState('1');
  const [id, setId] = useState(featuredId);

  const [productions, prodsLoading, search, refreshProds] = useFetchProductions(queryString);

  return (!isLoading && !prodsLoading && profile) ?
    (
      <Grid
        container
        rowSpacing={3}
        columnSpacing={{xs: 1, sm: 2, md: 3}}
        justifyContent="center"
      >
        <Grid item xs={3}>
          <ProdList
            currentFeature={id}
            feature={(id) => setId(id)}
            productions={productions}
            search={search}
          />
        </Grid>
        <Grid item xs={9}>
          <ProdFeature
            currentFeature={id}
            feature={(i)=> setId(i)}
            currentTab={view}
            setTab={(idx)=> setView(idx)}
            profile={profile}
            refreshProds={refreshProds}
          />
        </Grid>
      </Grid>
    ) :
    <LoadingSpinner />;
};

export default ProductionDashboard;
