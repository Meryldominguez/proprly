import React, {
  useEffect,
  useState,
} from 'react';
import TabBar from '../TabBar';
import {
  useParams,
} from 'react-router-dom';

import LoadingSpinner from '../Spinner';
import PropManager from './PropManager';

import {useFetchProductions} from '../../hooks/useFetch';

const PropDashboard = ({
}) => {
  const {featuredId} = useParams();
  const queryString = '';

  const [productions, prodsLoading] = useFetchProductions(queryString);
  const [view, setView] = useState('0');

  // useEffect(()=>{
  //   const [res] = productions.filter((prod, idx)=>{
  //     if (prod.id===Number(featuredId)) return prod.idx=idx;
  //   });
  //   console.log(res);
  //   setView(res? String(res['idx']): '0');
  // }, [prodsLoading]);

  if (!prodsLoading) {
    return (<TabBar
      startingTab={view}
      tabsArr={productions.map((prod)=> {
        return {
          title: prod.title,
          component: <PropManager prod={prod} />,
        };
      })}
    />
    );
  };
  return <LoadingSpinner />;
};

export default PropDashboard;
