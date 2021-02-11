import { Tab } from '@material-ui/core';
import React from 'react';
// import TabPanel from "@material-ui/lab/TabPanel";
import ParticipantList from './ParticipantList';
import TabContext from '@material-ui/lab/TabContext';
import AppBar from '@material-ui/core/AppBar';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { useTabContext } from '@material-ui/lab';
import 'opentok-solutions-css';
import './text-chat-customized.scss';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function AlwaysMountedTabPanel(props) {
  const { children, className, style, value: id, Container = 'div', ...other } = props;
  const context = useTabContext();

  if (context === null) {
    throw new TypeError('No TabContext provided');
  }
  const tabId = context.value;

  return (
    <div
      className={className}
      style={{
        ...style,
        visibility: id === tabId ? 'visible' : 'hidden',
      }}
      {...other}
    >
      <Container>{children}</Container>
    </div>
  );
}

export default function VideoParticipants(props) {
  const [currentTab, setCurrentTab] = React.useState('1');

  const handleChange = (event, newTab) => {
    setCurrentTab(newTab);
  };

  return (
    <div>
      <TabContext value={currentTab}>
        <AppBar position="static">
          <TabList onChange={handleChange} aria-label="participants tabs">
            <Tab label="Participants" value="1" />
            <Tab label="Chat" value="2" />
          </TabList>
        </AppBar>
        <TabPanel value="1">
          <ParticipantList />
        </TabPanel>

        <AlwaysMountedTabPanel value="2">
          <div id={'chat-panel'} />
        </AlwaysMountedTabPanel>
      </TabContext>
    </div>
  );
}
