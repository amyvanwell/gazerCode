// Initialize global namespace
let stimulusOne = "";
let stimulusTwo = "";
let stimuliAreas = {};
let doubleImageKeyStart = 0;
let gazerDatadoubleImageKey = [];
let doubleImageKeyComplete = false;
let webgazerErrorDoubleImageKey = false;

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

function finishdoubleImageKey(info) {
    // Convert the keycode to a key name if participant made a keyboard response
    let keyResp = info;
    console.log(keyResp)
    // Indicate the end of the trial
    jsPsych.pluginAPI.cancelAllKeyboardResponses()
    doubleImageKeyComplete = true;

    // Create data to save and end the trial
    let data = {
        screenX: window.innerWidth,
        screenY: window.innerHeight,
        gazerDatadoubleImageKey,
        stimulusOne,
        stimulusTwo,
        stimuliAreas,
        keyResp
    };

    jsPsych.finishTrial(data);
}

/**
 * @function checkCurrentPointdoubleImage
 * 
 * Collects the current prediction from webgazer and updates the list of points.
 * Once the collection and update are complete, wait 10ms then rerun checkCurrentPointdoubleImage.
 * 
 */

async function checkCurrentPointdoubleImage(duration) {
    // Collect a new prediction point if trial is not complete
    if (!doubleImageKeyComplete) {
        // Record the time that the newest point is calculated
        let currTime = Date.now();
        let startTime = currTime - doubleImageKeyStart;
        // Initalize x and y to be accessible in entire block
        let x = 0;
        let y = 0;

        // Collect point if there hasn't been an error with Webgazer in the current trial
        if (!webgazerErrorDoubleImageKey) {
            let prediction = null
            try {
                prediction = await webgazer.getCurrentPrediction();
            } catch (e) {
                // Catch any Webgazer errors and stop recording
                // Ensures the trial/experiment does not freeze for the participant
                console.log("Error")
                console.log(e)
                webgazerErrorDoubleImageKey = true;
            }

            if (prediction) {
                // Save the prediction if no error has occurred
                x = prediction["x"];
                y = prediction["y"];

                // Record the timing and location of current gaze prediction
                let endTime = Date.now()
                gazerDatadoubleImageKey.push({ startTime, x, y, analysisTime: endTime - currTime });
            }
        }

        // Check if trial is complete (current time has reached the duration from the trial parameters provided)
        if (startTime < duration) {
            // Set a timeout to gather the next point
            setTimeout(() => checkCurrentPointdoubleImage(duration), 10);
        } else {
            // Finish the trial without a key response
            doubleImageKeyComplete = true;
            finishdoubleImageKey("none")
        }

    } else {
        console.log("Trial is complete.")
    }

}


/**
 * @file Double-Image-Key Plugin
 * 
 * Using Webgazer, records gaze across two stimuli placed side by side and offset equally from center.
 * Trial ends once the participant makes a keyboard response from one of the options provided in the endKeys parameter.
 * 
 * @param {integer} duration      - Time in ms to display two images, default is 5000 ms.
 * @param {string}  stimulusOne  - Path to stimulus image displayed on left.
 * @param {string}  stimulusTwo - Path to stimulus image displayed on right.
 * @param {string}  endKeys       - Key name (ex. 'space') to allow as response. Can be a single string or a list for multiple possible responses.
 * @param {integer} paddingVal    - Amount of pixels to offset the stimuli from center, defaults to 30px.
 * 
 */

var doubleImageKey = (function (jspsych){

    const info = {
        name: 'Double-Image-Key',
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
    
    class doubleImageKeyPlugin {
        constructor (jsPsych) {
            this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
        // Reset all modules
        resetModules();

        // Reset global variables in case trials are run multiple times.
        gazerDatadoubleImageKey = [];
        doubleImageKeyComplete = false;
        webgazerErrorDoubleImageKey = false;
        stimuliAreas = {};

        // Rename trial parameters for easier reference
        stimulusOne = trial.stimulusOne;
        stimulusTwo = trial.stimulusTwo;
        let duration = trial.duration;
        let key = typeof(trial.endKeys) == 'string' ? [trial.endKeys] : trial.endKeys
        let paddingVal = trial.paddingVal

        // Add the two stimuli as invisible, get dimensions then make visible
        display_element.innerHTML = display_element.innerHTML =
            "<div id='main'><div id='cross' style='position:absolute;font-size:60px;'>+</div>" +
            "<img id='stimulusOne' style='visibility:hidden; padding-right:" + paddingVal + "px;' src='" +
            stimulusOne +
            "'>" +
            "<img id='stimulusTwo' style='visibility:hidden; padding-left:" +
            paddingVal +
            "px;' src='" +
            stimulusTwo +
            "'>" + "</div>";

        // Get the dimensions for the probe images and save to a global hash variable to access at the end of the trial
        let stimDims = document.getElementById("stimulusOne").getBoundingClientRect();
        stimuliAreas["LstimTop"] = stimDims.top;
        stimuliAreas["LstimBot"] = stimDims.bottom;
        stimuliAreas["LstimLeft"] = stimDims.left;
        stimuliAreas["LstimRight"] = stimDims.right;

        stimDims = document.getElementById("stimulusTwo").getBoundingClientRect();
        stimuliAreas["RstimTop"] = stimDims.top;
        stimuliAreas["RstimBot"] = stimDims.bottom;
        stimuliAreas["RstimLeft"] = stimDims.left;
        stimuliAreas["RstimRight"] = stimDims.right;

        // Make the images visible
        document.getElementById("stimulusOne").style.visibility = "visible";
        document.getElementById("stimulusTwo").style.visibility = "visible";

        // Hide the fixation cross
        document.getElementById("cross").style.visibility = "hidden";

        // Initiate checking for keys to respond to trial
        var listener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: finishdoubleImageKey,
            valid_responses: key,
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        });

        // Record current time as start of trial and initiate collection and analysis of webgazer predictions
        doubleImageKeyStart = Date.now();
        checkCurrentPointdoubleImage(duration);
    }
    }
    doubleImageKeyPlugin.info = info;

    return doubleImageKeyPlugin;
}) (jsPsychModule);