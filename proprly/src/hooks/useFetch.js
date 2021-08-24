import {
  useEffect,
  useState,
  useContext,
} from 'react';
import {useHistory} from 'react-router-dom';
import ProprlyApi from '../api';
import AlertContext from '../context/AlertContext';

const formatDate = (date) => {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).length < 2 ?
   `0${date.getMonth() + 1}` : String(date.getMonth() + 1);
  const day = String(date.getDate()).length < 2 ? `0${date.getDate()}` : String(date.getDate());

  return `${year}-${month}-${day}`;
};

const useFetchLots = (q) => {
  const [query, setQuery] = useState(q);
  const [lots, setLots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const load = async ()=>{
      try {
        const resp = await ProprlyApi.getLots(query);
        setLots(resp);
        setIsLoading(false);
        return resp;
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [query, isLoading]);

  const search = (data) => {
    setIsLoading(true);
    setQuery(data);
  };
  const triggerRefresh = () => {
    setIsLoading(true);
  };

  return [lots, isLoading, search, triggerRefresh];
};
const useFetchLot = (lotId) => {
  const {setAlerts} = useContext(AlertContext);
  const history = useHistory();
  const [id, setId] = useState(lotId);
  const [lot, setLot] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async ()=>{
      setIsLoading(true);
      try {
        const resp = (id) ?
          await ProprlyApi.getLot(id) :
          {
            id: null,
            name: 'Featured Item',
            description: 'Select an item on the side for more information',
          };
        setLot(resp);
        setIsLoading(false);
        return resp;
      } catch (err) {
        setId(null);
        history.push('/lots');
        setAlerts([...err.map((e) => e = {severity: e.severity || 'error', msg: e.msg})]);
      }
    };
    load();
  }, [id]);

  const refreshFeature = (i) => {
    setId(i);
  };
  return [lot, isLoading, refreshFeature];
};

const useFetchLocations = () => {
  const [query, setQuery] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState();
  useEffect(() => {
    const load = async ()=>{
      const resp = await ProprlyApi.getLocs(query);
      setLocations(resp);
      setIsLoading(false);
      return resp;
    };
    load();
  }, [query, isLoading]);

  const triggerRefresh = () => {
    setIsLoading(true);
  };
  return [locations, isLoading, triggerRefresh];
};

const useFetchLocation = (locId) => {
  const {setAlerts} = useContext(AlertContext);
  const history = useHistory();
  const [id, setId] = useState(locId);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState();

  useEffect(() => {
    const load = async ()=> {
      setIsLoading(true);
      try {
        const resp = id ?
          await ProprlyApi.getLoc(id) :
          {
            id: null,
            name: 'Featured location',
            notes: 'Select a location on the side for more information',
          };
        setLocation(resp);
        setIsLoading(false);
      } catch (err) {
        setId(null);
        history.push(`/locations`);
        setAlerts([...err.map((e) => e = {severity: e.severity || 'error', msg: e.msg})]);
      }
    };
    load();
  }, [id]);

  return [location, isLoading, setId];
};

const useFetchProductions = (q) => {
  const [query, setQuery] = useState(q);
  const [prods, setProds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const load = async ()=> {
      try {
        const resp = await ProprlyApi.searchProds(query);
        setProds(resp);
        setIsLoading(false);
        return resp;
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [query, isLoading]);

  const search = (data) => {
    setIsLoading(true);
    setQuery(data);
  };
  const triggerRefresh = () => {
    setIsLoading(true);
  };

  return [prods, isLoading, search, triggerRefresh];
};

const useFetchProduction = (prodId) => {
  const {setAlerts} = useContext(AlertContext);
  const history = useHistory();
  const [id, setId] = useState(prodId);
  const [isLoading, setIsLoading] = useState(true);
  const [prod, setProd] = useState();

  useEffect(() => {
    const load = async ()=>{
      try {
        const resp = (id) ?
          await ProprlyApi.getProd(id) :
          {
            id: null,
            title: 'Featured Production',
            notes: 'Select an production on the side for more information',
          };
        setProd({
          ...resp,
          dateStart: resp.dateStart ? formatDate(new Date(resp.dateStart)) : null,
          dateEnd: resp.dateEnd ? formatDate(new Date(resp.dateEnd)) : null,
        });
        setIsLoading(false);
        return resp;
      } catch (err) {
        setId(null);
        history.push(`/productions`);
        setAlerts([...err.map((e) => e = {severity: e.severity || 'error', msg: e.msg})]);
      }
    };
    load();
  }, [id]);

  const setFeature = (i) => {
    setId(i);
  };
  return [prod, isLoading, setFeature];
};

const useGetUserProfile = (username) => {
  const [profile, setProfile] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const load = async ()=>{
      const res = await ProprlyApi.getProfile(username);
      setProfile(res.user);
      setIsLoading(false);
      return res;
    };
    if (username) load();
    setIsLoading(false);
  }, [username, isLoading]);

  const updateProfile = async (data) => {
    const resp = await ProprlyApi.patchProfile(username, data);
    setProfile(resp.user);
    return resp;
  };
  const authProfile = async (password) => {
    const resp = await ProprlyApi.login({username, password});
    return !!resp.token;
  };

  const Apply = async (jobID) => {
    const resp = await ProprlyApi.apply(username, jobID);
    setIsLoading(true);
    return resp;
  };

  return [[profile, setProfile], isLoading, authProfile, updateProfile, Apply];
};

export {
  useFetchLots,
  useFetchLot,
  useFetchLocations,
  useFetchLocation,
  useFetchProductions,
  useFetchProduction,
  useGetUserProfile,
};
