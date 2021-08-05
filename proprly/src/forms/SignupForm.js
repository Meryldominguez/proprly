import React, {useContext, useState} from 'react'
import { createStyles, useTheme } from '@material-ui/core/styles';

import { 
    TextField
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

const SignupForm = ({signup}) => {
    const theme = useTheme()
    const classes = useStyles(theme);

    const initialState = {
        username:"",
        firstName:"",
        lastName:"",
        email:"",
        password:""
    }
    
    // const {alerts,setAlerts} = useContext(AlertContext)
    const [formData, setFormData] = useState(initialState);
    const history = useHistory()

    const handleSubmit = async (evt)=> {
        evt.preventDefault();
        try {
            await signup(formData)
            // setAlerts([...alerts,{variant:"success",msg:"You have successfully signed up!"}])
            history.push("/")
        } catch (error) {
            // setAlerts([...alerts,...error.map(e=>{return {variant:"danger",msg:e}})] )
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
    
    <form onSubmit={handleSubmit}>
        <TextField
            id="outlined-password-input"
            className={classes.root}
            label="Password"
            type="text"
            variant="outlined"
            onChange={handleChange}
            />
        <TextField
            id="outlined-password-input"
            className={classes.root}
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            onChange={handleChange}
            />
    </form>
  )
}
 
export default SignupForm