import React,{useContext} from 'react'
import UserContext from '../../context/UserContext';
import CardWrapper from '../CardWrapper';
import TabBar from '../TabBar';
import LocDetail from './LocationDetail'
// import LotEditForm from '../forms/LotEditForm'
import LocDelete from './LocationDelete'

const LocFeature = ({setLocs,setFeature,location}) => {
  const {profile} = useContext(UserContext)

  return (location.id)?
  (
    <CardWrapper title={location.name}>
      <TabBar
        tabsArr={profile.isAdmin?
          [
            {title:"Details", component:<LocDetail location={location} />},
            {title:"Edit", component:
              <LocDetail location={location} />},
            // {title:"Edit", component:<LotEditForm location={location} />},
            {title:"Delete", component:
              <LocDelete
                refreshLocs={(i)=>setLocs([i])} 
                refreshFeature={(id)=>setFeature(id)} 
                id={location.id} />}
          ]
          :
          [
            {title:"Details", component:<LocDetail location={location} />},
            {title:"Edit", component:<LocDetail location={location} />},
            // {title:"Edit", component:<LotEditForm location={location} />},
          ]
        }/>
    </CardWrapper>
  )
  :
    <CardWrapper title={location.name}>
      <span>        
        {location.notes}
      </span>
    </CardWrapper>
}
 
export default LocFeature