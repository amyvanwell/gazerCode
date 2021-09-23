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

A fixation cross is shown in the center of the screen. The trial finishes when 1000ms of consecutive gaze is recorded on the cross. Can be used before experimental stimuli are shown in order to ensure that participants are gazing at the center of the screen at the beginning of every trial.

##### Single-Dot-Duration

A fixation cross is shown in the center of the screen for 500ms. At the 500ms point, a red 50px by 50px dot is shown in one of the eight corners of the screen. The participant's task is to fixation on the dot until the trial ends. The trial ends after an additional 1500ms.
This trial type can be used in order to perform data validation. The output of the Webgazer predictions should produce a known gaze pattern, therefore the results can be checked against this known pattern to confirm proper participation and calibration.
  
##### Single-Image-Key
  
A single image is shown in the center of the screen. A key response defined by the experiment ends the trial.
 
##### Single-Image-Duration
  
A single image is shown in the center of the screen. The trial ends after a defined duration.

##### Double-Image-Key
  
Two images are shown, separated by a padding value defined by the experimenter. A key response defined by the experiment ends the trial.
  
##### Double-Image-Duration
  
Two images are shown, separated by a padding value defined by the experimenter. The trial ends after a defined duration.

##### Double-Image-Gaze
  
Currently, the only "active vision" plugin. Two images are shown, separated by a padding value defined by the experimenter. The trial ends after Gazer records a pre-defined threshold of consecutive fixation on one of the stimuli. In other words, if 500ms is provided as the threshold, the trial will end once the participant gazes at one of the stimuli for 500ms.
