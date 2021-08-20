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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  FormGroup,
  Checkbox
} from '@material-ui/core';

import ProprlyApi from '../api';
import AlertContext from '../context/AlertContext';
import CurrencyIcon from '@material-ui/icons/AttachMoney';
import LoadingSpinner from '../components/Spinner';
import CardWrapper from '../components/CardWrapper';
import Counter from '../components/Counter';
import AutoCompleteList from '../components/AutoCompleteList'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const LotNewForm = ({
  locations, setFeature, setTab, refreshLots,
}) => {
  const initial = {
    name: '',
    description: '',
    locId: '',
    price: undefined,
    quantity: undefined,
  };
  const history = useHistory();
  const [formData, setFormData] = useState(initial);
  const [priceInput, setPriceInput] = useState(false)
  const [quantityInput, setQuantityInput] = useState(false)

  const { alerts, setAlerts } = useContext(AlertContext);

  const handleSubmit = async (evt) => {
    console.log(formData);
    evt.preventDefault();
    try {
      const trimmedData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        locId: formData.locId === '' ? null : formData.locId,
      };
      console.log({ ...formData, ...trimmedData });
      const newLot = await ProprlyApi.newLot({ ...formData, ...trimmedData });
      setTab('0');
      setFeature(newLot.id);
      refreshLots();
      history.push(`/locations/${newLot.id}`);
      setAlerts([...alerts, { severity: 'success', msg: 'Location created!' }]);
    } catch (error) {
      console.log(error);
      setFormData({ ...formData });
      setAlerts([...error.map((e) => e = { severity: e.severity || 'error', msg: e.msg })]);
    }
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    console.log(name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const handleCheck = (evt) => {
    const { name,value,checked } = evt.target;
    if (name==="quantityCheck"){
      setQuantityInput(!quantityInput)
      setFormData({...formData,quantity:quantityInput?null:0})
    }
    if (name==="priceCheck"){
      setPriceInput(!priceInput)
      setFormData({...formData,price:priceInput?null:""})
    }

    console.log(formData)
    
  };
  

  const resetForm = () => {
    setFormData(initial);
  };

  const renderMenuList = (list, defaultDepth = 0, step = 10) => {
    const nextDepth = defaultDepth + step;

    return list.map((item) => [<MenuItem
      style={{ marginLeft: defaultDepth === 0 ? 0 : nextDepth }}
      value={item.locationId}
    >
      {item.locationName}
    </MenuItem>,
    item.children && renderMenuList(item.children, defaultDepth = nextDepth)]);
  };

  return (
    <CardWrapper title="New Item">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid
          container
          rowSpacing={{ xs: 4 }}
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
            <FormControl fullWidth >
              <AutoCompleteList 
                options={locations}/>
            </FormControl>
          </Grid>
          <Grid item xs={8}>
            <FormGroup >
              <FormControlLabel
                align="left"
                control={
                  <Checkbox checked={priceInput} name='priceCheck' onChange={handleCheck} />
                }
                label="Price:"
                labelPlacement="start"
              />
              {priceInput && 
              <TextField
                value={formData.price}
                name="price"
                onChange={handleChange}
              />}
              <FormControlLabel
                control={
                  <Checkbox checked={quantityInput} name='quantityCheck' onChange={handleCheck} />
                }
                label="Quantity:"
                labelPlacement="start"
              />
              {quantityInput &&
              <Counter
                value={formData.quantity}
                setValue={(value)=>setFormData({...formData,quantity:value})}
                 />}
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
  );
};

export default LotNewForm;
