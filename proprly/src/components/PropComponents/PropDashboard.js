import React, {
  useState,
  useContext,
  useEffect,
} from 'react';
import UserContext from '../../context/UserContext';
import {
  useParams,
} from 'react-router-dom';
import TabBar from '../TabBar';
import LoadingSpinner from '../Spinner';
import {useFetchProductions} from '../../hooks/useFetch';
import PropManager from './PropManager';
// import {useFetchProps} from '../../hooks/useFetch';

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
  const {profile, isLoading} = useContext(UserContext);
  const {featuredId} = useParams();
  const [view, setView] = useState();
  const [productions, prodsLoading, newSearch, refreshProds] = useFetchProductions('');
  const [id, setId] = useState(Number(featuredId));

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

  return (!isLoading && !prodsLoading && view) ?
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
