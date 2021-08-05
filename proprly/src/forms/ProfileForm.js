import React, {useContext, useEffect, useState} from 'react'


import LoadingSpinner from '../components/Spinner'
import UserContext from '../context/UserContext'
// import AlertContext from '../context/AlertContext'
 
const ProfileForm = () => {

    const {profile, authProfile, isLoading, updateProfile, setProfile}= useContext(UserContext)    
    const [formData, setFormData] = useState(profile);

    // const {alerts, setAlerts} = useContext(AlertContext)
    
    useEffect(()=>{
        let email, firstName, lastName
        if (profile) {
            email = profile.email
            firstName = profile.firstName
            lastName = profile.lastName
            } 
            
        setFormData({email, firstName, lastName, password:""})
    },[profile])


    const handleSubmit = async (evt)=> {
        evt.preventDefault();
        try {
            if(!formData.password) throw Array("Password required to confirm changes!")
            if (await authProfile(formData.password)){
                const {username,...valid} = formData
                await updateProfile({...valid})
                setFormData({...formData,username,password:""})
            } 
            // setAlerts([...alerts,{variant:"success", msg:"Profile updated!"}])
        } catch (error) {
            setFormData({...formData, password:""})
            // setAlerts([...alerts,{variant:"danger", msg:error}])
        }
        
    };
    

    const handleChange = evt => {
        const {name,value} = evt.target;
        setFormData({
            ...formData,
            [name]:value,
        });
    };

    const isFormDirty = ()=>{
        return (profile.email === formData.email &&
            profile.firstName === formData.firstName &&
            profile.lastName === formData.lastName &&
            profile.phone === formData.phone)? false : true
    }
    const resetForm = ()=>{
        const {email, firstName, lastName } = profile
        setFormData({
            email,
            firstName,
            lastName,
            password:"",
        })
        setProfile({...profile})
    }
    return(
        <>
    {!isLoading && profile?
    
    :
    <LoadingSpinner />}
    </>
    )
}
 
export default ProfileForm