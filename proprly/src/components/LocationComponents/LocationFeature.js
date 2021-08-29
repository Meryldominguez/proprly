import React, {
  useEffect,
} from 'react';
import TabBar from '../TabBar';
import LocDetail from './LocationDetail';
import LocEditForm from '../../forms/LocationEditForm';
import LocNewForm from '../../forms/LocationNewForm';
import LocDelete from './LocationDelete';
import LoadingSpinner from '../Spinner';
import {useFetchLocation} from '../../hooks/useFetch';

const LocFeature = (
    {
      currentFeature,
      feature,
      currentTab,
      setTab,
      profile,
      locations,
      refreshLocs,
    },
) => {
  const [
    location,
    locLoading,
    setFeature,
    // refreshFeature
  ] = useFetchLocation(currentFeature);

  useEffect(() => setFeature(currentFeature), [currentFeature]);

  if (!locLoading && location && profile) {
    return (<TabBar
      startingTab={currentTab}
      tabsArr={
        [
          {title: 'New Location',
            component:
          <LocNewForm
            setFeature={feature}
            setTab={setTab}
            refreshLocs={refreshLocs}
            locations={locations}
          />},
          {title: 'Details',
            component:
          <LocDetail location={location} />},
          location.id &&
          {title: 'Edit',
            component:
          <LocEditForm
            setTab={setTab}
            refreshLocs={refreshLocs}
            location={location}
            locations={locations}
          />},
          (profile['isAdmin'] && location.id) &&
          {title: 'Delete',
            component:
          <LocDelete
            refreshFeature={feature}
            refreshLocs={refreshLocs}
            location={location}
          />},
        ]}
    />
    );
  }
  return <LoadingSpinner />;
};

export default LocFeature;
