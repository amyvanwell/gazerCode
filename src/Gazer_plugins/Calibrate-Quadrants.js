// initiate global variable space
let imagesCalibrated = 0;
let totalClicks = 0;
let crossesCalib = 0;
let crossClicks = 0;
let stimClicks = 0;
let calibrationAccuracy = 0;
let test = false;
let stimIDList = ["stimulus1", "stimulus2", "stimulus3", "stimulus4"];
let crossIDList = ["cross", "crossLeft", "crossTop", "crossBot", "crossRight"]

// These are define in external libraries, included in the experiment.html
var webgazer;
var jsPsych;
var disablePredictionPoints;
var changeElementByID;
var resetModules;

/**
 * @function calibrateImages
 * 
 * Creates click event listeners for every stimulus ID provided.
 * Updates the DOM to show the total number of clicks and faces calibrated.
 * A face is calibrated after 5 clicks, after which clicks will no longer update DOM.
 * 
 * @param {[string]} stimNames - Array of HTML ids to create click listeners for. 
 */

function calibrateImages(stimNames) {
    // reset webgazer and click counter in case of multiple calibrations
    webgazer.clearData();
    stimClicks = 0;
    for (let i = 0; i < stimNames.length; i++) {
        document.getElementById(stimNames[i]).addEventListener('click', handleFaceClicks);
    }

}

/**
 * @function handleFaceClicks
 * 
 * Handles a click on one of the four image stimuli.
 * On each click, updates the DOM to show the total number of clicks and image calibrated.
 * Displays the next image if a image has been clicked 5 times.
 * Begins calibration of crosses if all images have been clicked on.
 * 
 */


function handleFaceClicks() {
    // increase counter for number of mouse clicks on curent image
    stimClicks++;

    // Update status for total number of clicks if <5 clicks on current image
    if (stimClicks <= 4) {
        totalClicks++;
        changeElementByID("status", `Total number of clicks: ${totalClicks}`);
    }

    // Update status for number of calibrated images if 5 clicks on current image
    if (stimClicks == 5) {
        imagesCalibrated++;
        changeElementByID("timer", `Number of images calibrated: ${imagesCalibrated}`);
        // Hide current image
        document.getElementById(event.target.id).style.visibility = "hidden";

        // Reveal the next image if all four images aren't yet calibrated
        if (imagesCalibrated < 4) {
            stimClicks = 0;
            revealNextImage(imagesCalibrated);
        }
    }

    // Begin calibrating crosses if all the images have been calibrated
    if (imagesCalibrated == 4) {
        calibrateCross();
    }
}

/**
 * 
 * @function revealNextImage
 * 
 * Makes the next image in calibration order visible.
 * 
 * @param {string} id - HTML tag of stimuli that has just been calibrated.
 * 
 */

function revealNextImage(facesCalib) {
    // Make the next image stimulus visible based on what image has just been calibrated
    if (facesCalib == 1) {
        document.getElementById("stimulus2").style.visibility = "visible";
    } else if (facesCalib == 2) {
        document.getElementById("stimulus3").style.visibility = "visible";
    } else if (facesCalib == 3) {
        document.getElementById("stimulus4").style.visibility = "visible";
    }
}

/**
 * @function calibrateCross
 * 
 * Creates event listeners for mouse clicks on the fixation cross.
 * Displays new instructions on DOM to gaze on crosses.
 * Reveals the first cross in calibration order.
 * 
 */

function calibrateCross() {
    // Display new instructions to look at the cross
    changeElementByID("instructions", "Now click on a central cross 5 times, while gazing at it.");
    changeElementByID("status", "Number of clicks on the cross: 0");
    changeElementByID("timer", "Number of cross calibrated: 0")

    // Reveal the first cross
    document.getElementById("cross").style.visibility = "visible";
    // Reset the number of calibrated crosses to 0 in case of multiple calibration
    crossesCalib = 0;

    // Add an event listener to each cross in ID list (global var)
    for (let i = 0; i < crossIDList.length; i++) {
        document.getElementById(crossIDList[i]).addEventListener('click', handleCrossClicks);
    }
}

/**
 * @function handleCrossClicks
 * 
 * Handles mouse clicks on each fixation cross.
 * On each click, updates the click counter and reveals next cross if click threshold met.
 * If all crosses are clicked on, initiates a final accuracy test.
 * 
 */

