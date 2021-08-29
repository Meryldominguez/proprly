import React, {
  useContext,
  useState,
} from 'react';
import {v4 as uuid} from 'uuid';
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
} from '@material-ui/core';

import ProprlyApi from '../api';
import AlertContext from '../context/AlertContext';
import LoadingSpinner from '../components/Spinner';
import CardWrapper from '../components/CardWrapper';

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

const LocNewForm = ({
  locations, isLoading, setFeature, setTab, refreshLocs,
}) => {
  const initial = {
    name: '',
    notes: '',
    parentId: 0,
  };
  const history = useHistory();
  const [formData, setFormData] = useState(initial);

  const {alerts, setAlerts} = useContext(AlertContext);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const trimmedData = {
        name: formData.name.trim(),
        notes: formData.notes.trim(),
        parentId: formData.parentId === 0 ? null : formData.parentId,
      };
      const newLoc = await ProprlyApi.newLoc({...formData, ...trimmedData});
      setTab('0');
      setFeature(newLoc.id);
      refreshLocs();
      history.push(`/locations/${newLoc.id}`);
      setAlerts([...alerts, {severity: 'success', msg: 'Location created!'}]);
    } catch (err) {
      console.log(err);
      setFormData({...formData});
      setAlerts([...err.map((e) => e = {severity: e.severity || 'error', msg: e.msg})]);
    }
  };

  const handleChange = (evt) => {
    const {name, value} = evt.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData(initial);
  };
  const renderMenuList = (list, defaultDepth = 0, step = 10) => {
    const nextDepth = defaultDepth + step;

    return list.map((item) => [<MenuItem
      key={uuid()}
      style={{marginLeft: defaultDepth === 0 ? 0 : nextDepth}}
      value={item.locationId}
    >
      {item.locationName}
    </MenuItem>,
    item.children && renderMenuList(item.children, defaultDepth = nextDepth)]);
  };

  return locations && !isLoading ? (
    <CardWrapper title="New Location">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid
          container
          rowSpacing={{xs: 4}}
          spacing={2}
          justifyContent="center"
        >
          <Grid xs={8} item align="center">
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
              <InputLabel htmlFor="parentId">Parent Location</InputLabel>
              <Select
                fullWidth
                value={formData.parentId}
                name="parentId"
                id="parentId"
                label="Parent Location"
                onChange={handleChange}
                MenuProps={MenuProps}
              >
                <MenuItem value={0}>
                  No Parent
                </MenuItem>
                {renderMenuList(locations)}
              </Select>
            </FormControl>
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
                  Add Location
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </CardWrapper>
  ) : <LoadingSpinner />;
};

export default LocNewForm;
