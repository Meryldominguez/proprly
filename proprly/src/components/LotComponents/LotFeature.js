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

  if (item && item.id) {
    return (!itemLoading) ?
      (
        <TabBar
          startingTab={currentTab}
          tabsArr={profile.isAdmin ?
            [
              {
                title: 'New Item',
                component:
              <LotNewForm
                setFeature={setFeature}
                setTab={setTab}
                refreshLots={refreshLots}
              />,
              },
              {
                title: 'Details',
                component:
              <LotDetail item={item} />,
              },
              {
                title: 'Edit',
                component:
              <LotEditForm
                setFeature={setFeature}
                setTab={setTab}
                refreshLots={refreshLots}
                lot={item}
              />,
              },
              {
                title: 'Delete',
                component:
              <LotDelete
                setFeature={setFeature}
                refreshLots={refreshLots}
                setTab={setTab}
                item={item}
              />,
              },
            ] :
            [
              {
                title: 'New Item',
                component:
              <span>Working on it!</span>,
              },
              {
                title: 'Details',
                component:
              <LotDetail item={item} />,
              },
              {
                title: 'Edit',
                component:
              <LotDetail
                item={item}
              />,
              },
            ]}
        />
      ) :
      <LoadingSpinner />;
  }
  return (!itemLoading && profile) ?
    (
      <TabBar
        startingTab={currentTab}
        tabsArr={
          [
            {title: 'New Item', component: <span>Working on it!</span>},
            {
              title: 'Details',
              component:
        <LotDetail item={item} />,
            },
          ]
        }
      />
    ) : <LoadingSpinner />;
};

export default LotFeature;
