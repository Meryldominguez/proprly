import React,{
    useContext
} from 'react';
import {
    useHistory
} from 'react-router-dom';
import AlertContext from "../../context/AlertContext";
import {
    Grid,
    Button
} from '@material-ui/core'
import ProprlyApi from '../../api'

const LocationDelete = ({refreshLocs,refreshFeature,id}) => {
    const {setAlerts} = useContext(AlertContext)
    const history = useHistory()


    const handleClick = async (evt)=>{
        evt.preventDefault()
        try {
            
            const resp = await ProprlyApi.deleteLoc(id)
            console.log(resp)
            history.push("/locations")
            refreshLocs()
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