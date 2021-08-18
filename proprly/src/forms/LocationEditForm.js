import React, {
  useContext, 
  useState
} from 'react'
import {
  useHistory
} from 'react-router-dom'
import { 
  Box, 
  Grid, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem, 
  Button
 } from "@material-ui/core";

import ProprlyApi from '../api';
import AlertContext from '../context/AlertContext'
import { useFetchLocations } from '../hooks/useFetch';
import CardWrapper from '../components/CardWrapper';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const LocEditForm = ({locations,isLoading,location,refreshLocs, refreshFeature, setView}) => {
  const initial= {
    name:location.name,
    notes:location.notes,
    parentId:location.parentId?location.parentId:0
  }  
    const history = useHistory()
    const [formData, setFormData] = useState(initial);
   

    const {alerts, setAlerts} = useContext(AlertContext)

    const handleSubmit = async (evt)=> {
      console.log(formData)
        evt.preventDefault();
        try {
            const trimmedData = {
              name:formData.name.trim(),
              notes:formData.notes.trim(),
              parentId: formData.parentId===0? null : formData.parentId
            }
           console.log({...formData,...trimmedData})
            const newLoc = await ProprlyApi.updateLoc(location.id,{...formData,...trimmedData})
            
            setView("1")
            refreshLocs()
            refreshFeature(newLoc.id)
            history.push(`/locations/${newLoc.id}`)
            setAlerts([...alerts,{severity:"success", msg:"Location created!"}])
        } catch (error) {
            console.log(error)
            setFormData({...formData})
            setAlerts([...error.map(e=> e={severity:e.severity||'error', msg:e.msg})]);
        }
    };
    const isFormDirty = ()=>{
      return (initial.name === formData.name.trim() &&
        initial.notes===formData.notes.trim() &&
        initial.parentId ===formData.parentId)? true: false
    }

    const handleChange = evt => {
        const {name,value} = evt.target;
        console.log(name, value)
        setFormData({
            ...formData,
            [name]: value
        });
        console.log(formData)
    };

    const resetForm = ()=>{
        setFormData(initial)
    }
    const renderMenuList = (list, defaultDepth=0, step=10)=>{
      const nextDepth = defaultDepth + step

      return list.map(item=>[<MenuItem 
        style={{ 
        marginLeft: defaultDepth === 0 ? 0 : nextDepth}}
        value={item.locationId}
      >
        {item.locationName}
      </MenuItem>,
     item.children && renderMenuList(item.children, defaultDepth=nextDepth)]
     )
    }

    return(
    <CardWrapper title={location.name}>
    <Box component="form"  onSubmit={handleSubmit} >
    <Grid 
        container 
        rowSpacing={{xs:4}} 
        spacing={2} 
        justifyContent="center"
        >
      <Grid xs={8} item align="center"> 
        <TextField
          fullWidth
          id="title-input"
          name="name"
          label="Name"
          type="text"
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={8} > 
      <FormControl sx={{minWidth: 300 }}>
        <InputLabel htmlFor="parentId">Parent Location</InputLabel>
        <Select 
          value={formData.parentId} 
          name="parentId" id="parentId" 
          label="Parent Location"
          onChange={handleChange}
          MenuProps={MenuProps}>
          <MenuItem value={0}>
            No Parent
          </MenuItem>
          {!isLoading && renderMenuList(locations)}
        </Select>
      </FormControl>
      </Grid> 
      <Grid xs={8} item>
        <TextField 
          fullWidth
          type="text"
          name="notes"
          multiline
          maxRows={4}
          minRows={4}
          label="Notes"
          variant="outlined"
          value={formData.notes}
          onChange={handleChange}
        />   
      </Grid> 
      <Grid item xs={10}>
        <Grid spacing={2} container>
          <Grid item xs={6}>
            <Button 
              variant="outlined" color='primary'  
              fullWidth 
              disabled={isFormDirty()}
              onClick={resetForm}>
                Reset
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              disabled={isFormDirty()}
              variant="contained" 
              color='primary'  
              fullWidth 
              onClick={handleSubmit}>
                Edit Location 
            </Button>
          </Grid>
        </Grid>    
      </Grid>    
    </Grid>
  </Box>
  </CardWrapper>)
}
 
export default LocEditForm