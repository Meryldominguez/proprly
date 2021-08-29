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
  currentFeature,
  feature,
  currentTab,
  setTab,
  profile,
  refreshProds,
}) => {
  const [
    production,
    prodLoading,
    setFeature,
    // refresh,
  ] = useFetchProduction(currentFeature);

  useEffect(() => setFeature(currentFeature), [currentFeature]);

  if (!prodLoading && production && profile) {
    return (<TabBar
      startingTab={currentTab}
      tabsArr={
        [
          {title: 'New Production',
            component:
          <ProdNewForm
            setFeature={feature}
            setTab={setTab}
            refreshProds={refreshProds}
          />},
          {title: 'Details',
            component:
          <ProdDetail production={production} />},
          production.id &&
          {title: 'Edit',
            component:
          <ProdEditForm
            setTab={setTab}
            refreshProds={refreshProds}
            production={production}
          />},
          (profile['isAdmin'] && production.id) &&
          {title: 'Delete',
            component:
          <ProdDelete
            refreshFeature={feature}
            refreshProds={refreshProds}
            prod={production}
          />},
        ]}
    />
    );
  }
  return <LoadingSpinner />;
};

export default ProductionFeature;
