import React, {
  useContext,
} from 'react';
import {
  useHistory,
} from 'react-router-dom';
import {
  Grid,
  Button,
  Alert,
  AlertTitle,
} from '@material-ui/core';
import AlertContext from '../../context/AlertContext';
import ProprlyApi from '../../api';

const ProductionDelete = ({
  refreshProds, refreshFeature, setTab, id,
}) => {
  const {setAlerts} = useContext(AlertContext);
  const history = useHistory();

  const handleClick = async (evt) => {
    evt.preventDefault();
    try {
      await ProprlyApi.deleteProd(id);
      history.push('/productions');
      refreshProds();
      setTab('1');
      refreshFeature();
      setAlerts([{variant: 'success', msg: `Locatiion #${id} has been deleted`}]);
    } catch (err) {
      setAlerts([...err.map((e) => e = {severity: e.severity || 'error', msg: e.msg})]);
    }
  };

  return (
    <Grid spacing={6} justifyContent="center" container>
      <Grid item>
        <Alert severity="info">
          <AlertTitle>Deleting a production is not reccomended!</AlertTitle>
          Consider `&lsquo;`Archiving`&rsquo;` a production instead.
        </Alert>
      </Grid>
      <Grid item>
        <Button
          onClick={handleClick}
          variant="contained"
          color="secondary"
        >
          Permanently Delete this Production?
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProductionDelete;
