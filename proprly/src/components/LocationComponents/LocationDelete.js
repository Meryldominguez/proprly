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

const LocationDelete = ({setFeature, location, refreshLocs}) => {
  const {setAlerts} = useContext(AlertContext);
  const history = useHistory();

  const handleClick = async (evt) => {
    evt.preventDefault();
    try {
      const resp = await ProprlyApi.deleteLoc(location.id);
      console.log(resp);
      history.push('/locations');
      setFeature();
      refreshLocs();
      setAlerts([{variant: 'success', msg: `Locatiion #${location.id} has been deleted`}]);
    } catch (err) {
      setAlerts([...err.map((e) => e = {severity: e.severity || 'error', msg: e.msg})]);
    }
  };

  return (
    <CardWrapper title={location.name}>
      <Grid style={{height: '100%'}} justifyContent="center" container>
        <Grid item>
          <Button
            onClick={handleClick}
            variant="contained"
            color="secondary"
          >
            Permanently Delete this Location and all the Items in it?
          </Button>
        </Grid>
      </Grid>
    </CardWrapper>
  );
};

export default LocationDelete;
