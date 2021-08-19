import React from 'react';
import {
  useHistory,
} from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import RedeemIcon from '@material-ui/icons/Redeem';
import { FixedSizeList } from 'react-window';

const LotList = ({ currentFeature, feature, lots }) => {
  const renderList = ({ index, style }) => (
    <>
      <SingleLot
        style={style}
        feature={feature}
        featured={currentFeature === lots[index].id}
        key={uuid()}
        item={lots[index]}
      />
    </>
  );
  return lots.length > 0 ? (
    <Box
      sx={{ bgcolor: 'background.paper' }}
    >
      <FixedSizeList
        height={700}
        itemSize={70}
        itemCount={lots.length}
        overscanCount={3}
      >
        {renderList}
      </FixedSizeList>
    </Box>
  ) : (
    <Box
      sx={{ bgcolor: 'background.paper' }}
    />
  );
};

const SingleLot = ({
  featured, feature, item, style,
}) => {
  const history = useHistory();

  const handleFeature = (evt) => {
    console.log(item.id);
    evt.preventDefault();
    feature(item.id);
    history.push(`/lots/${item.id}`);
  };
  return (
    <ListItem component="div" style={style} disablePadding>
      <ListItemButton
        onClick={handleFeature}
        sx={{ pl: 4 }}
        disabled={featured}
        selected={featured}
      >
        <ListItemIcon>
          <RedeemIcon />
        </ListItemIcon>
        <ListItemText primary={item.name} secondary={item.location} />
      </ListItemButton>
    </ListItem>
  );
};

export default LotList;
