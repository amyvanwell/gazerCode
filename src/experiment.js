// Initiate global variables
let chromeAgent = false;

// These are define in external libraries, included in the experiment.html
var webgazer;
var jsPsych;
var disablePredictionPoints;

// Get the user-agent string 
let userAgentString = navigator.userAgent;
// Detect Chrome 
chromeAgent = userAgentString.indexOf("Chrome") > -1;

// Once the page is loaded, initiate Webgazer
document.addEventListener("DOMContentLoaded", () => {
    if (webgazer) {
        webgazer.params.showVideoPreview = true;
        webgazer.begin();
    }
});

// JSPSYCH CODE BEGINS HERE

// List of imgs to preload
let images = ["./img/banana.png", "./img/test_faces/female1.jpg", "./img/test_faces/female2.jpg", "./img/test_faces/female3.jpg",
    "./img/test_faces/female4.jpg", "./img/test_faces/female5.jpg", "./img/test_faces/male1.jpg", "./img/test_faces/male2.jpg",
    "./img/test_faces/male3.jpg", "./img/test_faces/male4.jpg", , "./img/test_faces/male5.jpg"
];

// Initiate jsPsych event timeline
let timeline = [];

// Add a text plugin as a landing page
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "<p>Welcome to the sample Gazer experiment. Press any key to proceed to the Gazer calibration.</p>"
});

// Add the event Gazer Calibration Plugin
// calibrates the four corners of the screen and the fixation cross
// setting the paramter test as "true" will allow you to end the calibration early
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
    stimulus: "<p>Thank you for calibrating, you will now proceed to the trials.</p><p> There is one block of 8 trials.</p><p>Your task is to fixate on the center cross, and then gaze at the red dot when it appears until the end of the trial.</p><p>In each trial, we will wait to present the red dot until we record your gaze is on the center cross.</p><p> Press [space] to continue to proceed to the first trial.</p>"
});

// Initiate the Gazer Fixation Cross plugin
// Displays fixation cross on the screen until Gazer detects a minimum gaze duration set in milliseconds
const fixationCross = {
    type: "Single-Cross-Gaze",
    duration: 1000
};

// Initiate Gaze Dot Fixation plugin
// Displays a red dot at one of 8 locations equidistant to center of the screen
// Randomly selects the position without replacement so that there are no repeats in the same block
const fixationDotTrial = {
    type: "Single-Dot-Duration",
    stimulusLocation: function() {
        return jsPsych.randomization.sampleWithoutReplacement([1, 2, 3, 4, 5, 6, 7, 8], 1)[0]
    }
}

// Initiate a block of 8 fixation dot trials
// use the fixationDotBlock to validate the participant's eye tracking calibration
// and confirm they are in fact participating appropriately
fixationDotBlock = {
    timeline: [fixationDotTrial],
    randomize_order: true,
    repetitions: 8
}

// Active vision trial with two images
const activeVisionTrial = {
    type: "Double-Image-Gaze",
    duration: 1000,
    stimulusOne: jsPsych.timelineVariable("stimulusOne"),
    stimulusTwo: jsPsych.timelineVariable("stimulusTwo")
}

// Double image trial with key response
const doubleImageKey = {
    type: "Double-Image-Key",
    stimulusOne: jsPsych.timelineVariable("stimulusOne"),
    stimulusTwo: jsPsych.timelineVariable("stimulusTwo")
}

// Double image trial ending after a time duration
const doubleImageDuration = {
    type: "Double-Image-Duration",
    duration: 1000,
    stimulusOne: jsPsych.timelineVariable("stimulusOne"),
    stimulusTwo: jsPsych.timelineVariable("stimulusTwo")
}

// Single image trial ending after a time duration
const singleImageDuration = {
    type: "Single-Image-Duration",
    duration: 500,
    stimulus: jsPsych.timelineVariable("stimulus")
}

// Single image trial ending after a key press
const singleImageKey = {
    type: "Single-Image-Key",
    stimulus: jsPsych.timelineVariable("stimulus"),
    endKeys: "space"
}

timeline.push(fixationDotBlock)


