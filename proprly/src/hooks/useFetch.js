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
    const [isLoading,setIsLoading] = useState(true)
    const [locations, setLocations] = useState()
    useEffect(()=>{
        async function load(){
            const resp = await ProprlyApi.getLocs(query)
            setLocations(resp)
            setIsLoading(false)
            return resp
        }
        load()
    },[query])
    return [locations, isLoading]
}

const useFetchLocation = (input) => {
    const blankFeature = {
        id:null,
        name: "Featured location",
        notes: "Select a location on the side for more information",
        items: []
    }
    const [id, setId] = useState(input? input : blankFeature.id)
    
    const [isLoading, setIsLoading] = useState(true)
    const [location, setLocation] = useState()
    console.log(id, isLoading, location)

    useEffect(()=>{
        async function load(){
            let resp = blankFeature
            if (id) {
                resp = await ProprlyApi.getLoc(id)
            }
            setLocation(resp)
            setIsLoading(false)
            return resp   
        }
        load()
    },[id])

    const setFeature = (id)=>{
        setIsLoading(true)
        setId(id)
    }
    
    return [location, isLoading, setFeature]
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

export {useFetchLots, useFetchLocations, useFetchLocation, useGetUserProfile}