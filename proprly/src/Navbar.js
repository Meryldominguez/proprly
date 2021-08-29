import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Box,
  MenuItem,
  Menu,
  Divider,
} from '@material-ui/core';
import {
  Home,
  AccountCircle,
  MoreVert as MoreIcon,
} from '@material-ui/icons';
import {
  Link,
} from 'react-router-dom';

function Navbar({user, logout}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const menuId = 'primary-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {user? <>
        <MenuItem onClick={handleMenuClose}>
          <Button component={Link} to='/profile' color="inherit">
          Profile
          </Button>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Button onClick={()=>logout()} color="inherit">
          Logout
          </Button>
        </MenuItem>
      </>:
      <MenuItem onClick={handleMenuClose}>Login</MenuItem>}
    </Menu>
  );

  const mobileMenuId= 'mobile-nav-menu';
  const renderDropdown = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMobileMenuClose} >
        <Button component={Link} to="/lots" color="inherit">Inventory</Button>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose}>
        <Button component={Link} to="/locations" color="inherit">Locations</Button>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose}>
        <Button component={Link} to="/productions" color="inherit">Productions</Button>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleMobileMenuClose}>
        <Button component={Link} to="/profile" color="inherit">My Profile</Button>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose}>
        <Button onClick={logout} color="inherit">Logout</Button>
      </MenuItem>
    </Menu>
  );


  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{mr: 2}}
            component={Link}
            to="/"
          >
            <Home />

            <Typography
              variant="h6"
              component="div"
              sx={{
                pl: 2,
                display: {xs: 'block'},
              }}
              noWrap
            >
              Proprly
            </Typography>
          </IconButton>
          <Box sx={{flexGrow: 1}} />
          {user &&
          <>
            <Box sx={{display: {xs: 'none', md: 'flex'}}}>
              <Button component={Link} to="/lots" color="inherit">Inventory</Button>
              <Button component={Link} to="/locations" color="inherit">Locations</Button>
              <Button component={Link} to="/productions" color="inherit">Productions</Button>
              <IconButton
                edge="end"
                aria-label="account of current user"
                color="inherit"
                onClick={handleProfileMenuOpen}
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{display: {xs: 'flex', md: 'none'}}}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </>
          }
        </Toolbar>
      </AppBar>
      {renderDropdown}
      {renderMenu}
    </Box>
  );
}

export default Navbar;
