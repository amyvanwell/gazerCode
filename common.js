/**
 * @function showVideoShowMouse
 * 
 * Handles the visibility of the Webgazer video feed and mouse.
 * 
 * @param {bool} show - Whether to make the Webgazer video feed and mouse visible.
 */

function showVideoShowMouse(show) {
    if (show) {
        webgazer.showVideo(true);
        webgazer.showFaceFeedbackBox(true);
        webgazer.showFaceOverlay(true);
        document.body.style.cursor = "auto";
    } else {
        webgazer.showVideo(false);
        webgazer.showFaceFeedbackBox(false);
        webgazer.showFaceOverlay(false);
        document.body.style.cursor = "none";
    }
}

/**
 * @function disablePredictionPoints
 * 
 * Disables the red prediction dot from Webgazer.
 * 
 */

var disablePredictionPoints = () => webgazer.showPredictionPoints(false);

/**
 * @function changeElementByID
 * 
 * Updates the innerHTML of the element corresponding to 'id' to show the string 'str' in the DOM.
 * 
 * @example - changeElementByID("status", "Status is updated.")
 * 
 * @param {string} id - HTMl id of element that you want to change.
 * @param {string} str - The string you want the element to display.
 */

function changeElementByID(id, str) {
    document.getElementById(id).innerHTML = str;
}

/**
 * @function resetModules
 * 
 * Deactivates all trial types.
 * Runs at the beginning of each plugin to ensure that there is no trial overlapping.
 */

function resetModules() {
    doubleImageGazeComplete = true;
    doubleImageDurationComplete = true;
    doubleImageKeyComplete = true;
    singleImageDurationComplete = true;
    singleImageKeyComplete = true;
    singleCrossGazeComplete = true;
    singleDotDurationComplete = true;
}