---
layout: default
title: Demo and Trial Types
nav_order: 3
description: "Link to Gazer demo experiment and description of the example trial types."
---

## Demo
  
The code for Gazer is available at the github [repo](https://gazer-demo.herokuapp.com/). Included in the code is a demo experiment demonstrating the calibration plugin, validation plugin, and all trial types.
  
### Trial Types
  
The name of trials are coded to represent: {Number of stimuli}-{Type of Stimuli}-{Response that ends trial}. During all trials, gaze is recorded using WebGazer.js .

##### Single-Cross-Gaze

A fixation cross is shown in the center of the screen. The trial finishes when a minimum threshold of consecutive gaze is recorded on the cross. The threshold is defined by the "duration" parameter and defaults to 500ms. Can be used before experimental stimuli are shown in order to ensure that participants are gazing at the center of the screen at the beginning of every trial.

```js
const singleCrossGaze = {
    type: "Single-Cross-Gaze",
    duration: 250
};
```

##### Single-Dot-Duration

A fixation cross is shown in the center of the screen for 500ms. At the 500ms point, a red 50px by 50px dot is shown in one of the eight corners of the screen. The participant's task is to fixation on the dot until the trial ends. The trial ends after an additional amount of time identified in the 'duration' parameter, defaults to 1500ms if no time provided.
This trial type can be used in order to perform data validation. The output of the Webgazer predictions should produce a known gaze pattern, therefore the results can be checked against this known pattern to confirm proper participation and calibration.

```js
const singleDotDurationTrial = {
    type: "Single-Dot-Duration",
    stimulusLocation: 3,
    duration: 1500
};
```
  
##### Single-Image-Key
  
A single image is shown in the center of the screen. A key response defined by the experimenter ends the trial, but defaults to the spacebar. The parameter "duration" sets the maximum time to wait a for a key response with a default of 10000ms. The parameter "upright" allows you to choose the vertical orientation of the image using the boolean values of True or False (i.e. upright: True correspond to a upright stimulus). The default is upright: True.

```js
const singleImageKey = {
    type: "Single-Image-Key",
    stimulus: "img1.jpg",
    endKeys: "space",
    upright: False
};
```
 
##### Single-Image-Duration
  
A single image is shown in the center of the screen. The trial ends after a time defined in the "duration" parameter, this defaults to 1000ms. The vertical orientation of the stimulus can be set using the "upright" parameter and the boolean value of True or False. The default value is True.

```js
const singleImageDuration = {
    type: "Single-Image-Duration",
    duration: 1500,
    stimulus: "img1.jpg",
    upright: True
};
```

##### Double-Image-Key
  
Two images are shown, separated by a padding value that can be defined by the experimenter. A key response ends the trial. THe key response defaults to the set of keys ["f", "j"] but can be changed. The parameter "duration" defines the timeout of the trial, i.e. the maximum time to wait for a response until you move on to the next trial. Duration defaults to 5000ms.

```js
const doubleImageKey = {
    type: "Double-Image-Key",
    stimulusOne: "img1.jpg",
    stimulusTwo: "img2.jpg",
    paddingVal: 50,
    endKeys: ["r", "u"],
    duration: 100000
};
```
  
##### Double-Image-Duration
  
Two images are shown, separated by a padding value defined by the experimenter. The trial ends after a defined duration, defaults to 5000ms.

```js
const doubleImageDuration = {
    type: "Double-Image-Duration",
    duration: 1000,
    stimulusOne: "picture1.jpg",
    stimulusTwo: "picture1.jpg",
    paddingVal: 200
};
```

##### Double-Image-Gaze
  
Currently, the only "active vision" plugin. Two images are shown, separated by a padding value defined by the experimenter (default is 30px). The trial ends after Gazer records a pre-defined threshold of consecutive fixation on one of the stimuli. In other words, if 500ms is provided as the threshold, the trial will end once the participant gazes at one of the stimuli for 500ms. The default value for duration is 1000ms.

```js

const doubleImageGaze = {
    type: "Double-Image-Gaze",
    duration: 1000,
    stimulusOne: "picture1.jpg",
    stimulusTwo: "picture1.jpg",
    paddingVal: 50
};

```
