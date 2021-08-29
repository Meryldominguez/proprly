import React, {
  useContext,
  useState,
} from 'react';
import {
  useHistory,
} from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import CardWrapper from '../components/CardWrapper';
import ProprlyApi from '../api';
import AlertContext from '../context/AlertContext';

const ProdNewForm = ({refreshProds, setFeature, setTab}) => {
  const initial = {
    title: '',
    notes: '',
    active: true,
    dateStart: '',
    dateEnd: '',
  };
  const history = useHistory();
  const [formData, setFormData] = useState(initial);

  const {alerts, setAlerts} = useContext(AlertContext);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const trimmedData = {
        title: formData.title.trim(),
        notes: formData.notes.trim(),
        dateStart: formData.dateStart || null,
        dateEnd: formData.dateEnd || null,
      };
      const newProd = await ProprlyApi.newProd({...formData, ...trimmedData});
      history.push(`/productions/${newProd.id}`);
      setFeature(newProd.id);
      refreshProds();
      setTab('1');
      setAlerts([...alerts, {severity: 'success', msg: 'Production created!'}]);
    } catch (error) {
      setFormData({...formData});
      setAlerts([
        ...error.map((e) => {
          const err = {severity: e.severity || 'error', msg: e.msg};
          return err;
        }),
      ],
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

  const resetForm = () => {
    setFormData(initial);
  };

  return (
    <CardWrapper title="New Production">
      <Box component="form" onSubmit={handleSubmit}>
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
              label={
              formData.active ?
                'Active Production' : 'Inactive Production'}
            />
          </Grid>
          <Grid xs={8} item >
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
              minRows={4}
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
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={resetForm}
                >
                Clear Form
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                >
                Add Production
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </CardWrapper>
  );
};

export default ProdNewForm;
