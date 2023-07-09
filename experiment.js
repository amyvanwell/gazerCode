// PRE-JSPSYCH CODE
// INITIATE GLOBAL VARIABLES AND COLLECT INFORMATION RE: PARTICIPANT'S BROWSER
// GAZER ONLY WORKS IN THE CHROME BROWSER

// Initiate global variables
let chromeBrowser = false;
let TEST = true;
let PAVLOVIA = true;

// These are define in external libraries, included in the experiment.html
var webgazer;
var disablePredictionPoints;

// Get the user-agent string 
let userAgentString = navigator.userAgent;

// Initiate Webgazer
webgazer.params.showVideoPreview = true;
webgazer.begin(() => {
    // OnFail callback provided by Webgazer if the video camera is not accessible
    // Switch to an alternative timeline and abort the current experiment

    const jsPsych = initJsPsych();
    jsPsych.run([{
            type: jsPsychHtmlKeyboardResponse,
            stimulus: "<div id='main' style='max-width:600;'>Sorry, your setup is insufficient for the current experiment. Either we were unable to acess your webcam, or you are not using the Chrome browser. Please restart using Chrome. Thanks!</div>",
            choices: [" "]
        }]
    );
});


//      JSPSYCH CODE BEGINS HERE
const jsPsych = initJsPsych({
    show_progress_bar: true,
    message_progress_bar: "Completion",
    on_finish: function() {
      jsPsych.data.displayData();
    }
  });

// Initiate jsPsych event timeline
let timeline = [];

//      INITIATE PAVLOVIA IF TOGGLED
// Stores info received by Pavlovia
var pavloviaInfo;

// init connection with pavlovia.org
var pavlovia_init = {
    type: jsPsychPavlovia,
    command: "init",
    // Store info received by Pavlovia init into the global variable `pavloviaInfo`
    setPavloviaInfo: function (info) {
        console.log(info);
        pavloviaInfo = info;
    }
};
if(PAVLOVIA){timeline.push(pavlovia_init)};

//      CHECK FOR SCREEN REQUIREMENTS
timeline.push({
    type: jsPsychBrowserCheck,
    inclusion_function: (data) => {
      return data.browser == 'chrome' && data.mobile === false
    },
    exclusion_message: (data) => {
      if(data.mobile){
        return '<p>You must use a desktop/laptop computer to participate in this experiment.</p>';
      } else if(data.browser !== 'chrome'){
        return '<p>You must use Chrome as your browser to complete this experiment.</p>'
      }
    }
  });

//      PRELOAD IMAGES

// List of imgs to preload
let images = ["./img/banana.png", "./img/birds/bird1.jpeg", "./img/birds/bird2.jpeg", "./img/birds/bird3.jpeg", "./img/birds/bird4.jpeg", "./img/birds/bird5.jpeg", "./img/birds/bird6.jpeg", "./img/birds/bird7.jpeg", "./img/birds/bird8.jpeg", "./img/birds/bird9.jpeg", "./img/birds/bird10.jpeg"];

// Add the preload
timeline.push({
    type: jsPsychPreload,
    images: images,
    show_progress_bar: true,
    on_success: () => {console.log("Done each image")}
  })

//      INTRODUCTION TEXT AND CALIBRATION PLUGIN

