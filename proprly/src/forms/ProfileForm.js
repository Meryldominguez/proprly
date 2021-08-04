// import React, {useContext, useEffect, useState} from 'react'

// import { 
//     Button,
//     Form,
//     Card,
//     Col,
//     Row,
//  } from 'react-bootstrap'
// import LoadingSpinner from '../components/Spinner'
// import UserContext from '../context/UserContext'
// import AlertContext from '../context/AlertContext'
 
// const ProfileForm = () => {

//     const {profile, authProfile, isLoading, updateProfile, setProfile}= useContext(UserContext)    
//     const [formData, setFormData] = useState(profile);

//     const {alerts, setAlerts} = useContext(AlertContext)
    
//     useEffect(()=>{
//         let email, firstName, lastName
//         if (profile) {
//             email = profile.email
//             firstName = profile.firstName
//             lastName = profile.lastName
//             } 
            
//         setFormData({email, firstName, lastName, password:""})
//     },[profile])


//     const handleSubmit = async (evt)=> {
//         evt.preventDefault();
//         try {
//             if(!formData.password) throw Array("Password required to confirm changes!")
//             if (await authProfile(formData.password)){
//                 const {username,...valid} = formData
//                 await updateProfile({...valid})
//                 setFormData({...formData,username,password:""})
//             } 
//             setAlerts([...alerts,{variant:"success", msg:"Profile updated!"}])
//         } catch (error) {
//             setFormData({...formData, password:""})
//             setAlerts([...alerts,{variant:"danger", msg:error}])
//         }
        
//     };
    

//     const handleChange = evt => {
//         const {name,value} = evt.target;
//         setFormData({
//             ...formData,
//             [name]:value,
//         });
//     };

//     const isFormDirty = ()=>{
//         return (profile.email === formData.email &&
//             profile.firstName === formData.firstName &&
//             profile.lastName === formData.lastName)? false : true
//     }
//     const resetForm = ()=>{
//         const {email, firstName, lastName } = profile
//         setFormData({
//             email,
//             firstName,
//             lastName,
//             password:"",
//         })
//         setProfile({...profile})
//     }
//     return(
//         <>
//     {!isLoading && profile?
//     <Col xs={8} className="m-auto">
//     <Card className="p-3 my-5">
//         <h4>{profile.username|| ""}'s profile</h4>
//     <Form onSubmit={handleSubmit} className="my-4">
//         <Form.Group controlId="formBasicEmail">
//             <Form.Control 
//                 required
//                 type="email" 
//                 placeholder="Enter email"
//                 name="email"
//                 value={formData.email|| ""}
//                 onChange={handleChange}
//                 />
//         </Form.Group>
//         <Form.Group controlId="formBasicUsername">
//             <Form.Control 
//                 disabled
//                 type="text" 
//                 placeholder={profile.username|| ""}
//                 name="username"
//                 onChange={handleChange}
//                 />
//         </Form.Group>
//         <Form.Group >
//             <Row>
//                 <Col>
//                     <Form.Control 
//                         required
//                         type="text" 
//                         placeholder="First Name"
//                         name="firstName"
//                         value={formData.firstName|| ""}
//                         onChange={handleChange}
//                     />
//                 </Col>
//                 <Col>
//                     <Form.Control 
//                         required
//                         type="text" 
//                         placeholder="Last Name"
//                         name="lastName"
//                         value={formData.lastName|| ""}
//                         onChange={handleChange}
//                      />
//                 </Col>
//             </Row>
//         </Form.Group>
//         <Form.Group controlId="formBasicPassword">
//             <Form.Control 
                
//                 type="password" 
//                 placeholder="Password"
//                 name="password"
//                 value={formData.password|| ""}
//                 onChange={handleChange}
//             />
//             <Form.Text className="text-muted text-left">
//             Confirm any changes with your password.
//             </Form.Text>
//         </Form.Group>
//         <Row>
//             <Col xs={8}>
//                 {isFormDirty()?
//                 <Button 
//                     variant="primary" 
//                     block 
//                     type="submit" 
//                     >
//                     Edit Profile
//                 </Button> 
//                 :
//                 <Button 
//                 variant="primary" 
//                 disabled
//                 block
//                 type="submit" 
//                 >
//                 Edit Profile
//             </Button>}
//             </Col>
//             <Col xs={4}>
//                 <Button 
//                     variant="danger" 
//                     block 
//                     onClick={resetForm}
//                     >
//                     Reset
//                 </Button>
//             </Col>
//         </Row>
//     </Form>
//     </Card>
//     </Col>
//     :
//     <LoadingSpinner />}
//     </>
//     )
// }
 
// export default ProfileForm