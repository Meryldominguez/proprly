import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Grid, TextField, Button,
} from '@material-ui/core';

import LoadingSpinner from '../components/Spinner';
import UserContext from '../context/UserContext';
import AlertContext from '../context/AlertContext';

const ProfileForm = () => {
  const {
    profile, authProfile, isLoading, updateProfile, setProfile,
  } = useContext(UserContext);
  const [formData, setFormData] = useState(profile);

  const { alerts, setAlerts } = useContext(AlertContext);

  useEffect(() => {
    let email; let firstName; let lastName; let
      phone;
    if (profile) {
      email = profile.email;
      firstName = profile.firstName;
      lastName = profile.lastName;
      phone = profile.phone;
    }

    setFormData({
      email, firstName, lastName, phone, password: '',
    });
  }, [profile]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      if (!formData.password) throw Object({ severity: 'info', msg: 'Password required to confirm changes!' });
      if (await authProfile(formData.password)) {
        const trimmedData = {
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone ? formData.phone.trim() : null,
        };
        await updateProfile(trimmedData);
        setFormData({ ...trimmedData, password: '' });
      }
      setAlerts([...alerts, { severity: 'success', msg: 'Profile updated!' }]);
    } catch (error) {
      console.log(error);
      setFormData({ ...formData, password: '' });
      setAlerts([...error.map((e) => e = { severity: e.severity || 'error', msg: e.msg })]);
    }
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isFormDirty = () => !((profile.email === formData.email
            && profile.firstName === formData.firstName
            && profile.lastName === formData.lastName
            && profile.phone === formData.phone));
  const resetForm = () => {
    const { email, firstName, lastName } = profile;
    setFormData({
      email,
      firstName,
      lastName,
      password: '',
    });
    setProfile({ ...profile });
  };
  return (
    <>
      {!isLoading && profile

        ? (
          <Box component="form" onSubmit={handleSubmit} spacing={8}>
            <Grid
              container
              justifyContent="center"
              alignContent="center"
              rowSpacing={{ xs: 4 }}
              spacing={2}
            >
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  id="firstName-input"
                  name="firstName"
                  label="First Name"
                  type="text"
                  variant="outlined"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  id="lastName-input"
                  name="lastName"
                  label="Last Name"
                  type="text"
                  variant="outlined"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  id="email-input"
                  name="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={formData.email || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  id="phone-input"
                  name="phone"
                  label="Phone"
                  type="phone"
                  variant="outlined"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  id="password-input"
                  name="password"
                  label="Password"
                  helperText="Confirm your pasword to update profile"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  value={formData.password || ''}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={5} justifyContent="center">
                {isFormDirty()
                  ? <Button variant="outlined" color="primary" xs={10} fullWidth onClick={resetForm}>Reset</Button>
                  : <Button disabled variant="outlined" color="primary" xs={10} fullWidth onClick={resetForm}>Reset</Button>}
              </Grid>
              <Grid item xs={5} justifyContent="center">
                <Button variant="contained" color="primary" xs={10} fullWidth onClick={handleSubmit}>Update Profile</Button>
              </Grid>
            </Grid>
          </Box>
        )
        : <LoadingSpinner />}
    </>
  );
};

export default ProfileForm;
