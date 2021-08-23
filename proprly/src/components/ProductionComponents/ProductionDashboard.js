import React, {
  useState,
} from 'react';
import {
  useParams,
  // Redirect
} from 'react-router-dom';
import {
  List,
  ListSubheader,
  Grid,
  Typography,
} from '@material-ui/core';
import LoadingSpinner from '../Spinner';
import TabBar from '../TabBar';
import CardWrapper from '../CardWrapper';
import ProdList from './ProductionList';
import ProdFeature from './ProductionFeature';
import {useFetchProduction, useFetchProductions} from '../../hooks/useFetch';
import ProdNewForm from '../../forms/ProductionNewForm';

const ProductionDashboard = ({isActive, search, year}) => {
  const {featuredId} = useParams();
  const queryString = '';
  const [currentTab, setCurrentTab] = useState(featuredId ? '1' : '0');

  const [productions, prodsLoading, setProds] = useFetchProductions(queryString);
  const [featured, prodLoading, setFeature] = useFetchProduction(featuredId);

  return (!prodsLoading && !prodLoading && productions) ?
    (
      <Grid
        container
        rowSpacing={3}
        columnSpacing={{xs: 1, sm: 2, md: 3}}
        justifyContent="center"
      >
        <Grid item xs={3}>
          <List
            sx={{border: '1', width: '100%', bgcolor: 'background.paper'}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={(
              <ListSubheader component="div" id="nested-list-subheader">
                Productions
              </ListSubheader>
            )}
          >
            {productions.length > 0 ?
              (
                <ProdList
                  currentFeature={featured.id}
                  feature={(id) => setFeature(id)}
                  productions={productions}
                />
              ) :
              (
                <CardWrapper>
                  <Typography spacing={3}>
                    No results for your search
                  </Typography>
                </CardWrapper>
              )}
          </List>
        </Grid>
        <Grid item xs={9}>
          <ProdFeature
            production={featured}
            query={queryString}
            setFeature={setFeature}
            setProds={setProds}
            setView={(i) => setCurrentTab(i)}
          />
        </Grid>
      </Grid>
    ) :
    <LoadingSpinner />;
};

export default ProductionDashboard;
