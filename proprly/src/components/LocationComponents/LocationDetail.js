import React,{
  useState,
  useRef,
  useEffect
} from 'react'
import {
  Link
} from 'react-router-dom'
import {
  FixedSizeList
} from 'react-window'

import {v4 as uuid} from "uuid";
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Grid
} from '@material-ui/core'
import {
  ExpandMore,
  ExpandLess
} from '@material-ui/icons'
import CardWrapper from '../CardWrapper';

const LocationDetail = ({location}) => {
  // const notesRef = useRef()
  const [openItems, setOpenitems] = useState(false);
  const [openNotes, setOpenNotes] = useState(true);

  // const dropdownButton = () => {
  //   if (notesRef.current){
  //     return notesRef.current.scrollWidth > notesRef.current.clientWidth
  //   }
  //   return false
  // };

  // const [notesButton, setNotesButton] = useState(dropdownButton())
  
  const handleClickItems = () => {
    setOpenitems(!openItems);
  };
  const handleClickNotes = () => {
    setOpenNotes(!openNotes);
  };

  return (
    <CardWrapper title={location.name}>
    <List>
      {location.notes?
      <>
      <Collapse in={!openNotes} timeout="auto" collapsedSize={30}>
        <ListItemText
          onClick={handleClickNotes}
          variant='subtitle1'
          primary={location.notes}
          primaryTypographyProps={{
            // ref:notesRef,
            noWrap:openNotes,
            px:3
          }} 
        />
      </Collapse>
      <ListItemText
        onClick={handleClickNotes}
        primary={openNotes ? <ExpandLess /> : <ExpandMore/>} 
      />
      </>
      :
      <Typography 
        variant='subtitle1'
        paddingBottom={3} >
      No Notes for this Location.
      </Typography>
      }
      {location['items'] && (
      <>
      <ListItemButton disabled={location.items.length< 1 } onClick={handleClickItems}>
        <ListItemText align='right'>[{location.items.length} Items]</ListItemText>
        {openItems ? <ExpandMore />:<ExpandLess /> }
      </ListItemButton>
      <Collapse in={openItems} timeout="auto" >
        <ItemList items={location.items} />
      </Collapse>
      </>
      )}
    </ List>
    </CardWrapper>
  )
}
const ItemList= ({items}) =>{
  const renderList = ({index,style})=>{
  return (
    <ListItemButton 
    style={style}
    component={Link} 
    to={`/lots/${items[index].id}`}
    key={uuid()} 
  >
    <ListItemText
      align="left"
      sx={{width:"80%"}}
      secondaryTypographyProps={{
        noWrap:true,
        maxWidth:"75%"
      }}
      primaryTypographyProps={{
        maxWidth:"75%"
      }}
      primary={items[index].name}
      secondary={items[index].description}
    />
    <ListItemText
      align="right"
      primaryTypographyProps={{
        minWidth:'100%'
      }}
      primary={items[index].location}
    />
  </ListItemButton>
  )
}
  return (
    <Box
      sx={{ bgcolor: 'background.paper' }}
    >
        <FixedSizeList
          height={400}
          itemSize={60}
          itemCount={items.length}
          overscanCount={3}
        >
          {renderList}
        </FixedSizeList>
    </Box>
  )
}
 
export default LocationDetail