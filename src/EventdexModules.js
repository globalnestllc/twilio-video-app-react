import React from 'react';

import CoreModule, { registerModule } from '@eventdex/core';
import PlayerModule from '@eventdex/player';
import LoungeModule from '@eventdex/lounge';
import ScheduleModule from '@eventdex/schedule';
import EventModule from '@eventdex/event';
import ChatModule from '@eventdex/chat';
import CommonModule from '@eventdex/common';
import { twilioHelper } from '@eventdex/core/src/context';

registerModule(LoungeModule);
registerModule(PlayerModule);
registerModule(ScheduleModule);
registerModule(EventModule);
registerModule(ChatModule);
registerModule(CoreModule);
registerModule(CommonModule);

export default function EventdexModules(props) {
  twilioHelper.initialize(localStorage.email);
  return <React.Fragment></React.Fragment>;
}
