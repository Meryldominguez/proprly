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
import {useHistory} from 'react-router-dom';

const ProductionFeature = ({
  currentFeature, currentTab, profile, setFeature, setTab, refreshProds,
}) => {
  const [production, prodLoading, refreshFeature] = useFetchProduction(currentFeature);

  useEffect(() => refreshFeature(currentFeature), [currentFeature]);

  if (!prodLoading && production) {
    return (<TabBar
      startingTab={currentTab}
      tabsArr={
        [
          {title: 'New Production',
            component:
              <ProdNewForm
                setFeature={setFeature}
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
                refreshFeature={(id) => setFeature(id)}
                production={production}
                setTab={setTab}
              />},
          (profile['isAdmin'] && production.id) &&
              {title: 'Delete',
                component:
              <ProdDelete
                refreshProds={refreshProds}
                refreshFeature={(id) => setFeature(id)}
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
