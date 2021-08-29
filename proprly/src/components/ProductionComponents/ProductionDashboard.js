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


const ProductionDashboard = ({isActive, search, year}) => {
  const {profile, isLoading} = useContext(UserContext);
  const {featuredId} = useParams();
  const queryString = '';

  const [id, setId] = useState(featuredId);
  const [view, setView] = useState('1');

  const [productions, prodsLoading, newSearch, refreshProds] = useFetchProductions(queryString);
  return (!isLoading && !prodsLoading) ?
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
          />
        </Grid>
        <Grid item xs={9}>
          <ProdFeature
            currentFeature={id}
            currentTab={view}
            profile={profile}
            setTab={(idx)=> setView(idx)}
            setFeature={(i)=> setId(i)}
            refreshProds={refreshProds}
          />
        </Grid>
      </Grid>
    ) :
    <LoadingSpinner />;
};

export default ProductionDashboard;
