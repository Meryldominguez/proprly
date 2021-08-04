import { useContext } from "react";
import { 
  AppBar,
  Toolbar,
  IconButton,
  Typography, 
  Button,
  Menu
} from "@material-ui/core";

import { createStyles } from '@material-ui/core/styles';
// import {Menu} from '@material-ui/icons'

// function BrandIcon(props) {
//   return (
//     <SvgIcon {...props}>
//       {/* <path d="M2430 4970 l-2155 -5 -52 -24 c-66 -29 -143 -111 -169 -176 -19 -49 -19 -102 -19 -2270 0 -2168 0 -2221 19 -2270 26 -65 103 -147 169 -176 l52 -24 2230 0 2230 0 56 28 c66 32 132 99 162 165 l22 47 0 2220 c0 2520 9 2275 -86 2379 -60 66 -122 94 -226 104 -43 4 -1048 5 -2233 2z m345 -784 c470 -77 731 -295 823 -691 31 -129 46 -317 39 -480 -10 -228 -43 -367 -125 -530 -38 -75 -62 -106 -141 -185 -107 -106 -210 -167 -356 -213 -199 -62 -338 -77 -706 -77 l-269 0 0 -615 0 -615 -360 0 -360 0 0 1716 0 1716 678 -5 c564 -4 694 -7 777 -21z"/>
//       <path d="M2040 3111 l0 -481 249 0 c269 0 322 6 412 46 141 64 209 202 209 429 0 205 -52 333 -164 409 -91 62 -130 68 -433 74 l-273 4 0 -481z"/> */}
//     </SvgIcon>
//   );
// }

const useStyles = createStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    align:'left',
    flexGrow: 1,
  },
  searchBar:{
    align:'right'
  }
}));

function Navbar({logout}) {
  const classes = useStyles();


  // const {user, isLoading} = useContext(UserContext)

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Proprly
        </Typography>

        <Button color="inherit" className={classes.searchBar}>extra</Button>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar