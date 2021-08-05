import React from "react"
import { Box } from "@material-ui/core";


import LoggedInRoutes from "./LoggedInRoutes";
import AnonRoutes from "./AnonRoutes";


function Routes({user, isLoading}) {

  return (
      <Box>
        {/* <AlertContainer alerts={[...alerts]} setAlerts={setAlerts} /> */}
          {user && !isLoading?
          <LoggedInRoutes username={user.username}/>
          :
          <AnonRoutes />}
      </Box>)
}
export default Routes;
