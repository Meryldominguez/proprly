import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
} from '@material-ui/core';

export default function CardWrapper({ children, title, subtitle = '' }) {
  return (
    <Card sx={{ height: '100%' }} title={title}>
      <CardHeader
        // avatar={
          // <Avatar aria-label="recipe" className={classes.avatar}>
          //   R
          // </Avatar>
        // }

        title={title}
        subheader={subtitle}
      />
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
