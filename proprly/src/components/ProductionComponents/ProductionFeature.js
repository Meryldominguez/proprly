import React, {useContext} from 'react';
import UserContext from '../../context/UserContext';
import CardWrapper from '../CardWrapper';
import TabBar from '../TabBar';
import ProdDetail from './ProductionDetail';
import ProdDelete from './ProductionDelete';
import ProdEditForm from '../../forms/ProductionEditForm';

const ProductionFeature = ({
  setProds, setFeature, setView, production,
}) => {
  const {profile} = useContext(UserContext);

  return (profile && production.id) ?
    (
      <CardWrapper title={production.title}>
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
      </CardWrapper>
    ) :
    (
      <CardWrapper title={production.name}>
        <span>
          {production.notes}
        </span>
      </CardWrapper>
    );
};

export default ProductionFeature;
