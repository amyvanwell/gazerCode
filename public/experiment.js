// PRE-JSPSYCH CODE
// INITIATE GLOBAL VARIABLES AND COLLECT INFORMATION RE: PARTICIPANT'S BROWSER
// GAZER ONLY WORKS IN THE CHROME BROWSER

// Initiate global variables
let chromeBrowser = false;

// These are define in external libraries, included in the experiment.html
var webgazer;
var jsPsych;
var disablePredictionPoints;

// Get the user-agent string 
let userAgentString = navigator.userAgent;

// Detect Chrome 
chromeBrowser = userAgentString.indexOf("Chrome") > -1;

// Initiate Webgazer
webgazer.params.showVideoPreview = true;
webgazer.begin(() => {
    // OnFail callback provided by Webgazer if the video camera is not accessible
    // Switch to an alternative timeline and abort the current experiment

    jsPsych.init({
        timeline: [{
            type: "html-keyboard-response",
            stimulus: "<div id='main' style='max-width:600;'>Sorry, your setup is insufficient for the current experiment. Either we were unable to acess your webcam, or you are not using the Chrome browser. Please restart using Chrome. Thanks!</div>",
            choices: ["space"]
        }]
    });
});

// JSPSYCH CODE BEGINS HERE

//      PRELOAD IMAGES AND INITIATE TIMELINE

// List of imgs to preload
let images = ["./img/banana.png", "./img/test_faces/female1.jpg", "./img/test_faces/female2.jpg", "./img/test_faces/female3.jpg", "./img/test_faces/female4.jpg", "./img/test_faces/female5.jpg", "./img/test_faces/male1.jpg", "./img/test_faces/male2.jpg", "./img/test_faces/male3.jpg", "./img/test_faces/male4.jpg",, "./img/test_faces/male5.jpg"];

// Initiate jsPsych event timeline
let timeline = [];

//      INTRODUCTION TEXT AND CALIBRATION PLUGIN

// Add a text plugin as a landing page
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "<p>Welcome to the sample Gazer experiment. Press any key to proceed to the Gazer calibration.</p>"
});

// Add the event Gazer Calibration Plugin
// calibrates the four corners of the screen and the fixation cross
// setting the parameter test as "true" will allow you to end the calibration early
timeline.push({
    type: "Calibrate-Quadrants",
    image: "./img/banana.png",
    on_start: () => {
        showVideoShowMouse(true);
    },
    on_finish: () => {
        showVideoShowMouse(false);
    },
    test: true
});

// Add a text plugin to indicate the calibration is complete and provide experiment instructions
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "<p>Thank you for calibrating, you will now proceed to the trials.</p><p> There are a total of 5 blocks of trials, each of a different type. <br>The first will be a block of 8 SINGLE-DOT-GAZE trials.</p><p>Your task is to fixate on the center cross, and then gaze at the red dot when it appears until the end of the trial.</p><p>In each trial, we will wait to present the red dot until we record your gaze is on the center cross.</p><p> Press [space] to continue to proceed to the first trial.</p>"
});

//      INITIATE THE OTHER GAZER PLUGINS

// Initiate the SINGLE-CROSS-GAZE plugin
// Displays fixation cross on the screen until Gazer detects a minimum gaze duration set in milliseconds
const singleCrossGaze = {
    type: "Single-Cross-Gaze",
    duration: 1000
};

// Initiate SINGLE-DOT-DURATION plugin
// Displays a red dot at one of 8 locations equidistant to center of the screen
// Randomly selects the position without replacement so that there are no repeats in the same block
const singleDotDurationTrial = {
    type: "Single-Dot-Duration",
    stimulusLocation: function () {
        return jsPsych.randomization.sampleWithoutReplacement([1, 2, 3, 4, 5, 6, 7, 8], 1)[0];
    }
};

// Initate the DOUBLE-IMAGE-GAZE trial type with two images
// Displays two images and ends the trial once the participant gazes at an image for 1000ms consecutively
const doubleImageGaze = {
    type: "Double-Image-Gaze",
    duration: 1000,
    stimulusOne: jsPsych.timelineVariable("stimulusOne"),
    stimulusTwo: jsPsych.timelineVariable("stimulusTwo")
};

// Initate the DOUBLE-IMAGE-KEY trial with two images
// Displays two images and ends the trial once the participant uses their keyboard to make a response
// By default, the available keys are [f] and [j]
const doubleImageKey = {
    type: "Double-Image-Key",
    stimulusOne: jsPsych.timelineVariable("stimulusOne"),
    stimulusTwo: jsPsych.timelineVariable("stimulusTwo")
};

// Initate the DOUBLE-IMAGE-DURATION trial with two images
// Displays two images and ends the trial after 1000ms
const doubleImageDuration = {
    type: "Double-Image-Duration",
    duration: 1000,
    stimulusOne: jsPsych.timelineVariable("stimulusOne"),
    stimulusTwo: jsPsych.timelineVariable("stimulusTwo")
};

// Initate the SINGLE-IMAGE-DURATION trial with one image
// Displays one image and ends the trial after 1000ms
const singleImageDuration = {
    type: "Single-Image-Duration",
    duration: 1000,
    stimulus: jsPsych.timelineVariable("stimulus")
};

// Initate the SINGLE-IMAGE-KEY trial with one image
// Displays one image and ends with a key response
// Key response set to [spacebar]
// Alternatively, you could include a list of keys as ["space", "q"] or one key as ["space"]
const singleImageKey = {
    type: "Single-Image-Key",
    stimulus: jsPsych.timelineVariable("stimulus"),
    endKeys: "space"
};

//      BEGIN ADDING BLOCKS OF TRIALS TO THE TIMELINE

// Initiate a block of 8 SINGLE-DOT-DURATION trials
// Use singleDotDurationBlock to confirm the participant's calibration and participation as a part of Gazer's "validation" technique
// This block is saved to a variable so it may be added to the timeline multiple times more easily
const singleDotDurationBlock = {
    timeline: [singleDotDurationTrial],
    randomize_order: true,
    repetitions: 8
};

// Add the singleDotDuration block to the timeline
timeline.push(singleDotDurationBlock);

// Define timeline variables for trials with two images
// An array of hash tables with a key for the two image parameters, "stimulusOne" and "stimulusTwo"
// The array has five elements therefore this will define a block of five trials
let timelineVariablesDoubleImage = [{ stimulusOne: "./img/test_faces/female1.jpg", stimulusTwo: "./img/test_faces/male1.jpg" }, { stimulusOne: "./img/test_faces/female2.jpg", stimulusTwo: "./img/test_faces/male2.jpg" }, { stimulusOne: "./img/test_faces/female3.jpg", stimulusTwo: "./img/test_faces/male3.jpg" }, { stimulusOne: "./img/test_faces/female4.jpg", stimulusTwo: "./img/test_faces/male4.jpg" }, { stimulusOne: "./img/test_faces/female5.jpg", stimulusTwo: "./img/test_faces/male5.jpg" }];

// Text between fixation dot and double image gaze trials
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "SINGLE-DOT-GAZE trials are completed. <p>The next block will contain 5 DOUBLE-IMAGE-GAZE trials. This is the only trial types in which a gaze response is necessary to complete the trial.</p><p>To finish a trial, please gaze at one of the stimuli for 1000ms straight.</p>  Press [space] to continue",
    choices: ["space"]
});

// Add a block of DOUBLE-IMAGE-GAZE to the timeline
timeline.push({
    timeline: [doubleImageGaze],
    timeline_variables: timelineVariablesDoubleImage,
    randomize_order: true
});

// Text between double image gaze and double image key trials
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "Active vision trials are completed. <p>The next set of trials will demonstrate the DOUBLE-IMAGE-KEY trial type.</p><p>To end a trial, you will need to provide a key response. Use the [f] or [j] keys to end a trial.</p> <p>To proceed to the trials, press the [space] key.</p>",
    choices: ["space"]
});

// Add a block of DOUBLE-IMAGE-KEY to the timeline
timeline.push({
    timeline: [doubleImageKey],
    timeline_variables: timelineVariablesDoubleImage,
    randomize_order: true
});

// Text between double image key and double image duration trials
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "DOUBLE-VISION-KEY trials are completed. <p>The next set of trials will demonstrate the DOUBLE-IMAGE-DURATION trial type.</p><p>Trials will end after 1000ms. You do not need to provide a key or gaze response.</p> <p>To proceed to the trials, press the [space] key.</p>",
    choices: ["space"]
});

// Add a block of DOUBLE-IMAGE-DURATION to the timeline
timeline.push({
    timeline: [doubleImageDuration],
    timeline_variables: timelineVariablesDoubleImage,
    randomize_order: true
});

// Text between double image duration and single image key trials
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "DOUBLE-VISION-DURATION trials are completed. <p>The next set of trials will demonstrate the <b>SINGLE</b>-IMAGE-KEY trial type.</p><p>To end a trial, you will need to provide a key response. Use the [f] or [j] keys to end a trial.</p> <p>To proceed to the trials, press the [space] key.</p>",
    choices: ["space"]
});

// Define timeline variables for trials with one image
// An array of hash tables with a key for the one image parameters, "stimulus"
// The array has five elements therefore this will define a block of five trials
let timelineVariablesSingleImage = [{ stimulus: "./img/test_faces/female1.jpg" }, { stimulus: "./img/test_faces/female2.jpg" }, { stimulus: "./img/test_faces/female3.jpg" }, { stimulus: "./img/test_faces/female4.jpg" }, { stimulus: "./img/test_faces/female5.jpg" }];

// Add a block of SINGLE-IMAGE-KEY to the timeline
timeline.push({
    timeline: [singleImageKey],
    timeline_variables: timelineVariablesSingleImage,
    randomize_order: true
});

// Text between single image key and single image duration trials
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "SINGLE-VISION-KEY trials are completed. <p>The next set of trials will demonstrate the SINGLE-IMAGE-DURATION trial type.</p><p>Trials will end after 1000ms. You do not need to provide a key or gaze response.</p> <p>To proceed to the trials, press the [space] key.</p>",
    choices: ["space"]
});

// Add a block of SINGLE-IMAGE-DURATION to the timeline
timeline.push({
    timeline: [singleImageDuration],
    timeline_variables: timelineVariablesSingleImage,
    randomize_order: true
});

//      ADD THE DEBRIEF TEXT AND BEGIN THE EXPERIMENT

// Add a simple text plugin to indicate the experiment is over
// Pressing spacebar will end the experiment
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "All trials types are now completed. Press [space] to finish the experiment.",
    choices: ["space"]
});

// Execute the jsPsych experiment with the events defined in the timeline array if chrome is detected
if (chromeBrowser) {
    jsPsych.init({
        timeline: timeline,
        preload_images: images,
        show_progress_bar: true,
        auto_update_progress_bar: true,
        show_preload_progress_bar: false
    });
} else {
    jsPsych.init({
        timeline: [{
            type: "html-keyboard-response",
            stimulus: "<div id='main' style='max-width:600;'>Sorry, your setup is insufficient for the current experiment. Either we were unable to acess your webcam, or you are not using the Chrome browser. Please restart using Chrome. Thanks!</div>",
            choices: ["space"]
        }]
    });
}