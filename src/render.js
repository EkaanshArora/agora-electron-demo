const AgoraRtcEngine = require('agora-electron-sdk').default
const APPID = "5c2412e4b1dd4ac89db273c928e29b4d"; //Enter App  ID here

let remoteContainer= document.getElementById("remote");

function addVideoStream(elementId){
  let streamDiv=document.createElement("div"); // Create a new div for every stream
  streamDiv.id=elementId;                       // Assigning id to div
  // streamDiv.style.transform="rotateY(180deg)"; // Takes care of lateral inversion (mirror image)
  remoteContainer.appendChild(streamDiv);      // Add new div to container
}
if (!APPID) {
  alert('Please enter APPID in src/render.jsx (line:2)');
}

let rtcEngine = new AgoraRtcEngine();
rtcEngine.initialize(APPID);

rtcEngine.on('joinedChannel', (channel, uid, elapsed) => {
  let localVideoContainer = document.querySelector('#local');
  rtcEngine.setupLocalVideo(localVideoContainer);
})

rtcEngine.on('userJoined', (uid) => {
  addVideoStream(String(uid));
  let remoteVideoContainer = document.getElementById(String(uid));
  rtcEngine.setupViewContentMode(uid, 1);
  rtcEngine.subscribe(uid, remoteVideoContainer)
})

rtcEngine.setChannelProfile(0)
// rtcEngine.setVideoEncoderConfiguration({frameRate:30});
rtcEngine.enableVideo()

document.getElementById('start').onclick = () => {
  rtcEngine.joinChannel(null, "electron", null, Math.floor(new Date().getTime() / 1000))
};

document.getElementById('stop').onclick = () => {
  rtcEngine.leaveChannel();
  document.getElementById('local').innerHTML = '';
  document.getElementById('remote').innerHTML = '';
  // rtcEngine.release();
};
