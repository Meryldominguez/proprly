import React, {
  useContext,
  useState,
} from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from '@material-ui/core';

import ProprlyApi from '../api';
import LoadingSpinner from '../components/Spinner';
import AlertContext from '../context/AlertContext';
import CardWrapper from '../components/CardWrapper';

const ProdEditForm = ({
  setTab, refreshProds, production,
}) => {
  const initial = {
    title: production.title,
    notes: production.notes,
    active: production.active,
    dateStart: production.dateStart ? production.dateStart : '',
    dateEnd: production.dateEnd ? production.dateEnd : '',
  };
  const [formData, setFormData] = useState(initial);
  const {alerts, setAlerts} = useContext(AlertContext);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const trimmedData = {
        title: formData.title.trim(),
        notes: formData.notes.trim(),
      };
      await ProprlyApi.updateProd(production.id, {...formData, ...trimmedData});
      setTab('1');
      refreshProds();
      setAlerts([...alerts, {severity: 'success', msg: 'Production updated!'}]);
    } catch (error) {
      console.log(error);
      setFormData({...formData});
      setAlerts([
        ...error.map((e) => {
          const err = {severity: e.severity || 'error', msg: e.msg};
          return err;
        })],
      );
    }
  };

  const handleChange = (evt) => {
    const {name, value, checked} = evt.target;
    setFormData({
      ...formData,
      [name]: name === 'active' ? checked : value,
    });
  };

  const isFormDirty = () => !((
    production.title === formData.title.trim() &&
          production.notes === formData.notes.trim() &&
          production.active === formData.active &&
          production.dateStart === formData.dateStart &&
          production.dateEnd === formData.dateEnd));
  const resetForm = () => {
    setFormData(production);
  };
  return production ? (
    <CardWrapper title={production.title}>
      <Box component="form" onSubmit={handleSubmit} spacing={8}>
        <Grid
          container
          rowSpacing={{xs: 4}}
          spacing={2}
          justifyContent="center"
        >
          <Grid item xs={12}>
            <FormControlLabel
              control={(
                <Switch
                  checked={formData.active}
                  name="active"
                  onChange={handleChange}
                  inputProps={{'aria-label': 'controlled'}}
                />
              )}
              color="secondary"
              labelPlacement="end"
              label={formData.active ? 'Active Production' : 'Inactive Production'}
            />
          </Grid>
          <Grid xs={8} item>
            <TextField
              fullWidth
              id="title-input"
              name="title"
              label="Title"
              type="text"
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="dateStart"
                  label="Start Date"
                  variant="outlined"
                  InputLabelProps={{shrink: true}}
                  value={formData.dateStart || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="dateEnd"
                  label="End Date"
                  InputLabelProps={{shrink: true}}
                  variant="outlined"
                  value={formData.dateEnd || ''}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={8} item>
            <TextField
              fullWidth
              type="text"
              name="notes"
              multiline
              maxRows={4}
              label="Notes"
              variant="outlined"
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={8}>
            <Grid spacing={2} container>
              <Grid item xs={6}>
                <Button
                  disabled={!isFormDirty()}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={resetForm}
                >
                      Reset
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  disabled={!isFormDirty()}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                >
                      Update Production
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </CardWrapper>
        ) :
        <LoadingSpinner />;
};

export default ProdEditForm;
