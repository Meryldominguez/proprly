import React, {
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Button,
} from '@material-ui/core';
import CurrencyIcon from '@material-ui/icons/AttachMoney';

import ProprlyApi from '../api';
import AlertContext from '../context/AlertContext';
import CardWrapper from '../components/CardWrapper';
import AutoCompleteList from '../components/AutoCompleteList';

const LotEditForm = ({
  lot, refreshLots, setTab,
}) => {
  const initial = {
    name: lot.name,
    description: lot.description,
    location: {locationId: lot.locId, locationName: lot.location},
    price: lot.price? lot.price.slice(1) : '',
    quantity: lot.quantity || '',
  };

  const [formData, setFormData] = useState(initial);
  const [priceInput, setPriceInput] = useState(initial.price?true:false);
  const [quantityInput, setQuantityInput] = useState(initial.quantity?true:false);

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
      await ProprlyApi.updateLot(
          lot.id, {...trimmedData});
      setTab('1');
      refreshLots();
      setAlerts([...alerts, {severity: 'success', msg: 'Item updated!'}]);
    } catch (error) {
      setFormData({...formData});
      setAlerts([...error.map((e) => {
        const err = {severity: e.severity || 'error', msg: e.msg};
        return err;
      })]);
    }
  };
  const isFormDirty = () => (
    initial.name === formData.name.trim() &&
    initial.description === formData.description.trim() &&
    initial.location.locationId === formData.location.locationId &&
    initial.price === formData.price &&
    initial.quantity === formData.quantity
  );

  const handleChange = (evt) => {
    console.log(formData, isFormDirty());
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
      setFormData({...formData, quantity: quantityInput ? '' : initial.quantity});
    }
    if (name === 'priceCheck') {
      setPriceInput(!priceInput);
      setFormData({...formData, price: priceInput ? '' : initial.price});
    }
  };

  const resetForm = () => {
    setFormData(initial);
  };

  return (
    <CardWrapper title={lot.name}>
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
              {!locsLoading && <AutoCompleteList
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
                  disabled={isFormDirty()}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={resetForm}
                >
                  Reset Changes
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  disabled={isFormDirty()}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                >
                  Edit Item
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </CardWrapper>
  );
};

export default LotEditForm;
