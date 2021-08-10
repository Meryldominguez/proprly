import React from 'react'
import {v4 as uuid} from "uuid";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  
} from '@material-ui/core'
import RoomIcon from '@material-ui/icons/Room';



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

export default LocList