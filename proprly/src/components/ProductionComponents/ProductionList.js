import React from 'react';
import {
  useHistory,
} from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,

} from '@material-ui/core';
// import RoomIcon from '@material-ui/icons/Room';
import ArrowIcon from '@material-ui/icons/SubdirectoryArrowRight';
import {FixedSizeList} from 'react-window';

const ProductionList = ({currentFeature, feature, productions}) => {
  const renderList = ({index, style}) => (
    <SingleProd
      style={style}
      key={uuid()}
      featured={currentFeature === productions[index].id}
      feature={feature}
      prod={productions[index]}
    />
  );

  return productions.length > 0 ? (
    <Box
      sx={{bgcolor: 'background.paper'}}
    >
      <FixedSizeList
        height={700}
        itemSize={80}
        itemCount={productions.length}
        overscanCount={3}
      >
        {renderList}
      </FixedSizeList>
    </Box>
  ) : (
    <Box
      sx={{bgcolor: 'background.paper'}}
    />
  );
};

const SingleProd = ({
  featured, feature, prod, style,
}) => {
  const history = useHistory();

  const handleFeature = (evt) => {
    console.log(prod);
    evt.preventDefault();
    feature(prod.id);
    history.push(`/productions/${prod.id}`);
  };
  return (
    <ListItemButton
      style={style}
      onClick={handleFeature}
      sx={{pl: 1}}
      disabled={featured}
    >
      <ListItemIcon>
        <ArrowIcon />
      </ListItemIcon>
      <ListItemText
        primaryTypographyProps={{
          noWrap: true,
        }}
        primary={prod.title}
        secondary={
          `${prod.dateEnd ?
            new Date(prod.dateEnd).getFullYear() :
            'N/A'} ${prod.active ? '[ACTIVE]' : ''}`
        }
      />
    </ListItemButton>

  );
};

export default ProductionList;
