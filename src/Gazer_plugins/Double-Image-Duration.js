// Initialize global namespace
let LstimTop = 0;
let LstimBot = 0;
let LstimLeft = 0;
let LstimRight = 0;
let doubleImageDurationStart = 0;
let RstimTop = 0;
let RstimBot = 0;
let RstimLeft = 0;
let RstimRight = 0;
let stimulusRight = "";
let stimulusLeft = "";
let gazerDatadoubleImageDuration = [];
let doubleImageDurationComplete = false;
let webgazerErrorDoubleImageDuration = false;


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

function finishdoubleImageDuration() {

    let data = {
        screenX: window.innerWidth,
        screenY: window.innerHeight,
        gazerDatadoubleImageDuration,
        stimulusLeft,
        stimulusRight,
        LstimBot,
        LstimLeft,
        LstimRight,
        LstimTop,
        RstimBot,
        RstimLeft,
        RstimRight,
        RstimTop
    };

    jsPsych.finishTrial(data);
}

/**
 * @function checkCurrentPointdoubleImageDuration
 * 
 * Collects the current prediction from webgazer and updates the list of points.
 * Once the collection and update are complete, wait 10ms then rerun checkCurrentPointdoubleImageDuration.
 * 
 * @param {INTEGER} duration - Time in ms to display the stimuli for, specified in the original trial parameters.
 * 
 */

async function checkCurrentPointdoubleImageDuration(duration) {
    // Collect a new prediction point if trial is not complete
    if (!doubleImageDurationComplete) {
        // Record the time that the newest point is calculated
        let currTime = Date.now();
        let startTime = currTime - doubleImageDurationStart;
        // Initalize x and y to be accessible in entire block
        let x = 0;
        let y = 0;

        // Collect point if there hasn't been an error with Webgazer in the current trial
        if (!webgazerErrorDoubleImageDuration) {
            let prediction = null
            try {
                prediction = await webgazer.getCurrentPrediction();
            } catch (e) {
                // Catch any Webgazer errors and stop recording
                // Ensures the trial/experiment does not freeze for the participant
                console.log(e)
                webgazerErrorDoubleImageDuration = true;
            }

            if (prediction) {
                // Save the prediction if no error has occurred
                x = prediction["x"];
                y = prediction["y"];

                let endTime = Date.now()
                gazerDatadoubleImageDuration.push({ startTime, x, y, analysisTime: endTime - currTime });
            }
        }

        // Check if trial is complete (current time has reached the duration from the trial parameters provided)
        if (startTime < duration) {
            // Set a timeout to gather the next point
            setTimeout(() => checkCurrentPointdoubleImageDuration(duration), 10);
        } else {
            // Finish the trial
            doubleImageDurationComplete = true;
            finishdoubleImageDuration()
        }

    } else {
        console.log("Double Image duration is complete.")
    }

}


/**
 * @file Double-Image-Duration Plugin
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

jsPsych.plugins['Double-Image-Duration'] = (function() {

    var plugin = {};

    plugin.info = {
        name: 'Double-Image-Duration',
        parameters: {
            duration: {
                type: jsPsych.plugins.parameterType.INTEGER,
                description: 'Duration to display the image in ms',
                default: 5000
            },
            stimulusOne: {
                type: jsPsych.plugins.parameterType.STRING,
                description: 'Path to stimulus to display as the left stimulus, as a string.'
            },
            stimulusTwo: {
                type: jsPsych.plugins.parameterType.STRING,
                description: 'Path to stimulus to display as the right stimulus, as a string.'
            },
            paddingVal: {
                type: jsPsych.plugins.parameterType.INTEGER,
                description: 'Amount of pixels to offset the stimuli from center, defaults to 30px.',
                default: 30
            }
        }
    }

    plugin.trial = function(display_element, trial) {
        // Reset all modules
        resetModules();

        // Reset global variables in case the trial type is repeated
        gazerDatadoubleImageDuration = [];
        doubleImageDurationComplete = false;
        webgazerErrorDoubleImageDuration = false;

        // Rename trial parameters for easier reference
        stimulusLeft = trial.stimulusOne;
        stimulusRight = trial.stimulusTwo;
        let duration = trial.duration;
        let paddingVal = trial.paddingVal;

        // Display the two stimuli as HIDDEN to get the dimensions
        display_element.innerHTML = display_element.innerHTML =
            "<div id='main'><div id='cross' style='position:absolute;font-size:60px;'>+</div>" +
            "<img id='stimulusLeft' style='visibility:hidden padding-right:'" + paddingVal + " src='" +
            stimulusLeft +
            "'>" +
            "<img id='stimulusRight' style='visibility:hidden; padding-left:" +
            paddingVal +
            "px;' src='" +
            stimulusRight +
            "'>" + "</div>";

        // Get the dimensions for the probe images and save to global variables to be acessible at the end of the trial
        let stimDims = document.getElementById("stimulusLeft").getBoundingClientRect();
        LstimTop = stimDims.top;
        LstimBot = stimTop + stimDims.height;
        LstimLeft = stimDims.left;
        LstimRight = stimLeft + stimDims.width;

        stimDims = document.getElementById("stimulusRight").getBoundingClientRect();
        RstimTop = stimDims.top;
        RstimBot = stimTop + stimDims.height;
        RstimLeft = stimDims.left;
        RstimRight = stimLeft + stimDims.width;

        // Make the images visible
        document.getElementById("stimulusLeft").style.visibility = "visible";
        document.getElementById("stimulusRight").style.visibility = "visible";

        // Hide the fixation cross
        document.getElementById("cross").style.visibility = "hidden";


        // Record the start of trial and initiate collection and analysis of webgazer predictions
        doubleImageDurationStart = Date.now();
        checkCurrentPointdoubleImageDuration(duration);
    };

    return plugin;

})();