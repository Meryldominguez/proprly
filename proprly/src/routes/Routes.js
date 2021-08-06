import React from "react"

import LoggedInRoutes from "./LoggedInRoutes";
import AnonRoutes from "./AnonRoutes";


function Routes({user}) {
  return (
      <>
          {user ?
          <LoggedInRoutes username={user.username}/>
          :
          <AnonRoutes />}
      </>)
}
export default Routes;
