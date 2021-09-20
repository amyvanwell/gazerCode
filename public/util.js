/**
 * @file util.js
 * 
 * Confirms a connection to the laptop camera, otherwise redirects to a no camera landing page.
 * 
 * @param {bool} show - Whether to make the Webgazer video feed and mouse visible.
 */

var constraints = { audio: false, video: true };
navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    console.log('Camera is operational.');
}).catch(err => {
    if (err.name == "NotAllowedError") {
        window.location.href = "/no_camera.html";
    }
});