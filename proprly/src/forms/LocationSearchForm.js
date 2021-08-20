import React, { useState } from 'react';
import {
  useHistory,
} from 'react-router-dom';
import querystring from 'querystring'
import {
  Grid,
, 
    TextField
 } from '@material-ui/core';
 
const LocationSearchForm = ({ query, featuredId, searchLocations }) => {
  const history = useHistory();
  const [formData, setFormData] = useState(
    {
      searchTerm: query,
    }
);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    formData.searchTerm !== ""
            ? searchLocations(`?${querystring.stringify(formData)}`)
      :searchLocations('');
    featuredId ?
      history.push(`/locations/${featuredId}?${querystring.stringify(formData)}`)
            :            history.push(`/locations?${querystring.stringify(formData)}`);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <Grid
          container
          component="form"
          onSubmit={handleSubmit}
          spacing={8}
          justifyContent="center"
        >
          <Grid item xs={8}>
              <TextField
                  fullWidth
                  placeholder="Keyword search"
                  aria-label="Search locations"
                  aria-describedby="basic-addon2"
                  name="searchTerm"
                  value={formData.searchTerm}
                  onChange={handleChange}
                />
            </Grid>
        </Grid>
  );
};

export default LocationSearchForm
