import React from 'react'
import TabBar from '../TabBar';
import LocDetail from './LocationDetail'
import LocEditForm from '../../forms/LocationEditForm'
import LocNewForm from '../../forms/LocationNewForm';
import LocDelete from './LocationDelete'
import LoadingSpinner from '../Spinner';

const LocFeature = (
  { 
    currentTab,
    setTab,
    location, 
    locLoading,
    locations, 
    locsLoading, 
    profile, 
    setFeature,
    refreshLocs
  }) => {
  if (location.id) return (!locLoading && !locsLoading && profile)?
  (
      <TabBar
        startingTab={currentTab}
        tabsArr={profile.isAdmin?
          [
            {title:"New Location",component:
              <LocNewForm 
                locations={locations} 
                locsLoading={locsLoading} 
                setFeature={setFeature}
                setTab={setTab}
                refreshLocs={refreshLocs}
                />},
            {title:"Details", component:
              <LocDetail location={location} />},
            {title:"Edit", component:
              <LocEditForm 
                locations={locations} 
                locsLoading={locsLoading} 
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
                locsLoading={locsLoading} 
                setFeature={setFeature}
                setTab={setTab}
                refreshLocs={refreshLocs} 
              />},
            {title:"Details", component:
              <LocDetail location={location} />},
            {title:"Edit", component:
              <LocEditForm 
                locations={locations} 
                locsLoading={locsLoading} 
                location={location}
                setTab={setTab}
                refreshLocs={refreshLocs}
              />},
          ]
        }/>
  )
  :
    <LoadingSpinner />

  return (!locLoading && !locsLoading && profile) ?(
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