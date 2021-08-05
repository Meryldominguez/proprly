import React from 'react'
import { CircularProgress } from '@material-ui/core' 
const LoadingSpinner = () => {
  return (
    <CircularProgress color="secondary" >
    <span className="sr-only">Loading...</span>
    </CircularProgress>
  )
}
 
export default LoadingSpinner