let timelineVariablesDoubleImage = [
    { stimulusOne: "./img/test_faces/female1.jpg", stimulusTwo: "./img/test_faces/male1.jpg" },
    { stimulusOne: "./img/test_faces/female2.jpg", stimulusTwo: "./img/test_faces/male2.jpg" },
    { stimulusOne: "./img/test_faces/female3.jpg", stimulusTwo: "./img/test_faces/male3.jpg" },
    { stimulusOne: "./img/test_faces/female4.jpg", stimulusTwo: "./img/test_faces/male4.jpg" },
    { stimulusOne: "./img/test_faces/female5.jpg", stimulusTwo: "./img/test_faces/male5.jpg" }
]

// Add a simple text plugin to indicate the experiment is over
// Pressing spacebar will end the experiment
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "Fixation dot trials are completed. Press [space] to continue to the active vision trials.",
    choices: ["space"]
});

// Add trials to the jsPysch timeline
// Each trial presents a Gazer fixation cross and a two stimulus trial ending with a gaze response
timeline.push({
    timeline: [activeVisionTrial],
    timeline_variables: timelineVariablesDoubleImage,
    randomize_order: true
})

// Add a simple text plugin to indicate the experiment is over
// Pressing spacebar will end the experiment
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "Active vision trials are completed. Press [space] to continue to the next set of trials. Use the [f] or [j] keys to end a trial.",
    choices: ["space"]
});

// Add trials to the jsPysch timeline
// Each trial presents a Gazer fixation cross and a two stimulus trial ending with a key response
timeline.push({
    timeline: [doubleImageKey],
    timeline_variables: timelineVariablesDoubleImage,
    randomize_order: true
})

// Add a simple text plugin to indicate the experiment is over
// Pressing spacebar will end the experiment
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "Key response trials are completed. Press [space] to continue to the next set of trials. Each trial finishes after 1 second.",
    choices: ["space"]
});

// Add trials to the jsPysch timeline
// Each trial presents a Gazer fixation cross and a two stimulus trial ending at specific duration
timeline.push({
    timeline: [doubleImageDuration],
    timeline_variables: timelineVariablesDoubleImage,
    randomize_order: true
})

let timelineVariablesSingleImage = [
    { stimulus: "./img/test_faces/female1.jpg" },
    { stimulus: "./img/test_faces/female2.jpg" },
    { stimulus: "./img/test_faces/female3.jpg" },
    { stimulus: "./img/test_faces/female4.jpg" },
    { stimulus: "./img/test_faces/female5.jpg" }
]

// Add a simple text plugin to indicate the experiment is over
// Pressing spacebar will end the experiment
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "Duration trials are completed. Press [space] to continue to the next set of trials. Each trial finishes with key response of [space].",
    choices: ["space"]
});

// Add trials to the jsPysch timeline
// Each trial presents a Gazer fixation cross and a two stimulus trial ending at specific duration
timeline.push({
    timeline: [singleImageKey],
    timeline_variables: timelineVariablesSingleImage,
    randomize_order: true
})

// Add a simple text plugin to indicate the experiment is over
// Pressing spacebar will end the experiment
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "Key trials are completed. Press [space] to continue to the next set of trials. Each trial finishes after 500ms.",
    choices: ["space"]
});

// Add trials to the jsPysch timeline
// Each trial presents a Gazer fixation cross and a two stimulus trial ending at specific duration
timeline.push({
    timeline: [singleImageDuration],
    timeline_variables: timelineVariablesSingleImage,
    randomize_order: true
})


// Add a simple text plugin to indicate the experiment is over
// Pressing spacebar will end the experiment
timeline.push({
    type: 'html-keyboard-response',
    stimulus: "Trials are completed. Press [space] to finish the experiment.",
    choices: ["space"]
});

// Initiate the text to display if Chrome is not used
const noChrome = {
    type: "html-keyboard-response",
    stimulus: "<div id='main' style='max-width:600;'>Sorry, this experiment does not work without the Chrome browser. Please restart using Chrome. Thanks!</div>",
    choices: ["space"]
};

console.log(timeline)

// Execute the jsPsych experiment with the events defined in the timeline array if chrome is detected
if (chromeAgent == true) {
    jsPsych.init({
        timeline: timeline,
        preload_images: images,
        show_progress_bar: true,
        auto_update_progress_bar: true,
        show_preload_progress_bar: false
    });
} else {
    jsPsych.init({
        timeline: [noChrome]
    });
}