import React,{
  useState
} from 'react'
import {
  useHistory
} from 'react-router-dom';
import {v4 as uuid} from "uuid";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@material-ui/core'
import {
  ExpandMore,
  ExpandLess
} from '@material-ui/icons'

import ArrowIcon from '@material-ui/icons/SubdirectoryArrowRight';



const LocList = ({currentFeature,feature,locations,setView, defaultDepth=0, color="secondary",step=7})=>{ 
  const nextDepth = defaultDepth + step
  const [openId, setOpenId] = useState(null)

  const handleOpen = (id)=>{
    console.log(id, openId, "handle open")
    return id===openId?
      setOpenId(null)
      :
      setOpenId(id)
  }
  return (
    <List
      style={{ 
        marginLeft: defaultDepth === 0 ? 0 : nextDepth}}
      sx={{
        backgroundColor:`divider`
      }}
      disablePadding
      dense
    >
  {locations.map(loc=> (
    <>
      <SingleLoc 
        key={uuid()} 
        featured={currentFeature===loc.locationId} 
        feature={feature} 
        setView={setView}
        loc={loc}
        open={(id)=>handleOpen(id)}
        openId={openId}
      />
        {loc.children && 
        <Collapse in={openId===loc.locationId} timeout="auto">
        <LocList 
          color={color==="secondary"?"disabled":"secondary"}
          currentFeature={currentFeature}
          feature={feature} 
          locations={loc.children}
          defaultDepth={nextDepth}
        />
        </Collapse>
      }
    </>
  ))}
    </List>)
}

const SingleLoc = ({featured,feature,loc,setView, openId, open})=>{
  const history=useHistory()

  const handleFeature = (evt)=>{
    evt.preventDefault()
    feature(loc.locationId)
    history.push(`/locations/${loc.locationId}`)
  }
  return (
    <ListItem>
  <ListItemButton 
    disabled={featured}
    onClick={handleFeature}>
    <ListItemIcon   >
      <ArrowIcon />
    </ListItemIcon>
    <ListItemText primary={loc.locationName} />
    </ListItemButton>
   {loc.children && 
   <ListItemIcon 
      disabled={false}
      align='right' 
      onClick={()=>open(loc.locationId)}>
      {`[${loc.children.length}]`}
      {loc.locationId===openId? <ExpandLess /> :<ExpandMore />}
    </ListItemIcon>}
  </ListItem>

  )
}

export default LocList