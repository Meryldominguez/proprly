import React from 'react'
import {v4 as uuid} from "uuid";
import {
  Box,
  List,
  ListItem,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid
} from '@material-ui/core'
import RedeemIcon from '@material-ui/icons/Redeem';
import { FixedSizeList } from 'react-window';
// import InfiniteLoader from "react-window-infinite-loader"

import { useFetchLots, useFetchLot } from '../hooks/useFetch'
import LoadingSpinner from './Spinner';
import CardWrapper from './CardWrapper';
import SearchForm from '../forms/SearchForm';


const LotList= ({currentFeature,feature,lots}) =>{
  const renderList = ({index,style})=>{
  return (
  <>
  {console.log(index)}
    <SingleLot 
      style={style}
      featured={currentFeature===lots[index].id} 
      feature={feature} 
      key={uuid()} 
      item={lots[index]} 
    />
  </>
  )
}
  return (
    <Box
      sx={{ bgcolor: 'background.paper' }}
    >
        <FixedSizeList
          height={400}
          itemSize={46}
          itemCount={lots.length}
          overscanCount={3}
        >
          {renderList}
        </FixedSizeList>
    </Box>
  );
}


const SingleLot = ({featured,feature,item,style})=>{
  const handleFeature = (evt)=>{
    evt.preventDefault()
    if (!featured ) feature(item.id)
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
          <ListItemText primary={item.name} />
        </ListItemButton>
      </ListItem>
    )
  }

const LotDashboard = ({searchTerm}) => {
  const [featured, lotLoading, setFeature] = useFetchLot(null)
  const [lots,lotsLoading, search] = useFetchLots(searchTerm?`?searchTerm=${searchTerm}`:"")
  

  return (!lotsLoading && !lotLoading)?
  (<Grid container xs={12} justifyContent="center">
    <Grid item xs={12}>
      <SearchForm search={q=>search(q)}/>
    </Grid>
    <Grid item xs={6}>
      <LotList 
        currentFeature={featured.id}
        feature={(id)=>setFeature(id)} 
        lots={lots}
      />
    </Grid>
    <Grid item xs={6}>
      <CardWrapper title={featured.name}>
        <span>        
          {featured.description}
        </span>
      </CardWrapper>
      </Grid>
    </Grid>
  )
  :
  <LoadingSpinner />
}
 
export default LotDashboard