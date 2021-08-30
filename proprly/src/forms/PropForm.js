import React, {
  useContext,
  useState,
} from 'react';
import {
  useHistory,
} from 'react-router-dom';
import {
  Button,
  Checkbox,
  TextField,
  ListItem,
  FormControlLabel,
  ButtonGroup,
  Grid,
  ListItemAvatar,
} from '@material-ui/core';
import Arrow from '@material-ui/icons/ArrowForwardIos';
import Delete from '@material-ui/icons/HighlightOff';
import Save from '@material-ui/icons/Save';
import ProprlyApi from '../api';
import AlertContext from '../context/AlertContext';

const SingleProp = ({
  active, makeActive, prop, prodId, refresh, style,
}) => {
  const initial = {
    prodId,
    lotId: prop.id,
    notes: prop.notes? prop.notes : '',
    quantity: prop.quantity? prop.quantity : '',
  };
  const {alerts, setAlerts} = useContext(AlertContext);
  const history = useHistory();
  const [checked, setChecked] = useState(active);
  const [quantityInput, setQuantityInput] = useState(initial.quantity?true:false);
  const [formData, setFormData] = useState(initial);
  const handleChange = (evt) => {
    const {name, value} = evt.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (evt) => {
    try {
      const trimmedData= {
        quantity: formData.quantity?
            Number(formData.quantity) : null,
        notes: formData.notes?
            formData.notes.trim() : null,
      };
      await ProprlyApi.updateProp(prodId, prop.id, trimmedData);
      refresh(prodId);
      setAlerts([...alerts, {severity: 'success', msg: 'Prop Updated'}]);
    } catch (err) {
      setFormData({...formData});
      setAlerts([...err.map((e) => {
        const err = {severity: e.severity || 'error', msg: e.msg};
        return err;
      })]);
    }
  };
  const handleDelete = async (evt) => {
    try {
      await ProprlyApi.deleteProp(prodId, prop.id);
      refresh(prodId);
      setAlerts([...alerts, {severity: 'success', msg: 'Prop Deleted'}]);
    } catch (err) {
      setFormData({...formData});
      setAlerts([...err.map((e) => {
        const err = {severity: e.severity || 'error', msg: e.msg};
        return err;
      })]);
    }
  };

  const quantityCheck = (evt) =>{
    setQuantityInput(!quantityInput);
    setFormData({
      ...formData,
      quantity: quantityInput ?
            '' :initial.quantity,
    });
  };
  const handleCheck = (evt) => {
    evt.preventDefault();
    setChecked(!checked);
    makeActive();
  };

  const isFormDirty = () => (
    initial.quantity === formData.quantity &&
    initial.notes === formData.notes.trim()
  );

  return (
    <Grid container style={style} component="form">
      <ListItem
        secondaryAction={
          <ButtonGroup align="right" variant="text">
            <Button
              aria-label="Save this prop"
              align="right"
              disabled={!active || isFormDirty()}
              onClick={handleSubmit}>
              <Save />
            </ Button>
            <Button
              aria-label="delete this prop"
              align="right"
              disabled={!active}
              onClick={handleDelete}>
              <Delete />
            </ Button>
            <Button
              aria-label="view this item listing"
              onClick={()=> history.push(`/lots/${prop.id}`)}
            >
              <Arrow />
            </ Button>
          </ButtonGroup>
        }
      >
        <ListItemAvatar>
          <FormControlLabel
            control={<Checkbox
              edge="start"
              checked={checked}
              onClick={handleCheck}
              tabIndex={-1}
              disableRipple
            />}
            label={prop.name}
          />
        </ListItemAvatar>
      </ ListItem>
      <ListItem >
        <TextField
          edge="start"
          helperText="Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          disabled={!quantityInput || !checked}
          InputProps={{
            startAdornment: <Checkbox
              edge="start"
              size="small"
              disabled={!active}
              checked={quantityInput}
              onClick={quantityCheck}
              tabIndex={-1}
              disableRipple
            />,
          }}
          inputProps={{min: 0}}
          style={{
            width: '40%',
            paddingRight: 10,
          }}
        />
        <TextField
          fullWidth
          label="Notes"
          name="notes"
          type="text"
          multiline
          rows={2}
          value={formData.notes}
          onChange={handleChange}
          disabled={!checked}
        />
      </ListItem>
    </ Grid>
  );
};

export default SingleProp;
