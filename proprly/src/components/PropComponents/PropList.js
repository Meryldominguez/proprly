import React, {
  useState,
} from 'react';
import {v4 as uuid} from 'uuid';
import {
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
  return props['length'] > 0 ? (
    <CardWrapper title={prod.title}
    >
      <FixedSizeList
        height={600}
        itemSize={150}
        itemCount={props.length}
        overscanCount={3}
      >
        {renderList}
      </FixedSizeList>
    </ CardWrapper>
  ) : (
    <CardWrapper title={prod.title}>
      <Typography>
        No props for this production
      </Typography>
    </CardWrapper>
  );
};

export default PropList;
