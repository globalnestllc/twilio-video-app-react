import React from 'react';
import { publisherOptions } from './Config';

export default function useLocalParticipant(name) {
  const [publisher, setPublisher] = React.useState(null);

  React.useEffect(() => {
    if (name) {
      // @ts-ignore
      let publisher = window.OT.initPublisher('#hiddenVideoContainer', { ...publisherOptions, name: name }, error => {
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
    }
  }, [name]);

  console.log('useLocalParticipant', name, publisher);
  return { publisher };
}
