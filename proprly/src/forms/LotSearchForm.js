import React, {useState} from 'react'
import {
    useHistory
} from 'react-router-dom'
import querystring from "querystring"
import { 
    Grid
} from '@material-ui/core';
import { 
    TextField
 } from '@material-ui/core'
 
const LotSearchForm = ({featuredId,resetFeature,searchLots}) => {
    const history = useHistory()
    const [formData, setFormData] = useState(
        {
            searchTerm:""
        });

    const handleSubmit = async (evt)=> {
        evt.preventDefault();
        formData.searchterm !=="" ?
            searchLots(`?${querystring.stringify(formData)}`)
            :searchLots("")
        featuredId?
            history.push(`/lots/${featuredId}?${querystring.stringify(formData)}`)
            :
            history.push(`/lots?${querystring.stringify(formData)}`)
      };

    const handleChange = evt => {
        const {name,value} = evt.target;
        setFormData({
            ...formData,
            [name]:value,
        });
    };
  return (
        <Grid 
            container
            component="form" 
            onSubmit={handleSubmit} 
            spacing={8}
            justifyContent="center"
        >
            <Grid item xs={8}> 
                <TextField
                    fullWidth
                    placeholder="Keyword search"
                    aria-label="Search lots"
                    aria-describedby="basic-addon2"
                    name="searchTerm"
                    value={formData.search}
                    onChange={handleChange}
                />
            </Grid>
        </Grid>
  )
}
 
export default LotSearchForm