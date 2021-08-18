import { 
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography, 

  Box
} from "@material-ui/core";
import { 
  Home, 
  AccountCircle
} from '@material-ui/icons'

import {
  Link
} from "react-router-dom"



function Navbar({logout}) {


  return (
    <Box>
    <AppBar position="sticky">
      <Toolbar>
        <IconButton 
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          component={Link}
          to="/"
        >
          <Home />
        
        <Typography 
          variant="h6"
          component="div"
          sx={{ 
            pl:2, 
            display: { xs: 'none', sm: 'block' } }} 
          noWrap
          >
          Proprly
        </Typography>
       </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Button component={Link} to="/lots" color="inherit" >Inventory</Button>
        <Button component={Link} to="/locations" color="inherit" >Locations</Button>
        <Button component={Link} to="/productions" color="inherit" >Productions</Button>
        <IconButton
            edge="end"
            aria-label="account of current user"
            color="inherit"
            component={Link}
            to='/profile'
          >
          <AccountCircle />
        </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
    </Box>
  );
}

export default Navbar