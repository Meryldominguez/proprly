import React from 'react'
import {
  useParams,
  // Redirect
} from 'react-router-dom';
import {v4 as uuid} from "uuid";
import {
  List,
  ListSubheader,
  Grid,
  Typography
} from '@material-ui/core'
import { useFetchLocation, useFetchLocations } from '../../hooks/useFetch'
import LoadingSpinner from '../Spinner';
import CardWrapper from '../CardWrapper';
import LocList from './LocationList';
import LocFeature from './ProductionFeature';


const LocationDashboard = ({id}) => {
  const { featuredId } = useParams()
  const queryString = id?`?id=${id}`:""

  const [locations,locsLoading, setLocs] = useFetchLocations(queryString)
  const [featured, locLoading, setFeature] = useFetchLocation(featuredId?featuredId:null)
  console.log(locations,featured)

  return (!locsLoading && !locLoading && locations)?
  (<Grid 
    container 
    rowSpacing={3} 
    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    justifyContent="center"
    >
    <Grid item xs={6}>
      <List
        sx={{ border:'1',  width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Locations
        </ListSubheader>
        }
      >
      {locations.length>0?
      <LocList 
        currentFeature={featured.id}
        feature={(id)=>setFeature(id)}
        locations={locations}
      />
      :
      <CardWrapper>
        <Typography spacing={3}>
          No results for your search
        </Typography> 
      </CardWrapper>
      }
    </List>
    </Grid>
    <Grid item xs={6}>
      <LocFeature 
        location={featured}
        query={queryString}
        setFeature={setFeature} 
        setLocs={setLocs} 
         />
    </Grid>
  </Grid>
  )
  :
  <LoadingSpinner />
}
 
export default LocationDashboard