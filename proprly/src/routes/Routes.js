import React from 'react';

import LoggedInRoutes from './LoggedInRoutes';
import AnonRoutes from './AnonRoutes';
import LoadingSpinner from '../components/Spinner';

// eslint-disable-next-line require-jsdoc
function Routes({user, signup, login, isLoading}) {
  return !isLoading ? (
    <>
      {user ?
        <LoggedInRoutes username={user.username} /> :
        <AnonRoutes signup={signup} login={login} />}
    </>
  ) :
    <LoadingSpinner />;
}
export default Routes;
