import React from 'react'
import {v4 as uuid} from "uuid";
import {
  Box,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid
} from '@material-ui/core'
import RoomIcon from '@material-ui/icons/Room';
import { useFetchLocation, useFetchLocations } from '../hooks/useFetch'
import LoadingSpinner from './Spinner';
import CardWrapper from './CardWrapper';


const LocList = ({currentFeature,feature,locations})=>{ 
return (
  <>
  {locations.map(item=> item['children']? 
  (<>
    <SingleLoc featured={currentFeature===item.locationId} feature={feature} key={uuid()} item={item} />
    <Divider />
      <List key={uuid()} component="div" disablePadding>
        {LocList({currentFeature,feature,locations:item.children})} 
      </List>
    <Divider />
    </>
  )
  : 
  (<SingleLoc featured={currentFeature===item.locationId} feature={feature} key={uuid()} item={item}/>)
  )}
</>
)}

const SingleLoc = ({featured,feature,item})=>{

  const handleFeature = (evt)=>{
    evt.preventDefault()
    if (!featured ) feature(item.locationId)
  }
  return (
  <ListItemButton
    onClick={handleFeature}
    sx={{ pl: 4 }}
    disabled={featured}>
    <ListItemIcon>
      <RoomIcon />
    </ListItemIcon>
    <ListItemText primary={item.locationName} />
  </ListItemButton>
  )
}

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