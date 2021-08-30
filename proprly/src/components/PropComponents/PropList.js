import React, {
  useState,
} from 'react';
import {
  Link,
} from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import {
  Button,
  Typography,
} from '@material-ui/core';
import {FixedSizeList} from 'react-window';
import CardWrapper from '../CardWrapper';
import SingleProp from '../../forms/PropForm';

const PropList = ({refreshProd, props, prod}) => {
  const [checkedIdx, setCheckedIdx] = useState();

  const renderList = ({index, style}) => (
    <SingleProp
      active={checkedIdx===index}
      makeActive={()=>setCheckedIdx(checkedIdx===index? null :index)}
      style={style}
      key={uuid()}
      prop={props[index]}
      prodId={prod.id}
      refresh={(id)=>refreshProd(id)}
    />
  );
  return (
    <CardWrapper
      title={prod.title}
      subtitle={
        <Button
          variant="text"
          component={Link}
          to={`/productions/${prod.id}`}>
        Go to Production Detail
        </Button>}
    >
      {props['length'] > 0 ?
        <FixedSizeList
          height={600}
          itemSize={150}
          itemCount={props.length}
          overscanCount={3}
        >
          {renderList}
        </FixedSizeList> :
        <Typography>
          No props for this production
        </Typography>
      }
    </ CardWrapper>
  );
};

export default PropList;
