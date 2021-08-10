import React from 'react'
// import {v4 as uuid} from "uuid";
import {
  // Box,
  // List,

  // ListItemButton,
  // ListItemIcon,
  // ListItemText,
  // Divider,
  Grid
} from '@material-ui/core'
// import RoomIcon from '@material-ui/icons/Room';
import { useFetchLocation } from '../../hooks/useFetch'
import LoadingSpinner from '../Spinner';
import CardWrapper from '../CardWrapper';


// const LocList = ({currentFeature,feature,locations})=>{ 
// return (
//   <>
//   {locations.map(item=> item['children']? 
//   (<>
//     <SingleLoc featured={currentFeature===item.locationId} feature={feature} key={uuid()} item={item} />
//     <Divider />
//       <List key={uuid()} component="div" disablePadding>
//         {LocList({currentFeature,feature,locations:item.children})} 
//       </List>
//     <Divider />
//     </>
//   )
//   : 
//   (<SingleLoc featured={currentFeature===item.locationId} feature={feature} key={uuid()} item={item}/>)
//   )}
// </>
// )}

// const SingleLoc = ({featured,feature,item})=>{

//   const handleFeature = (evt)=>{
//     evt.preventDefault()
//     if (!featured ) feature(item.locationId)
//   }
  
//   console.log(feature)
//     return (
//       <ListItemButton
//         onClick={handleFeature}
//         sx={{ pl: 4 }}>
//         <ListItemIcon>
//           <RoomIcon />
//         </ListItemIcon>
//         <ListItemText primary={item.locationName} />
//       </ListItemButton>
//     )
//   }

const LocationDetail = ({id}) => {
  const [featured, locLoading, setFeature] = useFetchLocation(id?id:null)
  return (!locLoading && featured)?
  (<Grid>
      <CardWrapper title={featured.name}>
        <span>        
          {featured.notes}
        </span>
      </CardWrapper>
    </Grid>
  )
  :
  <LoadingSpinner />
}
 
export default LocationDetail