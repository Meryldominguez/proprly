import React from 'react'
import {v4 as uuid} from "uuid";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import RoomIcon from '@material-ui/icons/Room';



const LocationListWrapper = ({locations})=> { 

return (
  <>
  {locations.forEach(item=>(
  <>
    <ListItemButton sx={{ pl: 4 }}>
        <ListItemIcon>
          <RoomIcon />
        </ListItemIcon>
        <ListItemText primary={item.locationName} />
    </ListItemButton>
      { item.children && 
      <List key={uuid()} component="div" disablePadding>
        <LocationListWrapper key={uuid()} location={item.children} />
      </List>}
  </>
  ))
  }
 </>
)}

export default LocationListWrapper