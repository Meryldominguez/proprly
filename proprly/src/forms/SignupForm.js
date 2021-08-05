import React, {useState} from 'react'
import { createStyles, useTheme } from '@material-ui/core/styles';
// import AlertContext from "../context/AlertContext";

import { 
    TextField,
    Box,
    Grid,
    Button
 } from '@material-ui/core'
import { useHistory } from 'react-router'
 
const useStyles = createStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

const SignupForm = ({userSignup}) => {
    const theme = useTheme()
    const classes = useStyles(theme);

    const initialState = {
        username:"",
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:""
    }
    
    // const {alerts,setAlerts} = useContext(AlertContext)
    const [formData, setFormData] = useState(initialState);
    const history = useHistory()

    const handleSubmit = async (evt)=> {
        evt.preventDefault();
        try {
          if (formData.password!==formData.confirmPassword) throw new Error("Passwords must match")
            await userSignup(formData)
            // setAlerts([...alerts,{variant:"success",msg:"You have successfully signed up!"}])
            history.push("/")
        } catch (error) {
          console.log(error)
            // setAlerts([...alerts,...error.map(e=>{return {severity:"error",msg:e}})] )
        }
      };

    const handleChange = evt => {
        const {name,value} = evt.target;
        setFormData({
            ...formData,
            [name]:value,
        });
    };
  return (
    
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container rowSpacing={{xs:2}} spacing={2} >
        <Grid item xs={6}> 
          <TextField
              id="firstName-input"
              name="firstName"
              className={classes.root}
              label="First Name"
              type="text"
              variant="outlined"
              onChange={handleChange}
              />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="lastName-input"
            name="lastName"
            className={classes.root}
            label="Last Name"
            type="text"
            variant="outlined"
            onChange={handleChange}
            />
        </Grid>
        <Grid item xs={6}> 
          <TextField
              id="username-input"
              name="username"
              className={classes.root}
              label="Username"
              type="text"
              autoComplete="username"
              variant="outlined"
              onChange={handleChange}
              />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="email-input"
            name="email"
            className={classes.root}
            label="Email"
            type="email"
            variant="outlined"
            onChange={handleChange}
            />
        </Grid>
        <Grid item xs={6}> 
          <TextField
              id="password-input"
              name="password"
              className={classes.root}
              label="Password"
              type="text"
              variant="outlined"
              onChange={handleChange}
              />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="confirmPassword-input"
            className={classes.root}
            label="Confirm Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            onChange={handleChange}
            />
        </Grid>
        <Grid item xs={12} justifyContent="center">
        <Button variant="contained" color='primary' xs={10} fullWidth onClick={handleSubmit}> Sign up!</Button>
        </Grid>        
      </Grid>
    </Box>
  )
}
 
export default SignupForm