import {
  useContext 
} from "react";
import UserContext from "./context/UserContext";
import { 
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography, 
  InputBase,
  Box
} from "@material-ui/core";
import { 
  Search, 
  Home, 
  AccountCircle
} from '@material-ui/icons'
import { 
  alpha, 
  styled 
} from '@material-ui/core/styles';
import {
  Link
} from "react-router-dom"



const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));


function Navbar({logout}) {

  const {user, isLoading} = useContext(UserContext)

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
        </IconButton>
        <Typography 
          variant="h6"
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }} 
          noWrap
          >
          Proprly
        </Typography>
        {/* <SearchBox>
          <SearchIconWrapper>
            <Search />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </SearchBox> */}
        <Box sx={{ flexGrow: 1 }} />
        {/* <Box sx={{ display: { xs: 'none', md: 'flex' } }}> */}
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
        {/* </Box> */}
      </Toolbar>
    </AppBar>
    </Box>
  );
}

export default Navbar