function handleCrossClicks() {
    // Increment cross click counter
    crossClicks++;

    // Update the DOM if counter is less than maximum number
    if (crossClicks < 4) {
        changeElementByID("status", `Number of clicks on the cross: ${crossClicks}`);

        // Move on to next stage of calibration if counter reached maximum number of clicks
    } else if (crossClicks >= 4) {
        // Increase counter of number of calibrated crosses
        crossesCalib++
        // Hide current cross
        document.getElementById(event.target.id).style.visibility = "hidden";

        // Check if all crosses have been calibrated
        if (crossesCalib == 5) {
            // Hide all calibration instructions
            document.getElementById("status").style.visibility = "hidden";
            document.getElementById("timer").style.visibility = "hidden";
            document.getElementById("reminder").style.visibility = "hidden";
            document.getElementById("instructions").style.visibility = "hidden";

            // Reveal the center cross, accuracy tests instructions and accuracy test start button
            document.getElementById("cross").style.visibility = "visible";
            document.getElementById("accuracy").style.visibility = "visible";
            document.getElementById("acc_btn").style.display = "inline";

            // Add event listener for accuracy test button
            document.getElementById("acc_btn").addEventListener('click', handleAccuracyTestStartButton);

        } else {
            // If not all crosses are calibrated, reveal next cross and reset values
            crossClicks = 0;
            changeElementByID("status", `Number of clicks on the cross: ${crossClicks}`);
            changeElementByID("timer", `Number of crosses calibrated: ${crossesCalib}`);
            revealNextCross(event.target.id);
        }

    }
}

/**
 * 
 * revealNext Cross
 * 
 * Makes the next cross in calibration order visible.
 * 
 * @param {string} id - HTML tag of stimuli that has just been calibrated.
 * 
 */

function revealNextCross(crossid) {
    // Reveals the next cross based on the id of the last cross that was calibrated.
    if (crossid == "cross") {
        document.getElementById("crossLeft").style.visibility = "visible";
    } else if (crossid == "crossLeft") {
        document.getElementById("crossTop").style.visibility = "visible";
    } else if (crossid == "crossTop") {
        document.getElementById("crossRight").style.visibility = "visible";
    } else if (crossid == "crossRight") {
        document.getElementById("crossBot").style.visibility = "visible";
    }
}


/**
 * @function handleAccuracyTestStartButton
 * 
 * Handles mouse click on the accuracy test button.
 * Initiates a 5 second calibration test.
 * If accuracy threshold is met, calibration is complete and displays the "Continue" button.
 * If threshold is not met, restarts calibration.
 * 
 */

function handleAccuracyTestStartButton() {
    // Perform accuracy test
    checkCalibration().then((result) => {
        calibrationAccuracy = result;

        // Check if accuracy is above 70% threshold
        if (result >= 70) {
            // Display positive result and instructions to continue
            changeElementByID("accuracy", "You're done the calibration! You've reached the necessary threshold. Press the 'continue' button below to move on to the experiment. \n Reminder: Keep your face in the position that you held during calibration.");
            document.getElementById("accuracy").style.visibility = "visible";

            // Display the continue button and hide the center cross
            document.getElementById('btn').style.top = "200px";
            document.getElementById('btn').style.left = "500px";
            document.getElementById('btn').style.display = "inline";
            document.getElementById("cross").style.visibility = "hidden";

            // Initiate handling of the continue button if not in test mode
            // If test is true, then handling of button has already been initiated
            if (!test) checkButtonClick();

        } else {
            // Clear all data and restart if accuracy was not reached
            webgazer.clearData();
            calibrationAccuracy = 0;
            imagesCalibrated = 0;
            crossClicks = 0;
            crossesCalib = 0;
            totalClicks = 0;
            // Remove click handlers for the image stimuli and crosses
            stimIDList.forEach((stimID) => {
                document.getElementById(stimID).removeEventListener('click', handleFaceClicks);
            })
            crossIDList.forEach((crossID) => {
                document.getElementById(crossID).removeEventListener("click", handleCrossClicks)
            })

            // Restore the DOM to the initial calibration instructions
            document.getElementById("status").style.visibility = "visible";
            document.getElementById("instructions").style.visibility = "visible";
            document.getElementById("stimulus1").style.visibility = "visible";
            // Display the previous insufficient accuracy to the participant
            let message = "You did not reach the necessary threshold to continue, please try again. The threshold is 70% and you reached: " + result + "%. The calibration is restarted, no stimuli have been clicked."
            changeElementByID("status", message);
            changeElementByID("instructions", " To calibrate the camera to track your gaze, use the mouse to click on the red star in each picture 5 times, while gazing at it.");
            // Begin calibration again from the beginning
            calibrateImages(stimIDList);
        }


    })
}

/**
 * @function checkCalibration
 * 
 * Calculates the accuracy of Webgazer calculation.
 * Displays a center cross for 5 seconds, webgazer accuracy is based on how close prediction points are to center.
 * 
 */

async function checkCalibration() {
    // Hide the accuracy test instructions
    document.getElementById("acc_btn").style.display = "none";
    document.getElementById("accuracy").style.visibility = "hidden";

    // Start storing points, wait 5s
    store_points_variable();
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Stop storing the prediction points
    stop_storing_points_variable();

    // Remove the center cross
    document.getElementById("cross").style.visibility = "hidden";

    // Retrieve stored points
    const past50 = webgazer.getStoredPoints();

    // Calculate and return accuracy measurement
    return calculatePrecision(past50)

}

/**
 * @function checkButtonClick
 * 
 * Creates an event listener for the end button that will exit the calibration plugin event on a click.
 * 
 */

function checkButtonClick() {
    document.getElementById('btn').addEventListener('click', () => {
        jsPsych.finishTrial({ calibrationAccuracy });
    });
}


