import React from 'react'
import {v4 as uuid} from "uuid";
import {
  List,
  ListSubheader,
  Grid
} from '@material-ui/core'
import { useFetchLocation, useFetchLocations } from '../../hooks/useFetch'
import LoadingSpinner from '../Spinner';
import CardWrapper from '../CardWrapper';
import LocList from './LocationList';


const LocationDashboard = ({id}) => {
  const [locations,locsLoading] = useFetchLocations(id?`?id=${id}`:"")
  const [featured, locLoading, setFeature] = useFetchLocation(id?id:null)
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
      <LocList 
        currentFeature={featured.id}
        feature={(id)=>setFeature(id)}
        key={uuid()} 
        locations={locations}
      />
    </List>
    </Grid>
    <Grid item xs={6}>
      <CardWrapper title={featured.name}>
        <span>        
          {featured.notes}
        </span>
      </CardWrapper>
    </Grid>
  </Grid>
  )
  :
  <LoadingSpinner />
}
 
export default LocationDashboard