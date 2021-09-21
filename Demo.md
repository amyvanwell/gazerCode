---
layout: default
title: Demo
nav_order: 3
description: "Link to Gazer demo experiment and description of the example trial types."
---

## Demo
  
A full demonstration of a Gazer experiment is available at the following [link](https://gazer-demo.herokuapp.com/). Included in the experiment is the calibration plugin, validation plugin, and many trial types.
  
### Trial Types
  
The name of trials are coded to represent: {Number of stimuli}-Trial-{Response that ends trial}. During all trials, gaze is recorded using WebGazer.js .
  
##### Single-Trial-Key
  
A single image is shown in the center of the screen. A key response defined by the experiment ends the trial.
 
##### Single-Trial-Duration
  
A single image is shown in the center of the screen. The trial ends after a defined duration.

##### Double-Trial-Key
  
Two images are shown, separated by a padding value defined by the experimenter. A key response defined by the experiment ends the trial.
  
##### Double-Trial-Duration
  
Two images are shown, separated by a padding value defined by the experimenter. The trial ends after a defined duration.

##### Double-Trial-Gaze
  
Currently, the only "active vision" plugin. Two images are shown, separated by a padding value defined by the experimenter. The trial ends after Gazer records a pre-defined threshold of consecutive fixation on one of the stimuli. In other words, if 500ms is provided as the threshold, the trial will end once the participant gazes at one of the stimuli for 500ms.
