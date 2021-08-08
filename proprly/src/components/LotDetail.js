import React from 'react'
import {
  Grid
} from '@material-ui/core'
import { useFetchLot } from '../hooks/useFetch'
import LoadingSpinner from './Spinner';
import CardWrapper from './CardWrapper';

const LotDetail = ({id}) => {
  const [featured, lotLoading] = useFetchLot(id?id:null)
  return (!lotLoading && featured)?
  (<Grid>
      <CardWrapper title={featured.name}>
        <span>        
          {featured.notes}
        </span>
      </CardWrapper>
    </Grid>
  )
  :
  <LoadingSpinner />
}
 
export default LotDetail