// Initialize global namespace
let leftStimDims = {};
let rightStimDims = {};
let stimRightGaze = "";
let stimLeftGaze = "";
let gazerDatadoubleImageGaze = [];
let gazeRecordings = [];
let doubleImageGazeComplete = false;
let doubleImageGazeStart = 0;
let webgazerErrorDoubleImageGaze = false;
let currGazeObject = "";
let prevGazeObject = "";
let currGazeStart = 0;

// These are define in external libraries, included in the index.html
var webgazer;
var jsPsych;

/**
 * @function endTrial
 * 
 * Ends the current trial to move on to the next one in the jsPsych timeline.
 * Saves the Webgazer prediction points, screen size, stimuli paths, and stimuli dimensions.
 * 
 * @param NONE
 */

function finishdoubleImageGaze() {

    console.table(gazeRecordings)

    let data = {
        trialLength: Date.now() - doubleImageGazeStart,
        screenX: window.innerWidth,
        screenY: window.innerHeight,
        gazerDatadoubleImageGaze,
        stimLeftGaze,
        stimRightGaze,
        leftStimDims,
        rightStimDims,
        currGazeObject
    };

    jsPsych.finishTrial(data);
}

/**
 * @function isLookingAtStimulus
 * 
 * Returns true if current webgazer coordinates are within the provided dimensions.
 * 
 * @param {integer} x - x coordinate for current webgazer prediction.
 * @param {integer} y - y coordinate for current webgazer prediction.
 * @param {hash}    dims - hash table keyed with dimensions of object.
 * 
 * @returns {boolean} true if coordinates are within dimensions
 * @returns {boolean} false if coordinates not within range
 */


function isLookingAtStimulus(dims, x, y) {
    // Calculate if current x and y coordinates are within given dimensions
    if (x < (dims.right) && x > (dims.left) && y > (dims.top) && y < (dims.bottom)) {
        return true;
    }
    return false
}

/**
 * @function checkCurrentPointdoubleImage
 * 
 * Collects the current prediction from webgazer and updates the list of points.
 * Once the collection and update are complete, wait 10ms then rerun checkCurrentPointdoubleImage.
 * 
 * @param {INTEGER} duration - Time in ms to display the stimuli for, specified in the original trial parameters.
 * 
 */

async function checkCurrentPointdoubleImage(duration) {
    // Collect a new prediction point if trial is not complete
    if (!doubleImageGazeComplete) {
        // Record the time that the newest point is calculated
        let currTime = Date.now();
        let startTime = currTime - doubleImageGazeStart;
        // Initalize x and y to be accessible in entire block
        let x = 0;
        let y = 0;

        // Collect point if there hasn't been an error with Webgazer in the current trial
        if (!webgazerErrorDoubleImageGaze) {
            let prediction = null
            try {
                prediction = await webgazer.getCurrentPrediction();
            } catch (e) {
                // Catch any Webgazer errors and stop recording
                // Ensures the trial/experiment does not freeze for the participant
                console.log(e)
                webgazerErrorDoubleImageGaze = true;
            }

            if (prediction) {
                // Save the prediction if no error has occurred
                x = prediction["x"];
                y = prediction["y"];

                // Check if looking at one of the stimuli, update temporary gaze object accordingly
                let stim = "";
                if (isLookingAtStimulus(leftStimDims, x, y)) { stim = "left"; }
                if (isLookingAtStimulus(rightStimDims, x, y)) { stim = "right"; }

                // If at beginning of trial and there is no current gaze object,
                // begin recording gaze object as the first stimulus that is looked at
                if (currGazeObject == "") {
                    currGazeObject = stim;
                    currGazeStart = currTime;
                }

                // Check if gaze has changed
                // Don't update if gaze is not on either of the stimuli
                if (stim != currGazeObject && stim != "") {
                    gazeRecordings.push({ gazeStart: currGazeStart - doubleImageGazeStart, object: currGazeObject, duration: currTime - currGazeStart })

                    // Reset gaze timer and object if gaze has shifted
                    prevGazeObject = currGazeObject;
                    currGazeObject = stim;
                    currGazeStart = currTime;
                }

                // Add current gaze point to the data collection
                let endTime = Date.now()
                gazerDatadoubleImageGaze.push({ startTime, x, y, analysisTime: endTime - currTime });
            }
        }

        // Check if trial is incomplete (complete if current gaze time has reached the duration from the trial parameters provided)
        if (currTime - currGazeStart < duration) {
            // Set a timeout to gather the next point
            setTimeout(() => checkCurrentPointdoubleImage(duration), 10);
        } else {
            // Finish the trial
            gazeRecordings.push({ gazeStart: currGazeStart - doubleImageGazeStart, object: currGazeObject, duration: currTime - currGazeStart })
            doubleImageGazeComplete = true;
            finishdoubleImageGaze()
        }

    } else {
        console.log("Double Image Gaze is complete.")
    }

}


