// Initialize global namespace
let stimTop = 0;
let stimBot = 0;
let stimLeft = 0;
let stimRight = 0;
let stimLocation = 0;
let singleDotDurationStart = 0;
let gazerDatasingleDotDuration = [];
let singleDotDurationComplete = false;
let webgazerError = false;
let imageUp = false;

// These are define in external libraries, included in the index.html
var webgazer;
var jsPsych;

/**
 * @function finishsingleDotDuration
 * 
 * Ends the current trial to move on to the next one in the jsPsych timeline.
 * Saves the webgazer x and y coordinates and saccade time information to the jsPsych.data JSON object.
 * 
 * @param NONE
 */

function finishsingleDotDuration() {

    let data = {
        screenX: window.innerWidth,
        screenY: window.innerHeight,
        gazerDatasingleDotDuration,
        stimBot,
        stimTop,
        stimLeft,
        stimRight,
        webgazerError,
        stimLocation
    };

    jsPsych.finishTrial(data);
}

/**
 * @function checkCurrentPointSingleImage
 * 
 * Collects the current prediction from Webgazer and adds it to the timeline of points.
 * Waits 10ms then reruns itself.
 * 
 */

async function checkCurrentPointSingleImage(duration) {
    // Collect a new prediction point if trial is not complete
    if (!singleDotDurationComplete) {
        // Record the time that the newest point is calculated
        let currTime = Date.now();
        let startTime = currTime - singleDotDurationStart;
        // Initalize x and y to be accessible in entire block
        let x = 0;
        let y = 0;

        // Collect point if there hasn't been an error with Webgazer in the current trial
        if (!webgazerError) {
            let prediction = null
            try {
                prediction = await webgazer.getCurrentPrediction();
            } catch (e) {
                // Catch any Webgazer errors and stop recording
                // Ensures the trial/experiment does not freeze for the participant
                console.log("Error")
                console.log(e)
                webgazerError = true;
            }

            if (prediction) {
                // Save the prediction if no error has occurred
                x = prediction["x"];
                y = prediction["y"];

                let endTime = Date.now()
                gazerDatasingleDotDuration.push({ startTime, x, y, analysisTime: endTime - currTime });
            }
        }

        // Display the red dot if it hasn't been revealed yet and we are 500ms into the trial
        if (!imageUp && startTime > 500) {
            // Hide the fixation cross
            document.getElementById("cross").style.visibility = "hidden";
            // Make the dot visible
            document.getElementById("dotStimulus").style.visibility = "visible";
            // Record the action so it isn't repeated
            imageUp = true;
        }

        // Check if trial is complete (current time has reached the duration from the trial parameters provided)
        if (startTime < duration + 500) {
            // Set a timeout to gather the next point
            setTimeout(() => checkCurrentPointSingleImage(duration), 10);
        } else {
            // Finish the trial
            singleDotDurationComplete = true;
            finishsingleDotDuration()
        }

    } else {
        console.log("Trial is complete.")
    }

}


/**
 * @file Single-Dot-Duration Plugin
 * 
 * Displays a red dot at one of eight locations equidistant to a central cross.
 * Records eye movement from cross to red dot using Webgazer eye-tracking.
 * 
 * @param {integer} duration         - Time in ms to display the red dot.
 * @param {integer} stimulusLocation - Location to place the dot. Corners are numbered starting at 1 and ending at 8, running clockwise.
 * 
 */

var singleDotDuration = (function (jspsych){

    const info = {
        name: 'Single-Dot-Duration',
        parameters: {
            duration: {
                type: jspsych.ParameterType.INTEGER,
                description: 'Duration to display the dot in ms',
                default: 1000
            },
            stimulusLocation: {
                type: jspsych.ParameterType.INTEGER,
                description: 'The location on the screen to place the dot. An integer from 1-8.',
                default: 1000
            }
        }
    }
    
    class singleDotDurationPlugin {
        constructor (jsPsych) {
            this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {
        // Reset all modules
        resetModules();

        // Reset global variables in case the plugin is run multiple times
        gazerDatasingleDotDuration = [];
        singleDotDurationComplete = false;
        webgazerError = false;
        imageUp = false;

        // Rename trial parameters for easier reference
        let duration = trial.duration;
        stimLocation = trial.stimulusLocation;

        // Calculate screen dimensions
        let windowX = window.innerWidth
        let windowY = window.innerHeight

        let left = 0;
        let top = 0;

        // Calculate the stimulus location based on the screen dimensions and the assigned position (trial parameter stimLocation)
        // Calculate value on x-axis first (horizontal location)
        if (stimLocation == 1 || stimLocation == 7 || stimLocation == 8) {
            // Leftmost x
            left = (-1 * (windowX * 0.35))
        } else if (stimLocation == 2 || stimLocation == 6) {
            // Middle column x
            left = 0
        } else {
            // Rightmost x
            left = windowX * 0.35
        }

        // Calculate the y-axis value (vertical location)
        if (stimLocation == 1 || stimLocation == 2 || stimLocation == 3) {
            // Topmost y
            top = (-1 * (windowY * 0.35))
        } else if (stimLocation == 8 || stimLocation == 4) {
            // Middle row y
            top = 0
        } else {
            // Bottom row y
            top = windowY * 0.35
        }

        // Move the dot to the left half its total width of 50px to properly center it at the calculated location
        left = left - 25

        // Place the cross and dot stimulus on the screen, dot is HIDDEN (not visible) to get its dimensions before revealing
        display_element.innerHTML = display_element.innerHTML =
            "<div id='main'><div id='cross' style='position:absolute;margin-left:-17.5px;font-size:60px;'>+</div>" +
            "<div id='dotStimulus' class='dotStimulus' style='visibility:hidden;position: absolute; margin-top:" +
            top +
            "px; margin-left:" +
            left +
            "px;'></div>";

        // Get the dimensions for the dot stimulus
        let stimDims = document.getElementById("dotStimulus").getBoundingClientRect();
        stimTop = stimDims.top;
        stimBot = stimTop + 50;
        stimLeft = stimDims.left;
        stimRight = stimLeft + 50;

        // Record the beginning of the trial
        singleDotDurationStart = Date.now();

        // Initiate collection and analysis of Webgazer predictions
        checkCurrentPointSingleImage(duration);
    }

}
    singleDotDurationPlugin.info = info;

    return singleDotDurationPlugin;
}) (jsPsychModule);
