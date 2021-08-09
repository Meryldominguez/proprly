import React,{useContext} from 'react'

import {
  useParams,
  Redirect,
  useHistory
} from 'react-router-dom';
import {v4 as uuid} from "uuid";
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Divider,
  Typography
} from '@material-ui/core'
import RedeemIcon from '@material-ui/icons/Redeem';
import { FixedSizeList } from 'react-window';

import AlertContext from '../context/AlertContext';
import { useFetchLots, useFetchLot } from '../hooks/useFetch'

import LoadingSpinner from './Spinner';
import SearchForm from '../forms/LotSearchForm';
import LotFeature from './LotFeature';
import CardWrapper from './CardWrapper';


const LotList= ({currentFeature,setFeature,lots}) =>{
  const renderList = ({index,style})=>{
  return (
  <>
    <SingleLot 
      style={style}
      feature={(id)=>setFeature(id)}
      featured={currentFeature===lots[index].id} 
      key={uuid()} 
      item={lots[index]} 
    />
  </>
  )
}
  return lots.length>0? (
    <Box
      sx={{ bgcolor: 'background.paper' }}
    >
        <FixedSizeList
          height={700}
          itemSize={70}
          itemCount={lots.length}
          overscanCount={3}
        >
          {renderList}
        </FixedSizeList>
    </Box>
  ):(
    <Box
      sx={{ bgcolor: 'background.paper' }}
    >
    </Box>
  )
}


const SingleLot = ({featured,feature,item,style})=>{
  const history=useHistory()

  const handleFeature = (evt)=>{
    console.log(item.id)
    evt.preventDefault()
    feature(item.id)
    history.push(`/lots/${item.id}`)
  }
    return (
      <ListItem component="div" style={style} disablePadding>
        <ListItemButton
          onClick={handleFeature}
          sx={{ pl: 4 }}
          disabled={featured}
          selected={featured}
          >
          <ListItemIcon>
            <RedeemIcon />
          </ListItemIcon>
          <ListItemText primary={item.name} secondary={item.location} />
        </ListItemButton>
      </ListItem>
    )
  }

const LotDashboard = ({searchTerm}) => {
  const { featuredId } = useParams()
  const {alerts,setAlerts} = useContext(AlertContext)

  const queryString = searchTerm?`?searchTerm=${searchTerm}`:""
  const [featured, lotLoading, setFeature] = useFetchLot(featuredId)
  const [lots,lotsLoading, search] = useFetchLots(queryString)

  if (!lotsLoading &&!lotLoading && featuredId && featured.id===null) {
    setAlerts([...alerts,{severity:"error",msg:`That item (#${featuredId}) does not exist anymore. Contact us if you believe there is an error!`}])
    return <Redirect to={`/lots`}/>
  }
  return (!lotsLoading && !lotLoading)?
  (<Grid 
      container 
      rowSpacing={3} 
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      justifyContent="center">
    <Grid item xs={12}>
      <SearchForm featuredId={featuredId} resetFeature={(i)=>setFeature(i)} searchLots={q=>search(q)}/>
    </Grid>
    <Divider spacing={4} />
    <Grid item xs={4}>
      {lots.length>0?
      <LotList 
        currentFeature={featured.id}
        setFeature={setFeature}
        lots={lots}
      /> 
      :
      <CardWrapper>
        <Typography spacing={3}>
          No results for your search
        </Typography> 
          <small>Try another term, or searching with location names</small>
        

      </CardWrapper>
      }
    </Grid>
    <Grid item xs={8}>
      <LotFeature setFeature={setFeature} item={featured} />
    </Grid>
  </Grid>
  )
  :
  <LoadingSpinner />
}
 
export default LotDashboard