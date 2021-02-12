import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalVideoToggle() {
  const { isVideoEnabled, toggleVideoEnabled } = useVideoContext();

  // let publishers = otCore.state().publishers
  //
  // // @ts-ignore
  // let isEnabled = Object.keys(publishers.camera).reduce((enabled, camera) => {
  //     // @ts-ignore
  //     camera.on("streamCreated", function(event) {
  //         console.log("Publisher started streaming.");
  //     })
  //     // @ts-ignore
  //     camera.on("streamDestroyed", function(event) {
  //         event.preventDefault();
  //         console.log("Publisher stopped streaming.");
  //     });
  //
  //     // @ts-ignore
  //     return !!camera.getVideoSource().track || enabled
  // }, false);
  // console.log("Canera enabled:",isEnabled)

  // const toggleVideoEnabled = useCallback(() => {
  //     otCore.toggleLocalVideo(!isEnabled);
  // }, [isEnabled]);
  //
  return [isVideoEnabled, toggleVideoEnabled] as const;
}
