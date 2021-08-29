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
import CardWrapper from '../CardWrapper';

const ProductionDelete = ({
  refreshFeature, refreshProds, prod,
}) => {
  const {setAlerts} = useContext(AlertContext);
  const history = useHistory();

  const handleClick = async (evt) => {
    evt.preventDefault();
    try {
      await ProprlyApi.deleteProd(prod.id);
      history.push('/productions');
      refreshFeature();
      refreshProds();
      setAlerts([{variant: 'success', msg: `Production has been deleted`}]);
    } catch (err) {
      setAlerts([...err.map((e) => e = {severity: e.severity || 'error', msg: e.msg})]);
    }
  };

  return (
    <CardWrapper title={prod.title}>
      <Grid spacing={6} justifyContent="center" container>
        <Grid item>
          <Alert severity="info">
            <AlertTitle>Deleting a production is not reccomended!</AlertTitle>
          Consider &ldquo;Archiving&rdquo; a production instead.
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
    </CardWrapper>
  );
};

export default ProductionDelete;
