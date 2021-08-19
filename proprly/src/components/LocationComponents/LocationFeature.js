import React, { useEffect } from 'react'
import TabBar from '../TabBar';
import LocDetail from './LocationDetail'
import LocEditForm from '../../forms/LocationEditForm'
import LocNewForm from '../../forms/LocationNewForm';
import LocDelete from './LocationDelete'
import LoadingSpinner from '../Spinner';
import { useFetchLocation } from '../../hooks/useFetch';

const LocFeature = (
  { currentFeature,
    currentTab,
    setTab,
    locations, 
    locsLoading, 
    profile, 
    setFeature,
    refreshLocs
  }) => {

  const [location, locLoading, refreshFeature] = useFetchLocation(currentFeature)

  useEffect(()=>refreshFeature(currentFeature),[currentFeature])

  if (location && location.id) return (!locLoading && profile)?
  (
      <TabBar
        startingTab={currentTab}
        tabsArr={profile.isAdmin?
          [
            {title:"New Location",component:
              <LocNewForm 
                locations={locations} 
                setFeature={setFeature}
                setTab={setTab}
                refreshLocs={refreshLocs}
                />},
            {title:"Details", component:
              <LocDetail location={location} />},
            {title:"Edit", component:
              <LocEditForm 
                locations={locations} 
                location={location}
                setTab={setTab}
                refreshLocs={refreshLocs}
                />},
            {title:"Delete", component:
              <LocDelete
                setFeature={setFeature} 
                location={location} 
                setTab={setTab}
                refreshLocs={refreshLocs}
                />}
          ]
          :
          [ {title:"New Location",component:
              <LocNewForm 
                locations={locations} 
                setFeature={setFeature}
                setTab={setTab}
                refreshLocs={refreshLocs} 
              />},
            {title:"Details", component:
              <LocDetail location={location} />},
            {title:"Edit", component:
              <LocEditForm 
                locations={locations} 
                location={location}
                setTab={setTab}
                refreshLocs={refreshLocs}
              />},
          ]
        }/>
  )
  :
    <LoadingSpinner />

  return (!locLoading && profile) ?(
    <TabBar
      tabsArr={
        [
          {title:"New Location",component:
            <LocNewForm locations={locations} locsLoading={locsLoading} setFeature={setFeature} />},
          {title:"Details", component:
            <LocDetail location={location} />},
        ]}
    />) : <LoadingSpinner />
}
 
export default LocFeature