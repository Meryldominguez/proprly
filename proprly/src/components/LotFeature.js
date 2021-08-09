import React,{useContext} from 'react'
import UserContext from '../context/UserContext';
import CardWrapper from './CardWrapper';
import TabBar from './TabBar';
import LotDetail from './LotDetail'
// import LotEditForm from '../forms/LotEditForm'
import LotDelete from './LotDelete'

const LotFeature = ({setLots,setFeature,item}) => {
  const {profile} = useContext(UserContext)

  return (item.id)?
  (
    <CardWrapper title={item.name}>
      <TabBar
        tabsArr={profile.isAdmin?
          [
            {title:"Details", component:<LotDetail item={item} />},
            {title:"Edit", component:
              <LotDetail item={item} />},
            // {title:"Edit", component:<LotEditForm item={item} />},
            {title:"Delete", component:
              <LotDelete
                refreshLots={(i)=>setLots([i])} 
                refreshFeature={(id)=>setFeature(id)} 
                id={item.id} />}
          ]
          :
          [
            {title:"Details", component:<LotDetail item={item} />},
            {title:"Edit", component:<LotDetail item={item} />},
            // {title:"Edit", component:<LotEditForm item={item} />},
          ]
        }/>
    </CardWrapper>
  )
  :
    <CardWrapper title={item.name}>
      <span>        
        {item.description}
      </span>
    </CardWrapper>
}
 
export default LotFeature