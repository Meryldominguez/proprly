import React, {
  useState,
  useEffect,
} from 'react';
import {
  Redirect,
  useParams,
} from 'react-router-dom';
import TabBar from '../TabBar';
import LoadingSpinner from '../Spinner';
import {useFetchProductions} from '../../hooks/useFetch';
import PropManager from './PropManager';

function idIndexOf(item, list) {
  const [res]=list.filter((i, idx)=>{
    if (i.id===item.id) {
      i.idx=idx;
      return i;
    }
  });
  if (!res) return -1;
  return res.idx;
}

const PropDashboard = () => {
  const {featuredId} = useParams();
  const [view, setView] = useState();
  const [productions, prodsLoading] = useFetchProductions('');
  const [id] = useState(Number(featuredId));

  useEffect(()=>{
    if (featuredId) {
      const index = idIndexOf({id}, productions);
      if (index !== -1) {
        setView(String(index));
      };
    } else {
      setView('0');
    }
  }, [productions]);

  if (!prodsLoading && productions.length === 0) return <Redirect to='/productions' />;

  return (!prodsLoading) ?
    <TabBar
      startingTab={view}
      tabsArr={productions.map((prod)=>{
        return {
          title: prod.title,
          component:
            <PropManager
              prodId={prod.id}
            />,
        };
      })}
    /> :
    <LoadingSpinner />;
};

export default PropDashboard;