/**
 * @file Double-Image-Gaze Plugin
 * 
 * Using Webgazer, records gaze across two images that are placed side by side.
 * Trial completes after a duration in ms set as the parameter duration.
 * 
 * @param {integer} duration      - Time in ms to display two images, default is 5000 ms.
 * @param {string}  stimulusLeft  - Path to stimulus image displayed on left.
 * @param {string}  stimulusRight - Path to stimulus image displayed on right.
 * @param {integer} paddingVal    - Amount of pixels to offset the stimuli from center, defaults to 30px.
 * 
 */

var doubleImageGaze = (function (jspsych){

    const info = {
        name: 'Double-Image-Gaze',
        parameters: {
            duration: {
                type: jspsych.ParameterType.INT,
                description: 'Duration to display the image in ms',
                default: 5000
            },
            stimulusOne: {
                type: jspsych.ParameterType.HTML_STRING,
                description: 'Path to stimulus to display as the left stimulus, as a string.',
                default: null
            },
            stimulusTwo: {
                type: jspsych.ParameterType.HTML_STRING,
                description: 'Path to stimulus to display as the right stimulus, as a string.',
                default: null
            },
            paddingVal: {
                type: jspsych.ParameterType.INT,
                description: 'Amount of pixels to offset the stimuli from center, defaults to 30px.',
                default: 30
            }
        }
    }
    
    class doubleImageGazePlugin {
        constructor (jsPsych) {
            this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {

        // Reset all modules
        resetModules();

        // Reset global variables in case the trial type is repeated
        gazerDatadoubleImageGaze = [];
        gazeRecordings = [];
        doubleImageGazeComplete = false;
        webgazerErrorDoubleImageGaze = false;
        currGazeStart = 0;
        currGazeObject = "";

        // Rename trial parameters for easier reference
        stimLeftGaze = trial.stimulusOne;
        stimRightGaze = trial.stimulusTwo;
        let duration = trial.duration;
        let paddingVal = trial.paddingVal;

        // Display the two stimuli as HIDDEN to get the dimensions
        display_element.innerHTML = display_element.innerHTML =
            "<div id='main'><div id='cross' style='position:absolute;font-size:60px;'>+</div>" +
            "<img id='stimulusLeft' style='visibility:hidden; padding-right:'" + paddingVal + " src='" +
            stimLeftGaze +
            "'>" +
            "<img id='stimulusRight' style='visibility:hidden; padding-left:" +
            paddingVal +
            "px;' src='" +
            stimRightGaze +
            "'>" + "</div>";

        // Get the dimensions for the probe images and save to global variables to be acessible at the end of the trial
        leftStimDims = document.getElementById("stimulusLeft").getBoundingClientRect();
        rightStimDims = document.getElementById("stimulusRight").getBoundingClientRect();

        // Make the images visible
        document.getElementById("stimulusLeft").style.visibility = "visible";
        document.getElementById("stimulusRight").style.visibility = "visible";

        // Hide the fixation cross
        document.getElementById("cross").style.visibility = "hidden";

        // Record the start of trial and initiate collection and analysis of webgazer predictions
        doubleImageGazeStart = Date.now();
        checkCurrentPointdoubleImage(duration);
    }
    }
    doubleImageGazePlugin.info = info;

    return doubleImageGazePlugin;
}) (jsPsychModule);