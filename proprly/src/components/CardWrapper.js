import React from 'react';
import { createStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = createStyles(theme=>({
  root: {
    minWidth: 275
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

export default function CardWrapper({children, title}) {
  const theme = useTheme()
  const classes = useStyles(theme);

  return (
    <Card title={title} className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textPrimary" gutterBottom>
          {title}
        </Typography>
          {children}
        </CardContent>
    </Card>
  );
}
