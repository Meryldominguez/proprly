import React, {
  useState,
  Fragment,
} from 'react';
import {
  useHistory,
} from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@material-ui/core';
import {
  ExpandMore,
  ExpandLess,
} from '@material-ui/icons';

import ArrowIcon from '@material-ui/icons/SubdirectoryArrowRight';
import LoadingSpinner from '../Spinner';

const RecursiveList = ({
  locations, currentFeature, feature, color = 'secondary', defaultDepth = 0, step = 7,
}) => {
  const nextDepth = defaultDepth + step;
  const [openId, setOpenId] = useState(null);

  const handleOpen = (id) => {
    console.log(id, openId, 'handle open');
    return id === openId ?
      setOpenId(null) :
      setOpenId(id);
  };
  return (
    <List
      style={{marginLeft: defaultDepth === 0 ? 0 : nextDepth}}
      sx={{
        backgroundColor: 'divider',
      }}
      key={uuid()}
      disablePadding
      dense
    >
      {locations.map((loc) => (
        <Fragment key={uuid()}>
          <SingleLoc
            featured={currentFeature === loc.locationId}
            feature={feature}
            loc={loc}
            open={(id) => handleOpen(id)}
            openId={openId}
          />
          {loc.children &&
        (
          <Collapse
            key={uuid()}
            in={openId === loc.locationId}
            timeout="auto"
          >
            <RecursiveList
              key={uuid()}
              color={color === 'secondary' ? 'disabled' : 'secondary'}
              currentFeature={currentFeature}
              feature={feature}
              locations={loc.children}
              defaultDepth={nextDepth}
            />
          </Collapse>
        )}
        </Fragment>
      ))}
    </List>
  );
};

const SingleLoc = ({
  featured, feature, loc, openId, open,
}) => {
  const history = useHistory();

  const handleFeature = (evt) => {
    evt.preventDefault();
    feature(loc.locationId);
    history.push(`/locations/${loc.locationId}`);
  };
  return (
    <ListItem
      key={uuid()}
    >
      <ListItemButton
        disabled={featured}
        onClick={handleFeature}
      >
        <ListItemIcon>
          <ArrowIcon />
        </ListItemIcon>
        <ListItemText primary={loc.locationName} />
      </ListItemButton>
      {loc.children &&
   (
     <ListItemIcon
       disabled={false}
       align="right"
       onClick={() => open(loc.locationId)}
     >
       {`[${loc.children.length}]`}
       {loc.locationId === openId ? <ExpandLess /> : <ExpandMore />}
     </ListItemIcon>
   )}
    </ListItem>

  );
};

const LocList = ({
  locations, isLoading, currentFeature, feature,
}) => (!isLoading ?
  (
    <RecursiveList
      isLoading={isLoading}
      locations={locations}
      currentFeature={currentFeature}
      feature={feature}
    />
  ) :
  <LoadingSpinner />);
export default LocList;
