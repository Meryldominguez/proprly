import { useEffect, useState } from "react"
import ProprlyApi from "../api"

const useFetchLots = () => {
    const [query, setQuery] = useState("")
    const [isLoading,setIsLoading] = useState(true)
    const [companies, setCompanies] = useState()

    useEffect(()=>{
        async function load(){
            const resp = await ProprlyApi.getCompanies(query)
            setCompanies(resp)
            setIsLoading(false)
            return resp
        }
        load()
    },[query])

    const search = (data)=>{
        setIsLoading(true)
        setQuery(data)
    }
    return [companies, isLoading, search]
}

const useFetchLocations = (query="") => {
    const [locations, setLocations] = useState()
    useEffect(()=>{
        async function load(){
            const resp = await ProprlyApi.getLocs(query)
            console.log(resp)
            setLocations(resp)
            return resp
        }
        load()
    },[query])
    return [locations]
}

// const useFetchJobs = () => {
//     const [jobs, setJobs] = useState()
//     useEffect(()=>{
//         async function load(){
//             const resp = await ProprlyApi.getJobs()
//             setJobs(resp)
//             return resp
//         }
//         if (!jobs) load()
//     },[jobs])
//     return [jobs, setJobs]
// }
const useGetUserProfile = (username) => {
    const [profile, setProfile] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        setIsLoading(true)
        async function load(){
            const res = await ProprlyApi.getProfile(username)
            setProfile(res.user)
            setIsLoading(false)
            return res
            }
        if (username) load()
        setIsLoading(false)
    },[username,isLoading])

    const updateProfile = async (data) => {
        const resp = await ProprlyApi.patchProfile(username,data)
        setProfile(resp.user)
        return resp
    }
    const authProfile = async (password) => {
        const resp = await ProprlyApi.Login({username,password})
        return resp.token? true: false
    }

    const Apply = async (jobID) => {
        const resp = await ProprlyApi.apply(username,jobID)
        setIsLoading(true)
        return resp
        
    }

    return [[profile,setProfile], isLoading, authProfile, updateProfile, Apply]
}

export {useFetchLots, useFetchLocations, useGetUserProfile}