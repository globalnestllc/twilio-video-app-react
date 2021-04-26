import React from 'react';

import CoreModule, { registerModule } from '@eventdex/core';
import PlayerModule from '@eventdex/player';
import LoungeModule from '@eventdex/lounge';
import ScheduleModule from '@eventdex/schedule';
import EventModule from '@eventdex/event';
import LiveStreamModule from '@eventdex/liveStream';
import ChatModule from '@eventdex/chat';
// import VideoModule from '@eventdex/video'
import CommonModule from '@eventdex/common';
import AuthModule from '@eventdex/auth';

registerModule(LoungeModule);
registerModule(PlayerModule);
registerModule(ScheduleModule);
registerModule(EventModule);
registerModule(LiveStreamModule);
registerModule(ChatModule);
registerModule(CoreModule);
registerModule(CommonModule);
registerModule(AuthModule);

export default function EventdexModules(props) {
  return <React.Fragment></React.Fragment>;
}
