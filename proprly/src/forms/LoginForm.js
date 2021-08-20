import React, {useContext, useState} from 'react';
import {
  Box, Grid, Button,
  TextField,
} from '@material-ui/core';

import {useHistory} from 'react-router';
import AlertContext from '../context/AlertContext';

const LoginForm = ({userLogin}) => {
  const initialState = {
    username: '',
    password: '',
  };

  const {alerts, setAlerts} = useContext(AlertContext);
  const [formData, setFormData] = useState(initialState);

  const history = useHistory();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await userLogin(formData);
      setAlerts([...alerts, {severity: 'success', msg: 'Welcome back!'}]);
      history.push('/');
    } catch (error) {
      console.log(error);
      setAlerts([...error.map((e) => {
        const err = {severity: e.severity || 'error', msg: e.msg};
        return err;
      })]);
    }
  };

  const handleChange = (evt) => {
    const {name, value} = evt.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };
  return (
    <Box component="form" onSubmit={handleSubmit} spacing={8}>
      <Grid container
        justifyContent="space-around"
        alignContent="center"
        rowSpacing={{xs: 4}}>
        <Grid item xs={10}>
          <TextField
            id="username-input"
            name="username"
            fullWidth
            label="Username"
            autoComplete="username"
            type="text"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={10}>
          <TextField
            id="password-input"
            name="password"
            fullWidth
            label="Password"
            autoComplete="current-password"
            type="password"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} justifyContent="center">
          <Button
            xs={10}
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}>
            Login!
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginForm;
