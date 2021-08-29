import React, {
  useState,
} from 'react';
import {
  Link,
} from 'react-router-dom';
import {
  FixedSizeList,
} from 'react-window';

import {v4 as uuid} from 'uuid';
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Button,
  ListItem,
} from '@material-ui/core';
import {
  ExpandMore,
  ExpandLess,
} from '@material-ui/icons';
import CardWrapper from '../CardWrapper';

const ProductionDetail = ({production}) => {
  const [openProps, setOpenProps] = useState(false);
  const [openNotes, setOpenNotes] = useState(true);
  const handleClickItems = () => {
    setOpenProps(!openProps);
  };
  const handleClickNotes = () => {
    setOpenNotes(!openNotes);
  };
  return (
    <CardWrapper title={production.title} >
      <List>
        {production.notes ?(
        <>
          <Collapse in={!openNotes} timeout="auto" collapsedSize={30}>
            <ListItemText
              onClick={handleClickNotes}
              variant='subtitle1'
              primary={production.notes}
              primaryTypographyProps={{
                noWrap: openNotes,
                px: 4,
              }}
            />
          </Collapse>
          {production.id &&
          <ListItemText
            onClick={handleClickNotes}
            primary={openNotes ? <ExpandLess /> : <ExpandMore />}
          />}
        </>
        ) :
        (
          <Typography
            width="100%"
            variant="subtitle1"
          >
            No Notes for this Location
          </Typography>
        )}
        {production.id && <ListItemButton>
          <ListItemText primary="Dates" />
          <ListItemText align="right">
            {production.dateStart ?
            new Date(production.dateStart).toDateString() : 'N/A'}
            {' - '}
            {production.dateEnd ?
            new Date(production.dateEnd).toDateString() : 'N/A' }
          </ListItemText>
        </ListItemButton>}
        {production.id && <>
          <ListItem>
            <Button
              component={Link}
              to={`/props/${production.id}`}
            >
                Manage Props
            </Button>
            <ListItemButton disabled={production.props.length < 1} onClick={handleClickItems}>
              <ListItemText
                align="right"
              >
                [{production.props.length}{' '} Props]
              </ListItemText>
              {openProps ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openProps} timeout="auto">
            <PropList items={production.props} />
          </Collapse>
        </>}
      </List>
    </CardWrapper>
  );
};
const PropList = ({items}) => {
  const renderList = ({index, style}) => (
    <ListItemButton
      style={style}
      component={Link}
      to={`/lots/${items[index].id}`}
      key={uuid()}
    >
      <ListItemText
        align="left"
        secondaryTypographyProps={{
          noWrap: true,
        }}
        primary={items[index].name}
        secondary={items[index].notes ? items[index].notes : 'No notes on this prop'}
      />
      <ListItemText
        align="right"
        primary={`Quantity: ${items[index].quantity ? items[index].quantity : 'N/A'}`}
      />
    </ListItemButton>
  );
  return (
    <Box
      sx={{bgcolor: 'background.paper'}}
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
  );
};

export default ProductionDetail;
