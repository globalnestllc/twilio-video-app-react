import React from "react";

import CoreModule, {registerModule} from "@eventdex/core";
// import PlayerModule from '@eventdex/player';
import LoungeModule from "@eventdex/lounge";
// import ScheduleModule from '@eventdex/schedule';
// import EventModule from '@eventdex/event';
import ChatModule from "@eventdex/chat";
import CommonModule from "@eventdex/common";
import twilioHelper from "@eventdex/twilio/src/Twilio/TwilioHelper";

// registerModule(PlayerModule);
// registerModule(ScheduleModule);
// registerModule(EventModule);
registerModule(CoreModule);
registerModule(ChatModule);
registerModule(CommonModule);
registerModule(LoungeModule);

export default function EventdexModules(props) {
    if (localStorage.email) {
        twilioHelper.initialize(localStorage.email);
    }
    return <React.Fragment></React.Fragment>;
}
