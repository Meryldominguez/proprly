import React from 'react'
import {
  useHistory
} from 'react-router-dom';
import {v4 as uuid} from "uuid";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  
} from '@material-ui/core'
// import RoomIcon from '@material-ui/icons/Room';
import ArrowIcon from '@material-ui/icons/SubdirectoryArrowRight';



const LocList = ({currentFeature,feature,locations, defaultDepth=0, color= "primary",step=7})=>{ 
  const nextDepth = defaultDepth + step
  return (
    <List
      style={{ marginLeft: defaultDepth === 0 ? 0 : nextDepth, border:"1px black solid",bgcolor:color }}
      disablePadding
      dense
    >
  {locations.map(loc=> (
    <>
      <SingleLoc 
        key={uuid()} 
        featured={currentFeature===loc.locationId} 
        feature={feature} 
        loc={loc} 
      />
        {loc.children && 
        <LocList 
          color={color==="primary"?"secondary":"primary"}
          feature={feature} 
          locations={loc.children}
          defaultDepth={nextDepth}
        />}
    </>
  ))}
    </List>)
}

const SingleLoc = ({featured,feature,loc})=>{
  const history=useHistory()

  const handleFeature = (evt)=>{
    console.log(loc)
    evt.preventDefault()
    feature(loc.locationId)
    history.push(`/locations/${loc.locationId}`)
  }
  return (

  <ListItemButton
    onClick={handleFeature}
    sx={{ pl: 4 }}
    disabled={featured}>
    <ListItemIcon>
      <ArrowIcon />
    </ListItemIcon>
    <ListItemText primary={loc.locationName} />
  </ListItemButton>

  )
}

export default LocList