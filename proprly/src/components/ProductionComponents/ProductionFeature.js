import React, {
  useEffect,
} from 'react';
import {useFetchProduction} from '../../hooks/useFetch';
import TabBar from '../TabBar';
import ProdDetail from './ProductionDetail';
import ProdDelete from './ProductionDelete';
import ProdEditForm from '../../forms/ProductionEditForm';
import ProdNewForm from '../../forms/ProductionNewForm';
import LoadingSpinner from '../Spinner';

const ProductionFeature = ({
  currentFeature, currentTab, profile, setFeatId, setTab, refreshProds,
}) => {
  const [
    production,
    prodLoading,
    setProduction,
    refreshFeature,
  ] = useFetchProduction(currentFeature);

  useEffect(() => setFeatId(currentFeature), [currentFeature]);

  if (!prodLoading && production && profile) {
    return (<TabBar
      startingTab={currentTab}
      tabsArr={
        [
          {title: 'New Production',
            component:
              <ProdNewForm
                setFeature={setFeatId}
                setTab={setTab}
                refreshProds={refreshProds}
              />},
          {title: 'Details', component:
              <ProdDetail production={production} />},
          production.id &&
              {title: 'Edit',
                component:
              <ProdEditForm
                refreshProds={refreshProds}
                refreshFeature={(id) => setFeatureId(id)}
                production={production}
                setTab={setTab}
              />},
          (profile['isAdmin'] && production.id) &&
              {title: 'Delete',
                component:
              <ProdDelete
                refreshProds={refreshProds}
                refreshFeature={setFeatureId}
                id={production.id}
                setTab={setTab}
              />},
        ]}
    />
    );
  }
  return <LoadingSpinner />;
};

export default ProductionFeature;
