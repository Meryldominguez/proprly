import React,{
  useState
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

const LocationDetail = ({location}) => {
  const [openItems, setOpenitems] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const handleClickItems = () => {
    setOpenitems(!openItems);
  };
  const handleClickNotes = () => {
    setOpenNotes(!openNotes);
  };
  console.log(location)
  return (
    <List>
      {location.notes?
      <Collapse in={!openNotes} timeout="auto" collapsedSize={60}>
        <Grid container onClick={handleClickNotes}>
          <Grid item xs={12}>
            <Typography 
              width="100%"
              noWrap={openNotes}
              variant='subtitle1'
            >
              {location.notes}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {openNotes ? <ExpandLess /> : <ExpandMore/>}
          </Grid>
        </Grid>
      </Collapse>
      :
      <Typography 
      width="100%"
      variant='subtitle1'
      >
        No Notes for this Location
      </Typography>
      }
      <ListItemButton disabled={location.items.length< 1 } onClick={handleClickItems}>
        <ListItemText align='right'>[{location.items.length} Items]</ListItemText>
        {openItems ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openItems} timeout="auto" >
        <ItemList items={location.items} />
      </Collapse>
    </ List>
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
      secondaryTypographyProps={{
        noWrap:true,
        width:"80%"
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