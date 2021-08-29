import React, {
  useContext,
} from 'react';
import {
  useHistory,
} from 'react-router-dom';
import {
  Grid,
  Button,
} from '@material-ui/core';
import AlertContext from '../../context/AlertContext';
import ProprlyApi from '../../api';
import CardWrapper from '../CardWrapper';

const LocationDelete = ({
  refreshFeature, refreshLocs, location,
}) => {
  const {setAlerts} = useContext(AlertContext);
  const history = useHistory();

  const handleClick = async (evt) => {
    evt.preventDefault();
    try {
      await ProprlyApi.deleteLoc(location.id);
      history.push('/locations');
      refreshFeature();
      refreshLocs();
      setAlerts([{variant: 'success', msg: `Location "${location.name}" has been deleted`}]);
    } catch (err) {
      console.log(err);
      setAlerts([...err.map((e) => e = {severity: e.severity || 'error', msg: e.msg})]);
    }
  };

  return (
    <CardWrapper title={location.name}>
      <Grid style={{height: '100%'}} justifyContent="center" container>
        <Grid item>
          <Button
            onClick={handleClick}
            variant='contained'
            color="secondary">
            Permanently Delete this Location and all the Items in it?
          </Button>
        </Grid>
      </Grid>
    </CardWrapper>
  );
};

export default LocationDelete;
