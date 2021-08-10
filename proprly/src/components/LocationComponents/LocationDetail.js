import React,{
  useState
} from 'react'
import {
  Link
} from 'react-router-dom'

import {v4 as uuid} from "uuid";
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  ListSubheader,
  Typography,
  Grid
} from '@material-ui/core'
import {
  ExpandMore,
  ExpandLess
} from '@material-ui/icons'

const LocationDetail = ({loc}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  console.log(loc)
  return (
    <List>
      <Typography variant='subtitle1' >{loc.description}</Typography>
      <ListItemButton component={Link} to={`/locations?id=${loc.locId}`}>
          <ListItemText>Location</ListItemText>
          <ListItemText align="right">{loc.location}</ListItemText>
      </ListItemButton>
      {loc.price && 
      <ListItemButton>
        <ListItemText>Price</ListItemText>
        <ListItemText align="right">{loc.price}</ListItemText>
      </ListItemButton>
      }
      <ListItemButton>
        <ListItemText>Quantity</ListItemText>
        <ListItemText align="right">{loc.quantity===null? "N/A": loc.quantity}</ListItemText>
      </ListItemButton>
      {loc.quantity &&
      <ListItemButton>
        <ListItemText>Available</ListItemText>
        <ListItemText align="right">{loc.available}</ListItemText>
      </ListItemButton>
      }
      <ListItemButton disabled={loc.active.length< 1 } onClick={handleClick}>
        <ListItemText align='right'>[{loc.active.length} Active Productions]</ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        <ListSubheader component="div" id="nested-list-subheader">
          <Grid container>
            <Grid loc xs={6}>
              <Typography align='left'>Production Title</Typography>
            </Grid>
            <Grid loc xs={6}>
              <Typography align='right'>Quantity</Typography>
            </Grid>
          </Grid>
        </ListSubheader>  
          {loc.active.map(prod=>(
            <>
          <ListItemButton 
            component={Link} 
            to={`productions/${prod.id}`}
            key={uuid()} 
            sx={{ pl: 4 }}
          >
            <ListItemText 
              style={{ flex: 1 }} 
              align="left" 
              primaryTypographyProps={{
                noWrap:true
              }}
              >{prod.title}</ListItemText>
            <ListItemText
              align="right"
            >{prod.quantity?prod.quantity:"N/A"}</ListItemText>
            
          </ListItemButton>
            {prod.notes && 
            <List dense disablePadding>
              <ListItemText align="left" secondary={prod.notes} />
            </List>}
          </>
            ))}
        </List>
      </Collapse>
    </ List>
  )
}
 
export default LocationDetail