// Add a text plugin as a landing page
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Welcome to the Gazer demo experiment.</p>
    <p>The purpose of this demo is to provide working examples for all the available Gazer plugins for jsPsych.</p>
    <p>For documentation of this system, please visit <a href='https://amyvanwell.github.io/gazerCode/'>amyvanwell.github.io/gazerCode/</a>.</p> 
    <p>Press any key to proceed to the first part of the demonstration, the Gazer calibration.</p>`
});

// Add the event Gazer Calibration Plugin
// calibrates the four corners of the screen and the fixation cross
// setting the parameter test as "true" will allow you to end the calibration early
timeline.push({
    type: calibrateQuadrantsSimple,
    image: "./img/banana.png",
    on_start: () => {
        showVideoShowMouse(true);
    },
    on_finish: () => {
        showVideoShowMouse(false);
    },
    test: () => {return TEST}
});

// Add a text plugin to indicate the calibration is complete and provide experiment instructions
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>Thank you for calibrating, you will now proceed to the trials.</p><p> There are a total of 5 blocks of trials, each of a different type. <br>The first will be a block of 8 SINGLE-DOT-DURATION trials.</p><p>Your task is to fixate on the center cross, and then gaze at the red dot when it appears until the end of the trial.</p><p>In each trial, we will wait to present the red dot until we record your gaze has been on the center cross for 250ms consecutively.</p><p> Press [space] to continue to proceed to the first trial.</p>"
});

//      INITIATE THE OTHER GAZER PLUGINS

// Initiate the SINGLE-CROSS-GAZE plugin
// Displays fixation cross on the screen until Gazer detects a minimum gaze duration set in milliseconds
const singleCrossGazeTrial = {
    type: singleCrossGaze,
    duration: 250
};

// Initiate SINGLE-DOT-DURATION plugin
// Displays a red dot at one of 8 locations equidistant to center of the screen
// Randomly selects the position without replacement so that there are no repeats in the same block
const singleDotDurationTrial = {
    type: singleDotDuration,
    stimulusLocation: function() {
        return jsPsych.randomization.sampleWithoutReplacement([1, 2, 3, 4, 5, 6, 7, 8], 1)[0];
    }
};

// Initate the DOUBLE-IMAGE-GAZE trial type with two images
// Displays two images and ends the trial once the participant gazes at an image for 1000ms consecutively
const doubleImageGazeTrial = {
    type: doubleImageGaze,
    duration: 1000,
    stimulusOne: jsPsych.timelineVariable("stimulusOne"),
    stimulusTwo: jsPsych.timelineVariable("stimulusTwo")
};

// Initate the DOUBLE-IMAGE-KEY trial with two images
// Displays two images and ends the trial once the participant uses their keyboard to make a response
// By default, the available keys are [f] and [j]
const doubleImageKeyTrial = {
    type: doubleImageKey,
    stimulusOne: jsPsych.timelineVariable("stimulusOne"),
    stimulusTwo: jsPsych.timelineVariable("stimulusTwo")
};

// Initate the DOUBLE-IMAGE-DURATION trial with two images
// Displays two images and ends the trial after 1000ms
const doubleImageDurationTrial = {
    type: doubleImageDuration,
    duration: 1000,
    stimulusOne: jsPsych.timelineVariable("stimulusOne"),
    stimulusTwo: jsPsych.timelineVariable("stimulusTwo")
};

// Initate the SINGLE-IMAGE-DURATION trial with one image
// Displays one image and ends the trial after 1000ms
const singleImageDurationTrial = {
    type: singleImageDuration,
    duration: 1000,
    stimulus: jsPsych.timelineVariable("stimulus")
};

// Initate the SINGLE-IMAGE-KEY trial with one image
// Displays one image and ends with a key response
// Key response set to [spacebar]
// Alternatively, you could include a list of keys as [" ", "q"] or one key as [" "]
const singleImageKeyTrial = {
    type: singleImageKey,
    stimulus: jsPsych.timelineVariable("stimulus"),
    choices: ["f", "j"]
};

//      BEGIN ADDING BLOCKS OF TRIALS TO THE TIMELINE

// Initiate a block of 8 SINGLE-DOT-DURATION trials
// Use singleDotDurationBlock to confirm the participant's calibration and participation as a part of Gazer's "validation" technique
// This block is saved to a variable so it may be added to the timeline multiple times more easily
const singleDotDurationBlock = {
    timeline: [singleCrossGazeTrial, singleDotDurationTrial],
    randomize_order: true,
    repetitions: 8
};

// // Add the singleDotDuration block to the timeline
timeline.push(singleDotDurationBlock);

// Define timeline variables for trials with two images
// An array of hash tables with a key for the two image parameters, "stimulusOne" and "stimulusTwo"
// The array has five elements therefore this will define a block of five trials
let timelineVariablesDoubleImage = [
    { stimulusOne: "./img/birds/bird1.jpeg", 
    stimulusTwo: "./img/birds/bird2.jpeg" }, 
    { stimulusOne: "./img/birds/bird3.jpeg", 
    stimulusTwo: "./img/birds/bird4.jpeg" }, 
    { stimulusOne: "./img/birds/bird5.jpeg", 
    stimulusTwo: "./img/birds/bird6.jpeg" }, 
    { stimulusOne: "./img/birds/bird7.jpeg",
    stimulusTwo: "./img/birds/bird8.jpeg" }, 
    { stimulusOne: "./img/birds/bird9.jpeg", 
    stimulusTwo: "./img/birds/bird10.jpeg" }
];

// Text between fixation dot and double image gaze trials
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "SINGLE-DOT-DURATION trials are completed. <p>The next block will contain 5 DOUBLE-IMAGE-GAZE trials. This is the only trial types in which a gaze response is necessary to complete the trial.</p><p>To finish a trial, please gaze at one of the stimuli for 1000ms straight.</p>  Press [space] to continue"});

// Add a block of DOUBLE-IMAGE-GAZE to the timeline
timeline.push({
    timeline: [doubleImageGazeTrial],
    timeline_variables: timelineVariablesDoubleImage,
    randomize_order: true
});

// Text between double image gaze and double image key trials
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Active vision trials are completed. <p>The next set of trials will demonstrate the DOUBLE-IMAGE-KEY trial type.</p><p>To end a trial, you will need to provide a key response. Use the [f] or [j] keys to end a trial.</p> <p>To proceed to the trials, press the [space] key.</p>"
});

// // Add a block of DOUBLE-IMAGE-KEY to the timeline
timeline.push({
    timeline: [doubleImageKeyTrial],
    timeline_variables: timelineVariablesDoubleImage,
    randomize_order: true
});

// Text between double image key and double image duration trials
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "DOUBLE-VISION-KEY trials are completed. <p>The next set of trials will demonstrate the DOUBLE-IMAGE-DURATION trial type.</p><p>Trials will end after 1000ms. You do not need to provide a key or gaze response.</p> <p>To proceed to the trials, press the [space] key.</p>"
});

// Add a block of DOUBLE-IMAGE-DURATION to the timeline
timeline.push({
    timeline: [doubleImageDurationTrial],
    timeline_variables: timelineVariablesDoubleImage,
    randomize_order: true
});

// Text between double image duration and single image key trials
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "DOUBLE-VISION-DURATION trials are completed. <p>The next set of trials will demonstrate the <b>SINGLE</b>-IMAGE-KEY trial type.</p><p>To end a trial, you will need to provide a key response. Use the [spacebar] key to end a trial.</p> <p>To proceed to the trials, press the [space] key.</p>"
});

// Define timeline variables for trials with one image
// An array of hash tables with a key for the one image parameters, "stimulus"
// The array has five elements therefore this will define a block of five trials
let timelineVariablesSingleImage = [
    { stimulus: "./img/birds/bird2.jpeg" }, 
    { stimulus: "./img/birds/bird3.jpeg" }, 
    { stimulus: "./img/birds/bird4.jpeg" }, 
    { stimulus: "./img/birds/bird5.jpeg" }, 
    { stimulus: "./img/birds/bird6.jpeg" }
];

// Add a block of SINGLE-IMAGE-KEY to the timeline
timeline.push({
    timeline: [singleImageKeyTrial],
    timeline_variables: timelineVariablesSingleImage,
    randomize_order: true
});

// Text between single image key and single image duration trials
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "SINGLE-VISION-KEY trials are completed. <p>The next set of trials will demonstrate the SINGLE-IMAGE-DURATION trial type.</p><p>Trials will end after 1000ms. You do not need to provide a key or gaze response.</p> <p>To proceed to the trials, press the [space] key.</p>"
});

// Add a block of SINGLE-IMAGE-DURATION to the timeline
timeline.push({
    timeline: [singleImageDurationTrial],
    timeline_variables: timelineVariablesSingleImage,
    randomize_order: true
});

//      ADD THE DEBRIEF TEXT AND BEGIN THE EXPERIMENT

// Add a simple text plugin to indicate the experiment is over
// Pressing spacebar will end the experiment
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "All trials types are now completed. Please visit the Gazer documentation at <a href='https://amyvanwell.github.io/gazerCode/'>amyvanwell.github.io/gazerCode/</a> for an example of the data output produced by Gazer.</p><p>Thank you for trying the demo, you may now exit the page.</p><p>If you have any questions, please email the author at amyvanwell@uvic.ca</p>",
    on_start: ()=>{showVideoShowMouse(true)}
});

//      SAVE DATA TO PAVLOVIA
// finish connection with pavlovia.org
var pavlovia_finish = {
    type: jsPsychPavlovia,
    command: "finish",
    participantId: "GAZER-DEMO",
    // Thomas Pronk; your filter function here
    dataFilter: function(data) {
      // Printing the data received from jsPsych.data.get().csv(); a CSV data structure
      console.log(data);
      // You can also access the data directly, for instance getting it as JSON
      console.log(jsPsych.data.get().json());
      // Return whatever data you'd like to store
      return data;
    },
    // Thomas Pronk; call this function when we're done with the experiment and data reception has been confirmed by Pavlovia
    completedCallback: function() {
      alert('data successfully submitted!');
    }
};

if(PAVLOVIA){timeline.push(pavlovia_finish)};

//      EXECUTE TIMELINE
console.log(timeline);
jsPsych.run(timeline);
