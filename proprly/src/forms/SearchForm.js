import React, {useState} from 'react'
import querystring from "querystring"
import { Box,Grid, Button } from '@material-ui/core';
import { 
    TextField
 } from '@material-ui/core'
 
const SearchForm = ({search}) => {
    const [formData, setFormData] = useState(
        {
            searchTerm:""
        });

    const handleSubmit = async (evt)=> {
        evt.preventDefault();
        formData.searchterm !=="" ?
            search(`?${querystring.stringify(formData)}`)
            :search("")
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
 
export default SearchForm