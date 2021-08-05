import React, {useContext} from "react"


// import AlertContainer from "../components/AlertContainer"
// import AlertContext from "../context/AlertContext"
import LoggedInRoutes from "./LoggedInRoutes";
import AnonRoutes from "./AnonRoutes";



function Routes({user}) {
  // const {alerts, setAlerts} = useContext(AlertContext)

  
  return (
      <div className="Content-Container">
        {/* <Pagination>
      <Pagination.Prev onClick={history.goBack}/>
      <Pagination.Next  onClick={history.goForward}/>
        </Pagination> */}
        {/* <AlertContainer alerts={[...alerts]} setAlerts={setAlerts} /> */}
          {user ?
          <LoggedInRoutes username={user.username}/>
          :
          <AnonRoutes />}
      </div>)
}
export default Routes;
