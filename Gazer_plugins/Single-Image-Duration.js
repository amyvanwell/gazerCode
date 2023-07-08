// Initialize global namespace
let durationStimTop = 0;
let durationStimBot = 0;
let durationStimLeft = 0;
let durationStimRight = 0;
let singleImageDurationStimulus = "";
let singleImageDurationUpright = false;
let singleImageDurationStart = 0;
let gazerDatasingleImageDuration = [];
let singleImageDurationComplete = false;
let singleImageDurationWebgazerError = false;

// these are define in external libraries, included in the index.html
var webgazer;
var jsPsych;

/**
 * @function finishsingleImageDuration
 * 
 * Ends the current trial to move on to the next one in the jsPsych timeline.
 * Saves the webgazer x and y coordinates and saccade time information to the jsPsych.data JSON object.
 * 
 * @param NONE
 */

function finishsingleImageDuration() {

    let data = {
        screenX: window.innerWidth,
        screenY: window.innerHeight,
        gazerDatasingleImageDuration,
        durationStimBot,
        durationStimTop,
        durationStimLeft,
        durationStimRight,
        singleImageDurationStimulus,
        singleImageDurationUpright,
        singleImageDurationWebgazerError
    };

    jsPsych.finishTrial(data);
}

/**
 * @function checkCurrentPointSingleImageDuration
 * 
 * Collects the current prediction from webgazer and updates the list of points.
 * Once the collection and update are complete, wait 10ms then rerun checkCurrentPointSingleImageDuration.
 * 
 */

async function checkCurrentPointSingleImageDuration(duration) {
    // Collect a new prediction point if trial is not complete
    if (!singleImageDurationComplete) {
        // Record the time that the newest point is calculated
        let currTime = Date.now();
        let startTime = currTime - singleImageDurationStart;
        // Initalize x and y to be accessible in entire block
        let x = 0;
        let y = 0;

        // Collect point if there hasn't been an error with Webgazer in the current trial
        if (!singleImageDurationWebgazerError) {
            let prediction = null
            try {
                prediction = await webgazer.getCurrentPrediction();
            } catch (e) {
                // Catch any Webgazer errors and stop recording
                // Ensures the trial/experiment does not freeze for the participant
                console.log("Error")
                console.log(e)
                singleImageDurationWebgazerError = true;
            }

            if (prediction) {
                // Save the prediction if no error has occurred
                x = prediction["x"];
                y = prediction["y"];

                // Record the timing and location of current gaze prediction
                let endTime = Date.now()
                gazerDatasingleImageDuration.push({ startTime, x, y, analysisTime: endTime - currTime });
            }
        }

        // Check if trial is complete (current time has reached the duration from the trial parameters provided)
        if (startTime < duration) {
            // Set a timeout to gather the next point
            setTimeout(() => checkCurrentPointSingleImageDuration(duration), 10);
        } else {
            // Finish the trial
            singleImageDurationComplete = true;
            finishsingleImageDuration()
        }

    } else {
        console.log("Trial is complete.")
    }

}


/**
 * @file Single-Image-Duration Plugin
 * 
 * Using Webgazer, records a participant's gaze on a single image placed in the center of the screen.
 * 
 * @param {integer} duration  - Time in ms to display center image.
 * @param {string}  stimulus  - Path to stimulus image.
 * @param {boolean} upright   - Orientation of the stimulus image.
 * 
 */

var singleImageDuration = (function (jspsych){

    const info = {
        name: 'Single-Image-Duration',
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
            }
    }
}
    
    class singleImageDurationPlugin {
        constructor (jsPsych) {
            this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
        // Reset all modules
        resetModules();

        // Reset global variables in case of multiple trials
        gazerDatasingleImageDuration = [];
        singleImageDurationComplete = false;
        singleImageDurationWebgazerError = false;

        // Rename trial.stimulus and trial.duration for easier reference
        singleImageDurationStimulus = trial.stimulus;
        let duration = trial.duration;
        singleImageDurationUpright = trial.upright;

        // put up the four stimuli and cross as HIDDEN (not visible) to get dimensions
        display_element.innerHTML = display_element.innerHTML =
            "<div id='main'><div id='cross' style='position:absolute;font-size:60px;'>+</div>" +
            "<img id='stimulus' style='visibility:hidden;' src='" +
            singleImageDurationStimulus +
            "'></div>";

        // Get the dimensions for the probe image
        let durationStimDims = document.getElementById("stimulus").getBoundingClientRect();
        durationStimTop = durationStimDims.top;
        durationStimBot = durationStimTop + 900;
        durationStimLeft = durationStimDims.left;
        durationStimRight = durationStimLeft + 600;

        // Invert image for inversion condition
        if (!singleImageDurationUpright) {
            document.getElementById("stimulus").style.transform = "scaleY(-1)";
        }

        // Make the image visible
        document.getElementById("stimulus").style.visibility = "visible";

        // Hide the fixation cross
        document.getElementById("cross").style.visibility = "hidden";

        // Record current time as start of trial and initiate collection and analysis of webgazer predictions
        singleImageDurationStart = Date.now();
        checkCurrentPointSingleImageDuration(duration);
    }
    }
    singleImageDurationPlugin.info = info;

    return singleImageDurationPlugin;
}) (jsPsychModule);