import React,{
    useContext
} from 'react';
import {
    useHistory
} from 'react-router-dom'
import AlertContext from "../../context/AlertContext";
import {
    Grid,
    Button
} from '@material-ui/core'
import ProprlyApi from '../../api'

const LotDelete = ({refreshLots,refreshFeature,id, query}) => {
    const {setAlerts} = useContext(AlertContext)
    const history = useHistory()

    const handleClick = async (evt)=>{
        evt.preventDefault()
        try {
            const resp = await ProprlyApi.deleteLot(id)
            query?
                history.push(`/lots/?${query}`)
                :
                history.push(`/lots`)
            refreshFeature()
            refreshLots()
            setAlerts([{variant:"success",msg:`Item #${id} has been deleted`}])
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
            Permanently Delete this item? 
            </Button>
        </Grid>
    </Grid>
  )
}
 
export default LotDelete