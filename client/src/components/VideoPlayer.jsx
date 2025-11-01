// import React, { useRef, useEffect } from "react";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";

// export const VideoPlayer = (props) => {
//   const videoRef = useRef(null);
//   const playerRef = useRef(null);
//   const { options, onReady } = props;

//   useEffect(() => {
//     // Make sure Video.js player is only initialized once
//     if (!playerRef.current) {
//       // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
//       const videoElement = document.createElement("video-js");

//       videoElement.classList.add("vjs-big-play-centered");
//       videoRef.current.appendChild(videoElement);

//       const player = (playerRef.current = videojs(videoElement, options, () => {
//         videojs.log("player is ready");
//         onReady && onReady(player);
//       }));

//       // You could update an existing player in the `else` block here
//       // on prop change, for example:
//     } else {
//       const player = playerRef.current;

//       player.autoplay(options.autoplay);
//       player.src(options.sources);
//     }
//   }, [options, videoRef]);

//   // Dispose the Video.js player when the functional component unmounts
//   useEffect(() => {
//     const player = playerRef.current;

//     return () => {
//       if (player && !player.isDisposed()) {
//         player.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, [playerRef]);

//   return (
//     <div
//       data-vjs-player
//       style={{ width: "600px" }}
//     >
//       <div ref={videoRef} />
//     </div>
//   );
// };

// export default VideoPlayer;


// import React, { useRef, useEffect, useState } from "react";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";

// export const VideoPlayer = (props) => {
//   const videoRef = useRef(null);
//   const playerRef = useRef(null);
//   const { options, onReady } = props;
//   const [containerSize, setContainerSize] = useState({ width: "100%", height: "auto" });

//   useEffect(() => {
//     // Make sure Video.js player is only initialized once
//     if (!playerRef.current) {
//       // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
//       const videoElement = document.createElement("video");

//       videoElement.classList.add("video-js");
//       videoRef.current.appendChild(videoElement);

//       const player = (playerRef.current = videojs(videoElement, options, () => {
//         videojs.log("player is ready");
//         onReady && onReady(player);
//       }));

//       // Set fluid to false to prevent the player from resizing based on the video dimensions
//       player.fluid(false);

//       // You could update an existing player in the `else` block here
//       // on prop change, for example:
//     } else {
//       const player = playerRef.current;

//       player.autoplay(options.autoplay);
//       player.src(options.sources);
//     }

//     // Dispose the Video.js player when the functional component unmounts
//     return () => {
//       const player = playerRef.current;

//       if (player && !player.isDisposed()) {
//         player.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, [options, videoRef]);

//   return (
//     <div
//       ref={videoRef}
//       className="video-container"
//       style={containerSize}
//     />
//   );
// };

// export default VideoPlayer;

import fluidPlayer from 'fluid-player'
import {useEffect, useRef} from "react";

function VideoPlayer({options}) {
  let self = useRef(null);
  let player = null;

  useEffect(() => {
      if (!player) {
        player = fluidPlayer(self.current, {});
      }
  });

  return (
      <>
        <video ref={self} className='h-full w-full'>
          <source src={options?.sources[0]?.src}
                  data-fluid-hd
                  title='1080p'
                  type='application/x-mpegURL'/>
        </video>
      </>
  );
}

export default VideoPlayer;