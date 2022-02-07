import React from "react";

export function useWindowMessageCallback(callback) {
    React.useEffect(() => {
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

        eventer(messageEvent, function (e) {
            callback(e.message, e.data);
        });
    }, []);
}
