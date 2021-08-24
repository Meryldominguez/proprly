import React, {
  useEffect,
} from 'react';
import TabBar from '../TabBar';
import LotDetail from './LotDetail';
// import LotEditForm from '../forms/LotEditForm'
import LotNewForm from '../../forms/LotNewForm';
import LotDelete from './LotDelete';
import {useFetchLot} from '../../hooks/useFetch';
import LoadingSpinner from '../Spinner';
import LotEditForm from '../../forms/LotEditForm';

const LotFeature = (
    {
      query,
      currentTab,
      setTab,
      currentFeature,
      profile,
      setFeature,
      refreshLots,
    },
) => {
  const [item, itemLoading, refreshFeature] = useFetchLot(currentFeature);

  useEffect(() => refreshFeature(currentFeature), [currentFeature]);

  return (!itemLoading && item) ?
      (
        <TabBar
          startingTab={currentTab}
          tabsArr={
            [
              {title: 'New Item',
                component:
              <LotNewForm
                setFeature={setFeature}
                setTab={setTab}
                refreshLots={refreshLots}
              />},
              {title: 'Details',
                component:
              <LotDetail item={item} />},
              item.id &&
              {title: 'Edit',
                component:
              <LotEditForm
                setFeature={setFeature}
                setTab={setTab}
                refreshLots={refreshLots}
                lot={item}
              />},
              (profile.isAdmin && item.id) &&
              {title: 'Delete',
                component:
              <LotDelete
                setFeature={setFeature}
                refreshLots={refreshLots}
                setTab={setTab}
                item={item}
              />},
            ]}
        />
      ) :
      <LoadingSpinner />;
};

export default LotFeature;
