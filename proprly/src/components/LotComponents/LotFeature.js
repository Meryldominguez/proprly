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
      currentFeature,
      feature,
      currentTab,
      setTab,
      profile,
      refreshLots,
    },
) => {
  const [
    item,
    itemLoading,
    setFeature,
    // refresh,
  ] = useFetchLot(currentFeature);

  useEffect(() => setFeature(currentFeature), [currentFeature]);

  return (!itemLoading && item) ?
      (
        <TabBar
          startingTab={currentTab}
          tabsArr={
            [
              {title: 'New Item',
                component:
              <LotNewForm
                setFeature={feature}
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
                setTab={setTab}
                refreshLots={refreshLots}
                lot={item}
              />},
              (profile['isAdmin'] && item.id) &&
              {title: 'Delete',
                component:
              <LotDelete
                refreshFeature={feature}
                refreshLots={refreshLots}
                item={item}
                query={query}
              />},
            ]}
        />
      ) :
      <LoadingSpinner />;
};

export default LotFeature;
