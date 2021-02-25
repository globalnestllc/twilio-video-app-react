import React from 'react';

import { registerModule } from '@eventdex/core';
import LoungeModule from '@eventdex/lounge';
import ScheduleModule from '@eventdex/schedule';
import EventModule from '@eventdex/event';
import LeadsModule from '@eventdex/leads';
import LiveStreamModule from '@eventdex/liveStream';
import ChatModule from '@eventdex/chat';
import CoreModule from '@eventdex/core';
// import VideoModule from '@eventdex/video'
import CommonModule, { LoadingWrapper } from '@eventdex/common';
import AuthModule from '@eventdex/auth';
// import {useDispatch, useSelector} from 'react-redux'
// import { actionStartSelfTestVideoCall } from "@eventdex/video/src/store/actions";

registerModule(LoungeModule);
registerModule(ScheduleModule);
registerModule(EventModule);
registerModule(LeadsModule);
registerModule(LiveStreamModule);
registerModule(ChatModule);
registerModule(CoreModule);
registerModule(CommonModule);
registerModule(AuthModule);
// registerModule(VideoModule)

export default function EventdexModules(props) {
  return <React.Fragment></React.Fragment>;
}
