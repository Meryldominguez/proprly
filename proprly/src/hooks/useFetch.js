// import { useEffect, useState } from "react"
// import JoblyApi from "../api"

// const useFetchCompanies = () => {
//     const [query, setQuery] = useState("")
//     const [isLoading,setIsLoading] = useState(true)
//     const [companies, setCompanies] = useState()

//     useEffect(()=>{
//         async function load(){
//             const resp = await JoblyApi.getCompanies(query)
//             setCompanies(resp)
//             setIsLoading(false)
//             return resp
//         }
//         load()
//     },[query])

//     const search = (data)=>{
//         setIsLoading(true)
//         setQuery(data)
//     }
//     return [companies, isLoading, search]
// }

// const useFetchCompany = (handle) => {
//     const [company, setCompany] = useState()
//     useEffect(()=>{
//         async function load(){
//             const resp = await JoblyApi.getCompany(handle)
//             setCompany(resp)
//             return resp
//         }
//         load()
//     },[handle])
//     return [company]
// }

// const useFetchJobs = () => {
//     const [jobs, setJobs] = useState()
//     useEffect(()=>{
//         async function load(){
//             const resp = await JoblyApi.getJobs()
//             setJobs(resp)
//             return resp
//         }
//         if (!jobs) load()
//     },[jobs])
//     return [jobs, setJobs]
// }
// const useGetUserProfile = (username) => {
//     const [profile, setProfile] = useState()
//     const [isLoading, setIsLoading] = useState(true)

//     useEffect(()=>{
//         setIsLoading(true)
//         async function load(){
//             const res = await JoblyApi.getProfile(username)
//             setProfile(res.user)
//             setIsLoading(false)
//             return res
//             }
//         if (username) load()
//         setIsLoading(false)
//     },[username,isLoading])

//     const updateProfile = async (data) => {
//         const resp = await JoblyApi.patchProfile(username,data)
//         setProfile(resp.user)
//         return resp
//     }
//     const authProfile = async (password) => {
//         const resp = await JoblyApi.Login({username,password})
//         return resp.token? true: false
//     }

//     const Apply = async (jobID) => {
//         const resp = await JoblyApi.apply(username,jobID)
//         setIsLoading(true)
//         return resp
        
//     }

//     return [[profile,setProfile], isLoading, authProfile, updateProfile, Apply]
// }

// export {useFetchCompanies, useFetchJobs, useFetchCompany, useGetUserProfile}