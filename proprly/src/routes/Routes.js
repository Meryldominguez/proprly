import React from "react"

import LoggedInRoutes from "./LoggedInRoutes";
import AnonRoutes from "./AnonRoutes";


function Routes({user, isLoading}) {
  return (
      <>
        {/* <AlertContainer alerts={[...alerts]} setAlerts={setAlerts} /> */}
          {user && !isLoading?
          <LoggedInRoutes username={user.username}/>
          :
          <AnonRoutes />}
      </>)
}
export default Routes;
