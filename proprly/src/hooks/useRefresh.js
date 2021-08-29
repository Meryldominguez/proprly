import {useState} from 'react';


const useRefresh = () => {
  const [state, setState] = useState(true);

  const refresh = () => {
    setState(!state);
  };

  return [state, refresh];
};
export default useRefresh;
