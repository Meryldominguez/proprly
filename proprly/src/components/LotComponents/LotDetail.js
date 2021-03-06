import React, {
  useState,
  Fragment,
} from 'react';
import {v4 as uuid} from 'uuid';
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  ListSubheader,
  Typography,
  Grid,
} from '@material-ui/core';
import {
  ExpandMore,
  ExpandLess,
} from '@material-ui/icons';

import {
  Link,
} from 'react-router-dom';
import CardWrapper from '../CardWrapper';

const LotDetail = ({item}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <CardWrapper title={item.name}>
      <List>
        <Typography variant="subtitle1">{item.description}</Typography>
        {item.id && (
          <>
            <ListItemButton component={Link} to={`/locations/${item.locId}`}>
              <ListItemText>Location</ListItemText>
              <ListItemText align="right">{item.location}</ListItemText>
            </ListItemButton>
            <ListItemButton>
              <ListItemText>Price</ListItemText>
              <ListItemText align="right">{item.price || 'N/A'}</ListItemText>
            </ListItemButton>
            <ListItemButton>
              <ListItemText>Quantity</ListItemText>
              <ListItemText align="right">{item.quantity || 'N/A'}</ListItemText>
            </ListItemButton>
            {item.quantity &&
      (
        <ListItemButton>
          <ListItemText>Available</ListItemText>
          <ListItemText align="right">{item.available}</ListItemText>
        </ListItemButton>
      )}
            <ListItemButton disabled={item.active.length < 1} onClick={handleClick}>
              <ListItemText align="right">
              [
                {item.active.length}
                {' '}
              Active Productions]
              </ListItemText>
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListSubheader component="div" id="nested-list-subheader">
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography align="left">Production Title</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">Quantity</Typography>
                    </Grid>
                  </Grid>
                </ListSubheader>
                {item.active.map((prod) => (
                  <Fragment key={uuid()}>
                    <ListItemButton
                      component={Link}
                      to={`/productions/${prod.id}`}
                      key={uuid()}
                      sx={{pl: 4}}
                    >
                      <ListItemText
                        style={{flex: 1}}
                        align="left"
                        key={uuid()}
                        primaryTypographyProps={{
                          noWrap: true,
                        }}
                      >
                        {prod.title}
                      </ListItemText>
                      <ListItemText
                        align="right"
                        key={uuid()}
                      >
                        {prod.quantity ? prod.quantity : 'N/A'}
                      </ListItemText>

                    </ListItemButton>
                    {prod.notes &&
            (
              <List key={uuid()} dense disablePadding>
                <ListItemText align="left" secondary={prod.notes} />
              </List>
            )}
                  </Fragment>
                ))}
              </List>
            </Collapse>
          </>
        )}
      </List>
    </CardWrapper>
  );
};

export default LotDetail;
