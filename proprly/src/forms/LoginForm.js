import React, {useContext, useState} from 'react'
import { 
    Button,
    Form,
    Card,
    Col
} from 'react-bootstrap'
import { useHistory } from 'react-router';
import AlertContext from '../context/AlertContext';
 
const LoginForm = ({login}) => {
    const history = useHistory()
    const {alerts,setAlerts} = useContext(AlertContext)
    
    const [formData, setFormData] = useState(
        {
            username:"",
            password:""
        });

    const handleSubmit = async (evt)=> {
        evt.preventDefault();
        try {
            await login(formData)
            setAlerts([...alerts,{variant:"success",msg:"You have successfully logged in!"}])
            history.push("/")
        } catch (error) {
            setFormData({
                username:"",
                password:""
            })
            setAlerts([...alerts,...error.map(e=>{return {variant:"danger",msg:e}})] )
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

    <Col xs={8} className="m-auto">
    <Card className="p-3 my-5">
        <h4>Login to your Jobify account:</h4>
    <Form onSubmit={handleSubmit} className="my-3">
        <Form.Group controlId="formBasicUsername">
            <Form.Control 
                type="text" 
                placeholder="Enter username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
            <Form.Control 
                type="password" 
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
            />
        </Form.Group>
        <Button variant="primary" type="submit">
            Login
        </Button>
    </Form>
    </Card>
    </Col>
  )
}
 
export default LoginForm