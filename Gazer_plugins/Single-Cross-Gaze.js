// Initialize global namespace
var checkForSkipFixation;
var singleCrossGazeComplete = false;
let skippedTrialFixation = false;
let singleCrossData = [];
let currObject = "";
let previousObject = "";
let gazeStartTime = 0;
let currGazeTime = 0;
let trialStart = 0;
let duration = 0;
let left = 0;
let right = 0;
let bottom = 0;
let crossTop = 0;
let centerX = 0;
let centerY = 0;

// global definitions for methods included in other .js files, loaded in index.html
var jsPsych;
var webgazer;

/**
 * @function analyzeCurrentPoint
 * 
 * Collects the current prediction from webgazer and updates the current gaze object and gaze time
 * based on those x and y coordinates.
 * Once the collection and update are complete, waits 10ms then reruns analyzeCurrentPoint.
 * 
 * If the current gaze time is at the threshold defined using the global variable duration and the gaze
 * is on the fixation cross, the boolean singleCrossGazeComplete is defined as true.
 * This function will stop getting re-called when singleCrossGazeComplete becomes true.
 */

async function analyzeCurrentPoint() {

    // Check if trial is complete or skipped
    if (!singleCrossGazeComplete && !skippedTrialFixation) {

        // Record current time
        let start_time = Date.now();
        // Intialize x and y so they are accessible throughout this block
        let x = 0;
        let y = 0;

        // Calculate the current gaze location
        // Catch errors in Webgazer
        try {
            let prediction = await webgazer.getCurrentPrediction();
            x = prediction["x"];
            y = prediction["y"];

            // Calculate current location of gaze either on cross or off of it
            updateStatus(x, y);
            // Check if gaze has shifted objects
            if (hasChanged()) {
                // Reset the current gaze timer to zero if shift has occurred
                resetOrUpdateTime(resetZero = true);
            } else {
                // Increase the gaze timer if gaze is on same object
                resetOrUpdateTime();
            }

        } catch (e) {
            console.log(e)
        }

        // Record the end of the current point calculation
        let end_time = Date.now()
            // Save the current gaze point including timing information
        singleCrossData.push({ start_time, x, y, analysisTime: end_time - start_time });

        // End the trial if participants have been gazing at the center cross for the provided duration
        if (currGazeTime >= duration && currObject == "cross") {
            singleCrossGazeComplete = true;
            endFixationTrial();
        } else {
            // Begin calculation again in 10s
            setTimeout(analyzeCurrentPoint, 10);
        }
    }

}

/**
 * @function updateStatus
 * 
 * Updates the current status of currObject (global variable) based on where the current Webgazer predicton.
 * 
 * @param {integer} x - x coordinate for current webgazer prediction.
 * @param {integer} y - y coordinate for current webgazer prediction.
 */

function updateStatus(x, y) {
    if (isLookingAtCross(x, y)) {
        currObject = "cross";
    } else {
        currObject = "space";
    }
}

/**
 * @function isLookingAtCross
 * 
 * Returns true if current webgazer coordinates are within 200 pixels of the fixation cross.
 * 
 * @param {integer} x - x coordinate for current webgazer prediction.
 * @param {integer} y - y coordinate for current webgazer prediction.
 * 
 * @returns {boolean} true if coordinates are within 200 pixels of cross
 * @returns {boolean} false if coordinates not within range of cross
 */

function isLookingAtCross(x, y) {
    // Calculate if current x and y coordinates are within 200 pixels of cross dimensions
    if (x < (right + 200) && x > (left - 200) && y < (crossTop + 200) && y > (bottom - 200)) {
        return true;
    }
    return false
}

/**
 * @function hasChanged
 * 
 * Returns true if the current gaze object is different from the previous object.
 * Uses the global variables previousObject and currObject.
 * 
 * @returns true if previous gaze object != current gaze object
 * @returns false if previous gaze object == current gaze object
 */

function hasChanged() {
    // Check if gaze has shifted
    if (previousObject != currObject) {
        // Update previous object if gaze has shifted
        previousObject = currObject;
        return true;
    }
    return false
}

