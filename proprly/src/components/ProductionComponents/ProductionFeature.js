import React, {
  useEffect,
} from 'react';
import {useFetchProduction} from '../../hooks/useFetch';
import TabBar from '../TabBar';
import ProdDetail from './ProductionDetail';
import ProdDelete from './ProductionDelete';
import ProdEditForm from '../../forms/ProductionEditForm';
import LoadingSpinner from '../Spinner';

const ProductionFeature = ({
  currentFeature, currentTab, profile, setFeature, setView,
}) => {
  const [production, prodLoading, refreshFeature] = useFetchProduction(currentFeature);
  useEffect(() => refreshFeature(currentFeature), [currentFeature]);

  if (production && production.id) {
    return (!prodLoading) ?
    (
        <TabBar
          tabsArr={profile.isAdmin ?
            [
              {title: 'Details', component:
              <ProdDetail production={production} />},
              {
                title: 'Edit',
                component:
              <ProdEditForm
                refreshProds={(i) => setProds([i])}
                refreshFeature={(id) => setFeature(id)}
                production={production}
                setView={setView}
              />,
              },
              {
                title: 'Delete',
                component:
              <ProdDelete
                refreshProds={(i) => setProds([i])}
                refreshFeature={(id) => setFeature(id)}
                id={production.id}
                setView={setView}
              />,
              },
            ] :
            [
              {
                title: 'Details',
                component: <ProdDetail production={production} />,
              },
              {
                title: 'Edit',
                component: <ProdDetail
                  refreshProds={(i) => setProds([i])}
                  refreshFeature={(id) => setFeature(id)}
                  production={production}
                />,
              },
            ]}
        />
    ) : <LoadingSpinner />;
  }
  return (!prodLoading && profile)? (
    <TabBar
      startingTab={currentTab}
      tabsArr={[
        {title: 'New Item', component: <span>Working on it!</span>},
        {
          title: 'Details',
          component:
          <ProdDetail production={production} />,
        },
      ]}
    />
  ): <LoadingSpinner />;
};

export default ProductionFeature;
