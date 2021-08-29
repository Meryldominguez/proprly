import React, {useEffect, useState} from 'react';
import {v4 as uuid} from 'uuid';
import {
  Box,
  Tab,
} from '@material-ui/core';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import {useHistory} from 'react-router-dom';

export default function TabBar({tabsArr, startingTab = '0'}) {
  const [activeTab, setActiveTab] = useState(startingTab);
  const history = useHistory();
  const handleChange = (evt, newValue) => {
    evt.preventDefault();
    setActiveTab(newValue);
  };

  useEffect(()=>{
    if (history.location.pathname.slice(0, 6)==='/props') {
      const idArr = tabsArr.map((prod)=>{
        return prod.component.props.prodId;
      });
      history.push(`/props/${idArr[Number(activeTab)]}`);
    }
  }, [activeTab]);

  return (
    <Box sx={{height: '100%', width: '100%', typography: 'body1'}}>
      <TabContext value={activeTab}>
        <Box sx={{padding: 1, borderBottom: 1, borderColor: 'divider'}}>
          <TabList variant="scrollable" onChange={handleChange} aria-label="tabs">
            {tabsArr.map((tab, idx) => {
              if (tab) return <Tab key={uuid()} label={tab.title} value={`${idx}`} />;
            })}
          </TabList>
        </Box>
        {tabsArr.map((tab, idx) => {
          if (tab) {
            return (
              <TabPanel
                style={{height: '100%'}}
                key={uuid()}
                value={`${idx}`}
              >
                {tab.component}
              </TabPanel>);
          }
        })}
      </TabContext>
    </Box>
  );
}
