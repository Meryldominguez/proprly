import React,{
  useState
} from 'react';
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

import {
  Link
} from 'react-router-dom'

const LotDetail = ({item}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  console.log(item)
  return (
    <List>
      <Typography variant='subtitle1' >{item.description}</Typography>
      <ListItemButton component={Link} to={`/locations?id=${item.locId}`}>
          <ListItemText>Location</ListItemText>
          <ListItemText align="right">{item.location}</ListItemText>
      </ListItemButton>
      <ListItemButton>
        <ListItemText>Price</ListItemText>
        <ListItemText align="right">{item.price}</ListItemText>
      </ListItemButton>
      <ListItemButton>
        <ListItemText>Quantity</ListItemText>
        <ListItemText align="right">{item.quantity===null? "N/A": item.quantity}</ListItemText>
      </ListItemButton>
      {item.quantity &&
      <ListItemButton>
        <ListItemText>Available</ListItemText>
        <ListItemText align="right">{item.available}</ListItemText>
      </ListItemButton>
      }
      <ListItemButton disabled={item.active.length< 1 } onClick={handleClick}>
        <ListItemText align='right'>[{item.active.length} Active Productions]</ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
        <ListSubheader component="div" id="nested-list-subheader">
          <Grid container>
            <Grid item xs={6}>
              <Typography align='left'>Production Title</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align='right'>Quantity</Typography>
            </Grid>
          </Grid>
        </ListSubheader>  
          {item.active.map(prod=>(
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
              key={uuid()} 
              primaryTypographyProps={{
                noWrap:true
              }}
              >{prod.title}</ListItemText>
            <ListItemText
              align="right"
            >{prod.quantity?prod.quantity:"N/A"}</ListItemText>
            
          </ListItemButton>
            {prod.notes && 
            <List key={uuid()} dense disablePadding>
              <ListItemText align="left" secondary={prod.notes} />
            </List>}
          </>
            ))}
        </List>
      </Collapse>
    </ List>
  )
}
 
export default LotDetail