// import React from 'react'
// import { Route, Link, Redirect, Switch} from "react-router-dom"
// import { Jumbotron } from "react-bootstrap"

// import Companies from "../components/Companies"
// import Company from "../components/Company"
// import JobList from "../components/Joblist"

// import ProfileForm from "../src/forms/ProfileForm"

 
// const LoggedInRoutes = ({username}) => {
  
//   return (
//       <Switch >
//     <Route exact path="/">
//     <Jumbotron>
//       <h1>Hello, {username}</h1>
//         <p>
//           Apply for jobs! Make money
//         </p>
//           <Link className="btn btn-primary btn-lg mx-2" to="/companies"> Companies</Link>
//           <Link className="btn btn-primary btn-lg mx-2" to="/jobs"> Jobs </Link>
//     </Jumbotron>
//     </Route>
//     <Route exact path="/companies/:handle" component={Company} />

//     <Route exact path="/companies" component={Companies} />

//     <Route exact path="/jobs" component={JobList} />

//     <Route exact path="/profile">
//       <ProfileForm />
//     </Route>
//     <Redirect to="/" />
//     </Switch>
//   )
// }
 
// export default LoggedInRoutes