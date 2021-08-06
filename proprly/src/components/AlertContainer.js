import React, { useEffect } from 'react'
import {v4 as uuid} from "uuid"
import { Alert, Container } from '@material-ui/core';
 
const AlertContainer = ({alerts, setAlerts}) => {

  // useEffect(() => {
  //   const timer=setTimeout(() => {
  //     const oneLess = alerts.slice(1)
  //     setAlerts(oneLess)
  //   }, 3000);
  //   // Clear timeout if the component is unmounted
  //   return () => clearTimeout(timer);
  // },[alerts, setAlerts]);

  return (
    <Container>
    {alerts.map((a)=>
        <Alert 
          key={uuid()}
          severity={a.severity}
        >{a.msg}</Alert>)}
    </Container>
    
  )
}
 
export default AlertContainer