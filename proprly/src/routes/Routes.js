import React from 'react';

import LoggedInRoutes from './LoggedInRoutes';
import AnonRoutes from './AnonRoutes';
import LoadingSpinner from '../components/Spinner';

// eslint-disable-next-line require-jsdoc
function Routes({user, isLoading}) {
  return !isLoading ? (
    <>
      {user ?
        <LoggedInRoutes username={user.username} /> :
        <AnonRoutes />}
    </>
  ) :
    <LoadingSpinner />;
}
export default Routes;
