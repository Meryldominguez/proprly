import React, {useState, useContext} from 'react'
import AlertContext from "../context/AlertContext";

import { 
    TextField,
    Box,
    Grid,
    Button
 } from '@material-ui/core'
import { useHistory } from 'react-router'
 


const SignupForm = ({userSignup}) => {

    const initialState = {
        username:"",
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:""
    }
    
    const {setAlerts} = useContext(AlertContext)
    const [formData, setFormData] = useState(initialState);
    const history = useHistory()

    const handleSubmit = async (evt)=> {
        evt.preventDefault();
        console.log(formData)
        try {
          if (formData.password!==formData.confirmPassword) throw new Error("Passwords must match")
            const trimmedData = {
              email:formData.email.trim(),
              firstName:formData.firstName.trim(),
              lastName:formData.lastName.trim(),
              password:formData.password,
              username:formData.username.trim()
            }
            await userSignup(trimmedData)
            setAlerts([{variant:"success",msg:"You have successfully signed up!"}])
            history.push("/")
        } catch (error) {
          console.log(error)
          setAlerts([...error.map(e=> e={severity:e.severity||'error', msg:e.msg})]);
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
              label="Password"
              autoComplete="new-password"
              type="password"
              variant="outlined"
              onChange={handleChange}
              />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="confirmPassword-input"
            name="confirmPassword"
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