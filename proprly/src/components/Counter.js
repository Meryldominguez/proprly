import React, {
  useState,
} from 'react';
import {
  ButtonGroup,
  Button,
  Typography,
  TextField,
} from '@material-ui/core';
import {
  ExpandMore,
  ExpandLess,
} from '@material-ui/icons';

const Counter = ({
  value = 0, setValue, topLimit, bottomLimit = 0,
}) => (
  <ButtonGroup
    orientation="vertical"
    aria-label="vertical outlined button group"
  >
    <Button disabled={topLimit ? value <= topLimit : false} onClick={() => setValue(value + 1)}>
      <ExpandLess />
    </Button>
    <Button>{value}</Button>
    <Button disabled={value <= bottomLimit} onClick={() => setValue(value - 1)}>
      <ExpandMore />
    </Button>
  </ButtonGroup>
);

export default Counter;
