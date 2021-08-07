import React from 'react'
import {
  Box
} from '@material-ui/core'
import { useFetchLocations } from '../hooks/useFetch'


const Location = ({id}) => {
  const [locations] = useFetchLocations(id?`?id=${id}`:"")
  console.log(locations)
  return (
    <Box>hello</Box>
  )
}
 
export default Location