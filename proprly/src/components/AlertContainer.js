import React, {useEffect} from 'react';
import {v4 as uuid} from 'uuid';
import {Alert, Container} from '@material-ui/core';

// eslint-disable-next-line max-len
// https://dev.to/hibaeldursi/creating-a-contact-form-with-validation-with-react-and-material-ui-1am0

const AlertContainer = ({alerts, setAlerts}) => {
  useEffect(() => {
    let timer;
    if (alerts.length > 0) {
      timer = setTimeout(() => {
        const oneLess = alerts.slice(1);
        setAlerts(oneLess);
      }, 3000);
    }
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, [alerts, setAlerts]);

  return (
    <Container>
      {alerts.map((a) => (
        <Alert
          key={uuid()}
          severity={a.severity}
        >
          {a.msg}
        </Alert>
      ))}
    </Container>

  );
};

export default AlertContainer;
