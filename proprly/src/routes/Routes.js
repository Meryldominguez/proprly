import React from "react"

import LoggedInRoutes from "./LoggedInRoutes";
import AnonRoutes from "./AnonRoutes";


function Routes({user}) {
  return (
      <>
        {/* <AlertContainer alerts={[...alerts]} setAlerts={setAlerts} /> */}
          {user ?
          <LoggedInRoutes username={user.username}/>
          :
          <AnonRoutes />}
      </>)
}
export default Routes;