/**
 * @file Calibrate-Quadrants Plugin
 * 
 * Calibrates Webgazer with 5 clicks on each fixation cross and images shown in every corner of the screen.
 * 
 * @param {string} image - The path to the image to be displayed in each corner, if not specified then fruit are shown.
 * @param {boolean} test - Control if the "Continue" button will be available right away, otherwise
 *                         it will only display once calibration is fully complete.
 */

jsPsych.plugins['Calibrate-Quadrants'] = (function() {

    var plugin = {};

    plugin.info = {
        name: 'Calibrate-Quadrants',
        parameters: {
            image: {
                type: jsPsych.plugins.parameterType.STRING,
                default: "./img/banana.png",
                description: 'Path to image to display, as a string.'
            },
            test: {
                type: jsPsych.plugins.parameterType.BOOLEAN,
                default: false,
                description: "Whether to show the 'continue' button without calibrating."
            }
        }
    }

    // The plugin code is run starting on the following line
    plugin.trial = function(display_element, trial) {
        // Plugin parameters from the experiment.js file can be accessed keys in the trial object
        // i.e. trial.test and trial.image
        // The html can be manipulated by changing the value of display_element.innerHTML

        // Reset all modules
        resetModules();

        // Reset local variables to zero to handle the case of multiple calibrations
        calibrationAccuracy = 0;
        imagesCalibrated = 0;
        crossClicks = 0;
        crossesCalib = 0;
        totalClicks = 0;

        // Rename the variables from the trial object for easier access
        let img = trial.image ? trial.image : "./img/banana.png";
        test = trial.test;

        // Calculate the locations for the four images and four crosses based off of the size of the computer screen
        let left = ((-1 * window.innerWidth) / 4.0)
        let right = (window.innerWidth / 3.5) - 160
        let bottom = (window.innerHeight / 4) - 140
        let top = ((-1 * window.innerHeight) / 4) - 140

        let crossLeft = (-1 * window.innerWidth / 16)
        let crossRight = window.innerWidth / 16
        let crossTop = (-1 * window.innerHeight / 12)
        let crossBot = (window.innerHeight / 12)

        // Intiate all four images and four crosses
        // Initiate text for instructions, status, accuracy test
        // Initiate button to continue to trials and to initiate accuracy test
        // The eight stimuli are set to hidden except for the first image in the top left corner
        // The text are all hidden except the instructions and status that are visible below the webgazer video feed
        // Both buttons are hidden
        display_element.innerHTML =
            "<div class='main' id='main'><div id='cross' style='visibility:hidden;position:absolute;font-size:60px;'>+</div>" +
            "<div id='crossRight' style='visibility:hidden; position:absolute;font-size:60px;margin-left:" + crossRight + " '>+</div>" +
            "<div id='crossLeft' style='visibility:hidden;position:absolute;font-size:60px; margin-left:" + crossLeft + " '>+</div>" +
            "<div id='crossTop' style='visibility:hidden;position:absolute;font-size:60px;margin-top:" + crossTop + " '>+</div>" +
            "<div id='crossBot' style='visibility:hidden;position:absolute;font-size:60px; margin-top:" + crossBot + " '>+</div>" +
            "<img id='stimulus1' style='position: absolute; margin-top:" +
            top +
            "px; margin-left:" +
            left +
            "px;' src='" +
            img +
            "'>" +
            "<img id='stimulus2' style='visibility:hidden; position: absolute; margin-top:" +
            top +
            "px; margin-left:" +
            right +
            "px;' src='" +
            img +
            "'>" +
            "<img id='stimulus3' style='visibility:hidden; position: absolute; margin-top:" +
            bottom +
            "px; margin-left:" +
            left +
            "px;' src='" +
            img +
            "'>" +
            "<img id='stimulus4' style='visibility:hidden; position: absolute; margin-top:" +
            bottom +
            "px; margin-left:" +
            right +
            "px;' src='" +
            img +
            "'>" + "<div class='status' id='status'></div>" +
            "<button class='acc_btn' id='acc_btn' style='display:none;'>Check Accuracy</button>" +
            "<div class='accuracy' id='accuracy' style='visibility:hidden;'>We will now test the accuracy of the calibration. When you're ready, look at the center cross and click on the 'Check Accuracy' button. Hold your gaze on the cross for 5 seconds.</div>" +
            "<div class='timer' id='timer'></div>" +
            "<div class='instructions' id='instructions'> To calibrate the camera to track your gaze, use the mouse to click on the red star in each picture 5 times, while gazing at it.</div>" +
            "<button class='btn' id='btn' style='display:none'>Continue</button>" +
            "<div class = 'reminder' id='reminder'>Important: Hold your head in the same position, only move your eyes between the images.</div></div>";

        // Display the "continue" button right away if test parameter is set to true
        if (test == true) {
            document.getElementById('btn').style.top = "600px";
            document.getElementById('btn').style.display = "inline";
            checkButtonClick()
        }

        // Turn off the Webgazer predictions points if they are being displayed
        disablePredictionPoints();

        // Begin calibration of the four image stimuli
        calibrateImages(stimIDList);
    };

    return plugin;

})();