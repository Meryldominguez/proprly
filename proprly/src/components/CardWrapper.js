import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';



export default function CardWrapper({children, title}) {

  return (
    <Card sx={{height:'100%'}} title={title} >
      <CardContent>
        <Typography fontSize={24} variant="h6" color="textPrimary" gutterBottom>
          {title}
        </Typography>
          {children}
        </CardContent>
    </Card>
  );
}
