import React from 'react';

import CoreModule, { registerModule } from '@eventdex/core';
import PlayerModule from '@eventdex/player';
import LoungeModule from '@eventdex/lounge';
import ScheduleModule from '@eventdex/schedule';
import EventModule from '@eventdex/event';
import ChatModule from '@eventdex/chat';
import CommonModule from '@eventdex/common';

registerModule(LoungeModule);
registerModule(PlayerModule);
registerModule(ScheduleModule);
registerModule(EventModule);
registerModule(ChatModule);
registerModule(CoreModule);
registerModule(CommonModule);

export default function EventdexModules(props) {
  return <React.Fragment></React.Fragment>;
}
