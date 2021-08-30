import React, {
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  useHistory,
  Link,
} from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputAdornment,
  Button,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
} from '@material-ui/core';
import CurrencyIcon from '@material-ui/icons/AttachMoney';
import ProprlyApi from '../api';
import AlertContext from '../context/AlertContext';

import CardWrapper from '../components/CardWrapper';
import AutoCompleteList from '../components/AutoCompleteList';

const LotNewForm = ({
  setFeature, setTab, refreshLots,
}) => {
  const initial = {
    name: '',
    description: '',
    location: {locationId: 0, locationName: ''},
    price: '',
    quantity: '',
  };
  const history = useHistory();

  const [formData, setFormData] = useState(initial);
  const [priceInput, setPriceInput] = useState(false);
  const [quantityInput, setQuantityInput] = useState(false);

  const [locations, setLocations] = useState();
  const [locsLoading, setLocsLoading] = useState(true);

  useEffect(() => {
    const loadLocs= async ()=>{
      const loc = await ProprlyApi.listLocs();
      setLocations(loc);
      setLocsLoading(false);
    };
    loadLocs();
  }, []);
  const {alerts, setAlerts} = useContext(AlertContext);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const trimmedData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        locId: formData.location.locationId,
        quantity: formData.quantity ? Number(formData.quantity) : null,
        price: formData.price ? Number(formData.price) : null,
      };
      const newLot = await ProprlyApi.newLot({...trimmedData});
      setTab('0');
      setFeature(newLot.id);
      refreshLots();
      history.push(`/lots/${newLot.id}`);
      setAlerts([...alerts, {severity: 'success', msg: 'Item created!'}]);
    } catch (error) {
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
    const {name, value} = evt.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheck = (evt) => {
    const {name} = evt.target;
    if (name === 'quantityCheck') {
      setQuantityInput(!quantityInput);
      setFormData({...formData, quantity: quantityInput ? initial.quantity: 0});
    }
    if (name === 'priceCheck') {
      setPriceInput(!priceInput);
      setFormData({...formData, price: priceInput ? initial.price : 0});
    }
  };

  const resetForm = () => {
    setFormData(initial);
  };
  return !locsLoading && locations.length > 0?
  (<CardWrapper title="New Item">
    <Box component="form" onSubmit={handleSubmit}>
      <Grid
        container
        rowSpacing={{xs: 4}}
        spacing={2}
        justifyContent="center"
      >
        <Grid item xs={8} align="center">
          <TextField
            fullWidth
            id="title-input"
            name="name"
            label="Name"
            type="text"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={8}>
          <FormControl fullWidth>
            {!locsLoading &&
              <AutoCompleteList
                required
                options={locations}
                value={formData.location}
                setValue={(location) => setFormData({...formData, location})}
                title="locationName"
                val="locationId"
                label="Location"
              />}
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <FormGroup>
            <FormControlLabel
              align="left"
              control={
                <Checkbox
                  checked={priceInput}
                  name="priceCheck"
                  onChange={handleCheck} />
              }
              label="Price:"
              labelPlacement="start"
            />
            <TextField
              value={formData.price}
              disabled={!priceInput}
              name="price"
              type="number"
              onChange={handleChange}
              inputProps={{min: 0}}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={quantityInput}
                  name="quantityCheck"
                  onChange={handleCheck}
                />
              }
              label="Quantity:"
              labelPlacement="start"
            />
            <TextField
              value={formData.quantity}
              disabled={!quantityInput}
              name="quantity"
              inputProps={{min: 0}}
              type="number"
              onChange={handleChange}
            />
          </FormGroup>
        </Grid>
        <Grid xs={8} item>
          <TextField
            fullWidth
            type="text"
            name="description"
            multiline
            maxRows={4}
            minRows={4}
            label="Notes"
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={10}>
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
                  Add Item
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  </CardWrapper>
  ) : <CardWrapper
    title="New Item"
    subtitle={
      <Grid container justifyContent="center">
        <Grid item xs={8}>
          <Typography>
            There are no locations, and in order to make an item, you need a location.
          </ Typography>
        </Grid>
        <Button
          fullWidth
          size="large"
          variant="text"
          component={Link}
          to={`/locations`}>
          Make a Location first!
        </Button>
      </ Grid>}
  />;
};

export default LotNewForm;
