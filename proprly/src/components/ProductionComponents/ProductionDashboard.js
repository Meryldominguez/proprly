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
  Typography,
} from '@material-ui/core';
import LoadingSpinner from '../Spinner';
import CardWrapper from '../CardWrapper';
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
          {productions.length > 0 ?
          <ProdList
            currentFeature={id}
            feature={(id) => setId(id)}
            productions={productions}
            search={search}
          /> :
          <CardWrapper>
            <Typography spacing={3}>
          No Productions returned!
            </Typography>
            <small>Make some, using the form to the right!</small>
          </CardWrapper>}
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
