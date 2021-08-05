import React, {useContext, useState} from 'react'
import { createStyles, useTheme } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

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

const LoginForm = ({login}) => {
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
            await login(formData)
            // setAlerts([...alerts,{variant:"success",msg:"Welcome back!"}])
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
        console.log(formData)
    };
  return (
    <Container component="main">
        <form onSubmit={handleSubmit}>
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
    </Container>
  )
}
 
export default LoginForm