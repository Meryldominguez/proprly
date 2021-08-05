import React,{ useContext } from "react";
import { 
  AppBar,
  Toolbar,
  IconButton,
  Typography, 
  Button,
  InputBase
} from "@material-ui/core";

import { alpha, createStyles, useTheme } from '@material-ui/core/styles';
import { Menu, Search, AccountCircle} from '@material-ui/icons'

import {
  Link
} from "react-router-dom"



const useStyles = createStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    align:'right',
    flexGrow: 1,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  profileButtons:{
    align:'right'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

function Navbar({logout}) {
  const theme = useTheme()
  const classes = useStyles(theme);

  // const LinkBehavior = React.forwardRef((props, ref) => (
  //   <Link ref={ref} to="/getting-started/installation/" {...props} />
  // ));

  // const {user, isLoading} = useContext(UserContext)

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Proprly
        </Typography>
        <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.root} />
          <div className={classes.sectionDesktop}>
        <Button component={Link} to="/productions" color="inherit" >Productions</Button>
        
        <IconButton
              edge="end"
              aria-label="account of current user"
              color="inherit"
              component={Link}
              to="/profile"
            >
              <AccountCircle />
            </IconButton>

        <Button component={Link} to="/signup" color="inherit"> Signup</Button>
        <Button component={Link} to="/login" color="inherit"> Login</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar