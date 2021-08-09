import React,{
  // useContext
} from 'react'

import {
  useParams,
  // Redirect
} from 'react-router-dom';
import {
  Grid,
  Divider,
  Typography
} from '@material-ui/core'


// import AlertContext from '../context/AlertContext';
import { useFetchLots, useFetchLot } from '../hooks/useFetch'

import LoadingSpinner from './Spinner';
import SearchForm from '../forms/LotSearchForm';
import LotFeature from './LotFeature';
import CardWrapper from './CardWrapper';
import LotList from './LotList'

const LotDashboard = ({searchTerm}) => {
  const { featuredId } = useParams()
  // const {alerts,setAlerts} = useContext(AlertContext)

  const queryString = searchTerm?`?searchTerm=${searchTerm}`:""
  const [featured, lotLoading, setFeature] = useFetchLot(featuredId)
  const [lots,lotsLoading, search, setLots] = useFetchLots(queryString)

  // if (!lotsLoading &&!lotLoading && featuredId && featured.id===null) {
  //   setAlerts([...alerts,{severity:"error",msg:`That item (#${featuredId}) does not exist anymore. Contact us if you believe there is an error!`}])
  //   return <Redirect to={`/lots`}/>
  // }
  return (!lotsLoading && !lotLoading)?
  (<Grid 
      container 
      rowSpacing={3} 
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      justifyContent="center">
    <Grid item xs={12}>
      <SearchForm featuredId={featuredId} resetFeature={(i)=>setFeature(i)} searchLots={q=>search(q)}/>
    </Grid>
    <Divider spacing={4} />
    <Grid item xs={4}>
      {lots.length>0?
      <LotList 
        currentFeature={featured.id}
        setFeature={setFeature}
        lots={lots}
      /> 
      :
      <CardWrapper>
        <Typography spacing={3}>
          No results for your search
        </Typography> 
          <small>Try another term, or searching with location names</small>
        

      </CardWrapper>
      }
    </Grid>
    <Grid item xs={8}>
      <LotFeature setLots={setLots} setFeature={setFeature} item={featured} />
    </Grid>
  </Grid>
  )
  :
  <LoadingSpinner />
}
 
export default LotDashboard