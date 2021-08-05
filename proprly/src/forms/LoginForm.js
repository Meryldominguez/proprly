import React, {useContext, useState} from 'react'
import { createStyles, useTheme } from '@material-ui/core/styles';
import { Box,Grid, Button } from '@material-ui/core';

import { 
    TextField
 } from '@material-ui/core'
import { useHistory } from 'react-router'
import AlertContext from '../context/AlertContext';
 
const useStyles = createStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

const LoginForm = ({userLogin}) => {
    const theme = useTheme()
    const classes = useStyles(theme);

    const initialState = {
        username:"",
        password:""
    }
    
    // const {alerts,setAlerts} = useContext(AlertContext)
    const [formData, setFormData] = useState(initialState);

    const history = useHistory()

    const handleSubmit = async (evt)=> {
        evt.preventDefault();
        try {
            await userLogin(formData)
            // setAlerts([...alerts,{severity:"success",msg:"Welcome back!"}])
            history.push("/")
        } catch (error) {
            console.log(error)
            // setAlerts([...alerts,...error.map(e=>{return {severity:"danger",msg:e}})] )
        }
      };

    const handleChange = evt => {
        const {name,value} = evt.target;
        setFormData({
            ...formData,
            [name]:value,
        });
        console.log(formData)
    };
  return (
  <Box component="form" onSubmit={handleSubmit} spacing={8}>
  <Grid container justifyContent="space-around" alignContent="center" rowSpacing={{xs:4}}  >
    <Grid item xs={10} > 
      <TextField
          id="username-input"
          name="username"
          fullWidth
          className={classes.root}
          label="Username"
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
          className={classes.root}
          label="Password"
          type="password"
          variant="outlined"
          onChange={handleChange}
          />
    </Grid>
    <Grid item xs={12} justifyContent="center">
    <Button xs={10} variant="contained" color='primary' fullWidth onClick={handleSubmit}> Login!</Button>
    </Grid>        
  </Grid>
</Box>
  )
}
 
export default LoginForm