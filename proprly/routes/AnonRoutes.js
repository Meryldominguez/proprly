// import React, { useContext } from 'react'
// import { Route, Link, Redirect, Switch } from "react-router-dom"
// import { Jumbotron } from "react-bootstrap"

// import LoginForm from "../src/forms/LoginForm"
// import SignupForm from "../src/forms/SignupForm"
// import UserContext from '../context/UserContext'
 
// const AnonRoutes = () => {

//   const {login, signup } = useContext(UserContext)

//   return (
//       <Switch>
//     <Route exact path="/">
//       <Jumbotron>
//           <h1>Welcome!</h1>
//         <p>
//           Sign up or login to apply for jobs!
//         </p>
//           <Link className="btn btn-primary btn-lg mx-2" to="/login"> Login </Link>
//           <Link className="btn btn-primary btn-lg mx-2" to="/signup"> Signup </Link>
//       </Jumbotron>
//     </Route>
//     <Route exact path="/login">
//     <LoginForm login={(data)=>login(data)}/>
//    </Route>
//    <Route exact path="/signup">
//      <SignupForm signup={(data)=>signup(data)}/>
//    </Route>
//    <Redirect to="/"/>
//     </ Switch>
//   )
// }
 
// export default AnonRoutes