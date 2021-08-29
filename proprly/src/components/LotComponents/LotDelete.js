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

const LotDelete = ({
  refreshLots, refreshFeature, item, query,
}) => {
  const {setAlerts} = useContext(AlertContext);
  const history = useHistory();

  const handleClick = async (evt) => {
    evt.preventDefault();
    try {
      await ProprlyApi.deleteLot(item.id);
      query ?
        history.push(`/lots/?${query}`) :
        history.push('/lots');
      refreshFeature();
      refreshLots();
      setAlerts([{variant: 'success', msg: `Item #${item.id} has been deleted`}]);
    } catch (err) {
      console.log(err);
      setAlerts([...err.map((e) => e = {severity: e.severity || 'error', msg: e.msg})]);
    }
  };

  return (
    <CardWrapper title={item.name} >
      <Grid style={{height: '100%'}} justifyContent="center" container>
        <Grid item>
          <Button
            onClick={handleClick}
            variant="contained"
            color="secondary"
          >
          Permanently Delete this item?
          </Button>
        </Grid>
      </Grid>
    </CardWrapper>
  );
};

export default LotDelete;
