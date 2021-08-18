import React,{
  useState,
  useContext
} from 'react'
import UserContext from '../../context/UserContext';
import {
  useParams,
  // Redirect
} from 'react-router-dom';
import {
  Grid,
} from '@material-ui/core'
import LocList from './LocationList';
import LocFeature from './LocationFeature';
import LoadingSpinner from '../Spinner';
import { useFetchLocations, useFetchLocation } from '../../hooks/useFetch';



const LocationDashboard = ({id}) => {
  const {profile, isLoading} = useContext(UserContext)
  const { featuredId } = useParams()

  const [view, setView] = useState("1")
  
  const [locations, locsLoading, refreshLocs] = useFetchLocations()
  const [location, locLoading, setFeature] = useFetchLocation(featuredId || null)

  return !isLoading && !locLoading ?(
  <Grid 
    container 
    rowSpacing={3} 
    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    justifyContent="center"
    >
    <Grid item xs={4}>
      <LocList 
        currentFeature={location.id}
        locations={locations}
        isLoading={locsLoading}
        setTab={(idx)=>setView(idx)}
        feature={(id)=>setFeature(id)}
      />
    </Grid>
    <Grid item xs={8}>
     <LocFeature
      locations={locations}
      isLoading={locsLoading}
      profile={profile}
      location={location}
      currentTab={view}
      setTab={(idx)=>setView(idx)}
      setFeature={(i)=>setFeature(i)} 
      refreshLocs={refreshLocs}
      />
    </Grid>
  </Grid>
) : <LoadingSpinner />
}
 
export default LocationDashboard