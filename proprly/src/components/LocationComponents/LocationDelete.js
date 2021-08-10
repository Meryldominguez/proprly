import React,{
    useContext
} from 'react';
import AlertContext from "../../context/AlertContext";
import {
    Grid,
    Button
} from '@material-ui/core'
import ProprlyApi from '../../api'

const LocationDelete = ({refreshLots,refreshFeature,id}) => {
    const {setAlerts} = useContext(AlertContext)


    const handleClick = async (evt)=>{
        evt.preventDefault()
        try {
            
            const resp = await ProprlyApi.deleteLot(id)
            console.log(resp)
            refreshLots()
            refreshFeature()
            setAlerts([{variant:"success",msg:`Locatiion #${id} has been deleted`}])
        } catch (err) {
            setAlerts([...err.map(e=> e={severity:e.severity||'error', msg:e.msg})]);
        }
    }

  return (
    <Grid style={{height:'100%'}} justifyContent='center' container>
        <Grid item>
            <Button 
                onClick={handleClick}
                variant="contained" 
                color="secondary"> 
            Permanently Delete this Location and all the Items in it? 
            </Button>
        </Grid>
    </Grid>
  )
}
 
export default LocationDelete