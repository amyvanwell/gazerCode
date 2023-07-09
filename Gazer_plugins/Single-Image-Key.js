// Initialize global namespace
let keyStimTop = 0;
let keyStimBot = 0;
let keyStimLeft = 0;
let keyStimRight = 0;
let stimulus = "";
let upright = false;
let singleImageKeyStart = 0;
let gazerDatasingleImageKey = [];
let singleImageKeyComplete = false;
let singleImageKeyWebgazerError = false;

// these are define in external libraries, included in the index.html
var webgazer;
var jsPsych;

/**
 * @function finishSingleImageKey
 * 
 * Ends the current trial to move on to the next one in the jsPsych timeline.
 * Saves the webgazer x and y coordinates and saccade time information to the jsPsych.data JSON object.
 * 
 * @param NONE
 */

function finishSingleImageKey() {

    // Record the trial as skipped to stop recording points
    singleImageKeyComplete = true;
    // Cancel the keyboard handler
    jsPsych.pluginAPI.cancelAllKeyboardResponses()

    let data = {
        screenX: window.innerWidth,
        screenY: window.innerHeight,
        gazerDatasingleImageKey,
        keyStimBot,
        keyStimTop,
        keyStimLeft,
        keyStimRight,
        stimulus,
        upright,
        singleImageKeyWebgazerError
    };

    jsPsych.finishTrial(data);
}

/**
 * @function checkCurrentPointSingleImageKey
 * 
 * Collects the current prediction from webgazer and updates the list of points.
 * Once the collection and update are complete, wait 10ms then rerun checkCurrentPointSingleImageKey.
 * 
 */

async function checkCurrentPointSingleImageKey(duration) {
    // Collect a new prediction point if trial is not complete
    if (!singleImageKeyComplete) {
        // Record the time that the newest point is calculated
        let currTime = Date.now();
        let startTime = currTime - singleImageKeyStart;
        // Initalize x and y to be accessible in entire block
        let x = 0;
        let y = 0;

        // Collect point if there hasn't been an error with Webgazer in the current trial
        if (!singleImageKeyWebgazerError) {
            let prediction = null
            try {
                prediction = await webgazer.getCurrentPrediction();
            } catch (e) {
                // Catch any Webgazer errors and stop recording
                // Ensures the trial/experiment does not freeze for the participant
                console.log("Error")
                console.log(e)
                singleImageKeyWebgazerError = true;
            }

            if (prediction) {
                // Save the prediction if no error has occurred
                x = prediction["x"];
                y = prediction["y"];

                // Record the timing and location of current gaze prediction
                let endTime = Date.now()
                gazerDatasingleImageKey.push({ startTime, x, y, analysisTime: endTime - currTime });
            }
        }

        // Check if trial is complete (current time has reached the duration from the trial parameters provided)
        if (startTime < duration) {
            // Set a timeout to gather the next point
            setTimeout(() => checkCurrentPointSingleImageKey(duration), 10);
        } else {
            // Finish the trial
            singleImageKeyComplete = true;
            finishSingleImageKey()
        }

    } else {
        console.log("Trial is complete.")
    }

}


/**
 * @file Single-Image-Key Plugin
 * 
 * Using Webgazer, records a participant's gaze on a single image placed in the center of the screen.
 * Trial ends either with a keyboard response or after a set duration.
 * 
 * @param {integer} duration  - Time in ms to display center image.
 * @param {string}  stimulus  - Path to stimulus image.
 * @param {boolean} upright   - Orientation of the stimulus image.
 * @param {string}  endKeys   - Key name (ex. ' ') to allow as response.
 * 
 */

var singleImageKey = (function (jspsych){

    const info = {
        name: 'Single-Image-Key',
        parameters: {
            duration: {
                type: jspsych.ParameterType.INT,
                description: 'Duration to display the image in ms, defaults to 60 seconds.',
                default: 10000
            },
            stimulus: {
                type: jspsych.ParameterType.HTML_STRING,
                description: 'Path to stimulus to display as the main stimulus, as a string.'
            },
            upright: {
                type: jspsych.ParameterType.BOOLEAN,
                description: 'The vertical orientation of the image, defaults to upright',
                default: true
            },
            endKeys: {
                type: jspsych.ParameterType.HTML_STRING,
                description: 'The keys used to end the trial, can be a single string or a list. Defaults to "space"',
                default: ' '
            }
        }
    }
    class singleImageKeyPlugin {
        constructor (jsPsych) {
            this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
        // Reset global variables in case of multiple trials
        gazerDatasingleImageKey = [];
        singleImageKeyComplete = false;
        singleImageKeyWebgazerError = false;

        // Rename trial parameters for easier reference
        stimulus = trial.stimulus;
        let duration = trial.duration;
        upright = trial.upright;
        let key = typeof(trial.endKeys) == 'string' ? [trial.endKeys] : trial.endKeys

        // put up the four stimuli and cross as HIDDEN (not visible) to get dimensions
        display_element.innerHTML = display_element.innerHTML =
            "<div id='main'><div id='cross' style='position:absolute;font-size:60px;'>+</div>" +
            "<img id='stimulus' style='visibility:hidden;' src='" +
            stimulus +
            "'></div>";

        // Get the dimensions for the probe image
        let keyStimDims = document.getElementById("stimulus").getBoundingClientRect();
        keyStimTop = keyStimDims.top;
        keyStimBot = keyStimTop + 900;
        keyStimLeft = keyStimDims.left;
        keyStimRight = keyStimLeft + 600;

        // Invert image for inversion condition
        if (!upright) {
            document.getElementById("stimulus").style.transform = "scaleY(-1)";
        }

        // Make the image visible
        document.getElementById("stimulus").style.visibility = "visible";

        // Hide the fixation cross
        document.getElementById("cross").style.visibility = "hidden";

        // Initiate checking for 'space' key to end trial
        var listener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: finishSingleImageKey,
            valid_responses: key,
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        });

        // Record current time as start of trial and initiate collection and analysis of webgazer predictions
        singleImageKeyStart = Date.now();
        checkCurrentPointSingleImageKey(duration);
    }
    }
    singleImageKeyPlugin.info = info;

    return singleImageKeyPlugin;
}) (jsPsychModule);