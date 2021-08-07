import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';



export default function CardWrapper({children, title}) {

  return (
    <Card title={title} >
      <CardContent>
        <Typography fontSize={20} variant="h6" color="textPrimary" gutterBottom>
          {title}
        </Typography>
          {children}
        </CardContent>
    </Card>
  );
}
