import React from 'react'
import { CircularProgress, Box } from '@material-ui/core' 
const LoadingSpinner = () => {
  return (
    <Box>
      <CircularProgress color="secondary" >
      <span className="sr-only">Loading...</span>
      </CircularProgress>
    </Box>
  )
}
 
export default LoadingSpinner