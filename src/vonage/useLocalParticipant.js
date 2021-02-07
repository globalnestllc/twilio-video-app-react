import React from 'react';

export default function useLocalParticipant(props) {
  const [publisher, setPublisher] = React.useState(null);

  React.useEffect(() => {
    // @ts-ignore
    let publisher = window.OT.initPublisher('#hiddenVideoContainer', { insertDefaultUI: true }, error => {
      if (error) {
        console.log(error);
      } else {
        setPublisher(publisher);
      }
    });

    console.log('setPublisher', publisher);
    return () => {
      publisher.destroy();
    };
  }, []);

  return { publisher };
}
