import React, {
  useEffect,
} from 'react';

import {
  Grid,
} from '@material-ui/core';
import LoadingSpinner from '../Spinner';
import PropList from './PropList';
import {useFetchLots, useFetchProduction} from '../../hooks/useFetch';
import LotList from '../LotComponents/LotList';
import ProprlyApi from '../../api';


function idIndexOf(item, list) {
  const [res]=list.filter((i, idx)=>{
    if (i.id===item.id) {
      i.idx=idx;
      return i;
    }
  });
  if (!res) return -1;
  return res.idx;
}

const PropManager = ({prodId}) => {
  const [lots, lotsLoading] = useFetchLots();
  const [prod, prodLoading, refreshProd] = useFetchProduction(prodId);
  const handleAddProp = async (lotId)=>{
    await ProprlyApi.newProp({lotId, prodId});
    refreshProd(prodId);
  };
  useEffect(()=>{}, []);

  return !lotsLoading && !prodLoading? (
  <Grid
    container
    rowSpacing={3}
    columnSpacing={{xs: 1, sm: 2, md: 3}}
    justifyContent="center"
  >
    <Grid item xs={4}>
      <LotList
        lots={lots.filter((item)=>idIndexOf(item, prod.props)===-1)}
        feature={(id)=>handleAddProp(id)}
      />
    </Grid>
    <Grid item xs={8}>
      <PropList
        refreshProd={refreshProd}
        props={prod.props}
        prod={prod} />
    </Grid>
  </Grid>
  ) : <LoadingSpinner />;
};

export default PropManager;
