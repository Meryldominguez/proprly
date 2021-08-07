import React from 'react'
import {v4 as uuid} from "uuid";
import {
  Box,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@material-ui/core'
import RoomIcon from '@material-ui/icons/Room';
import { useFetchLocations } from '../hooks/useFetch'
import LoadingSpinner from './Spinner';
import stringify from 'fast-json-stable-stringify';



const LocList = ({locations})=>{ 

  const SingleLoc = ({item})=>{
    return (
      <ListItemButton 
        sx={{ pl: 4 }}>
        <ListItemIcon>
          <RoomIcon />
        </ListItemIcon>
        <ListItemText primary={item.locationName} />
      </ListItemButton>
    )
  }

return (
  <>
  {locations.map(item=> item['children']? 
  (<>
    <SingleLoc key={uuid()} item={item} />
    <Divider />
      <List key={uuid()} component="div" disablePadding>
        <LocList locations={item.children} /> 
      </List>
    <Divider />
    </>
  )
  : 
  (<SingleLoc  key={uuid()} item={item}/>)
  )}
</>
)}



const LocationDashboard = ({id}) => {
  const [locations,isLoading] = useFetchLocations(id?`?id=${id}`:"")
  return (!isLoading && locations)?
  (
    <Box xs={6}>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Locations
        </ListSubheader>
        }
      >
      <LocList key={uuid()} locations={locations}/>
    </List>


    </Box>
  )
  :
  <LoadingSpinner />
}
 
export default LocationDashboard