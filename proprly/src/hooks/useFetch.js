import { useEffect, useState } from "react"
import ProprlyApi from "../api"

const useFetchLots = (q) => {
    const [query, setQuery] = useState(q)
    const [lots, setLots] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    useEffect(()=>{
        async function load(){
            try {
                const resp = await ProprlyApi.getLots(query)
                setLots(resp)
                setIsLoading(false)
                return resp
            } catch (err) {
                console.error(err)
            }
        }
        load()
    },[query, isLoading])

    const search = (data)=>{
        setIsLoading(true)
        setQuery(data)
    }
    return [lots, isLoading, search, setQuery]
}
const useFetchLot = (lotId) => {
    const [id, setId] = useState(lotId)
    const [lot, setLot] = useState()
    const [isLoading,setIsLoading] = useState(true)

    useEffect(()=>{
        async function load(){
            try {
                const resp = (id)?
                    await ProprlyApi.getLot(id)
                    : {
                        id:null,
                        name: "Featured Item",
                        description: "Select an item on the side for more information"
                    }
                setLot(resp)
                setIsLoading(false)
                return resp
            } catch (err) {
                setId(null)
                console.log(err)
            }
        }
        load()
    },[id, isLoading])

    const setFeature = (id)=>{
        setIsLoading(true)
        setId(id)
    }
    return [lot, isLoading, setFeature]
}

const useFetchLocations = (q) => {
    const [query, setQuery] = useState(q)
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
    return [locations, isLoading, setQuery]
}

const useFetchLocation = (locId) => {
  
    const [id, setId] = useState(locId)
    const [isLoading, setIsLoading] = useState(true)
    const [location, setLocation] = useState()

    useEffect(()=>{
        async function load(){
            
            const resp= id?
                await ProprlyApi.getLoc(id)
                : {
                    id:null,
                    name: "Featured location",
                    notes: "Select a location on the side for more information"
                }
            setLocation(resp)
            setIsLoading(false)
            return resp   
        }
        load()
    },[id, isLoading])

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

export {useFetchLots,useFetchLot, useFetchLocations, useFetchLocation, useGetUserProfile}