/**
 * @function resetOrUpdateTime
 * 
 * Updates the timer recording how long participant has been staring at the same gaze object.
 * If resetZero is true, resets the current gaze time to zero.
 * Uses the global variables gazeStartTime, currGazeTime
 * 
 * @param {boolean} resetZero - Defaults to false. If true, update the current gaze time to be zero and
 *                              reset the start time for the current gaze to be the current time.
 */

function resetOrUpdateTime(resetZero = false) {
    if (resetZero) {
        gazeStartTime = Date.now();
        currGazeTime = 0;
    } else {
        currGazeTime = Date.now() - gazeStartTime;
    }
}

/**
 * @function endFixationTrial
 * 
 * Ends the current trial to move on to the next one in the jsPsych timeline.
 * Saves the Webgazer x and y coordinates and the gaze time information.
 * 
 * @param NONE
 */

function endFixationTrial() {

    // Turn off the keyboard recrording
    jsPsych.pluginAPI.cancelKeyboardResponse(checkForSkipFixation);
    checkForSkipFixation = "";

    // Create data object to record for trial
    let data = {
        currGazeTime,
        singleCrossData,
        totalGazeTime: Date.now() - trialStart
    };

    // End the current trial and move on to next object in jsPsych timeline
    jsPsych.finishTrial(data);

}

/**
 * @function skipFixationTrial
 * 
 * Ends the current trial to move on to the next one in the jsPsych timeline WHEN SKIP BUTTON IS PRESSED.
 * Saves the webgazer x and y coordinates and saccade time information to the jsPsych.data JSON object.
 * 
 * @param NONE
 */

function skipFixationTrial() {

    // Record the trial as skipped to stop recording points
    skippedTrialFixation = true;
    // Cancel the keyboard handler
    jsPsych.pluginAPI.cancelKeyboardResponse(checkForSkipFixation);
    checkForSkipFixation = "";

    // Create data object to record for trial
    let data = {
        currGazeTime,
        singleCrossData,
        totalGazeTime: Date.now() - trialStart
    };

    // End the current trial and move on to next object in jsPsych timeline
    jsPsych.finishTrial(data);
}

/**
 * @file Single-Cross-Gaze Plugin
 * 
 * Uses Webgazer to track gaze on the fixation cross. Once gaze has been held on the fixation cross for the defined
 * duration, the trial will complete.
 * 
 * @param {integer} duration - Consecutive time in ms to wait for a gaze at the fixation cross. Default is 1000ms.
 * 
 */

var singleCrossGaze = (function (jspsych){

    const info = {
        name: 'Single-Cross-Gaze',
        parameters: {
            duration: {
                type: jspsych.ParameterType.INTEGER,
                description: 'Minimum gaze duration to move on. Default is 5 seconds.',
                default: 500
            }
        }
    }
    
    class singleCrossGazePlugin {
        constructor (jsPsych) {
            this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
        // Reset all modules
        resetModules();

        // Reset the globals for the fixation file
        skippedTrialFixation = false;
        singleCrossGazeComplete = false;
        checkForSkipFixation = "";
        currGazeTime = 0;

        // Calculate the center of the screen
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;

        // Rename trial.duration for easier reference
        duration = trial.duration;

        // Display the fixation cross as HIDDEN and get dimensions
        display_element.innerHTML = "<div class='main'><div id='cross' style='position:absolute;font-size:60px; visibility:hidden;'>+</div></div>";

        let cross = document.getElementById('cross').getBoundingClientRect();
        // Save the cross dimensions to global variables
        bottom = cross.bottom;
        crossTop = cross.top;
        left = cross.left;
        right = cross.right;

        // Move the cross half of its width to the left so it is centered on the screen
        let position = left - cross.width / 2;

        // Display the cross in new centered position 
        display_element.innerHTML = "<div class='main'><div id='cross' style='position:absolute;font-size:60px; left: " + position + "px;'>+</div></div>";

        // Initiate checking for 's' key to skip trial
        checkForSkipFixation = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: skipFixationTrial,
            valid_responses: ['s'],
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        });

        // Save the time for the start of the trial
        // Initiate tracking of Webgazer points
        trialStart = Date.now();
        gazeStartTime = Date.now();
        analyzeCurrentPoint();
    }
}

    singleCrossGazePlugin.info = info;

    return singleCrossGazePlugin;
}) (jsPsychModule);