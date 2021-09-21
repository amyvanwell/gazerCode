  
## Introduction

#### Author: Amy vanWell, University of Victoria
 
### Problem
  
There exist eye tracking systems for personal laptop cameras that have even been used to create publishable research:
  
 Semmelmann, Kilian, and Sarah Weigelt. 2018. “Online Webcam-Based Eye Tracking in Cognitive Science: A First Look.” Behavior Research Methods 50 (2): 451–65.
  
However, the code used to conduct this research has not been shared. Therefore, in order to use these systems a researcher would need to write code to encorporate them into a web framework and therefore would need to be a skilled web developer. In addition, they would need to conduct many tests of their system in order to confirm the quality and validity of the data. The requirement of knowledge, work and time creates a barrier in conducting online eye tracking research for the typical vision scientist.

### Goal
  
The current software was developed to be a reliable system of web-based eye tracking for vision scientists. Although the eye tracking technology used might not be new, the Gazer system is unique as it encorporates it into a popular and easy-to-use framework for experimentation. Gazer also includes tested methods for calibration, data collection and validation, and analysis.
  
Ideally, Gazer is an open software that will allow vision scientists to skip most of the frustation of coding an eye tracking system and get right to developing an experiment.

### Open-source Softwares
  
The main softwares used in the Gazer program are
  
  1. WebGazer.js
  
  The code for WebGazer is available publicly on [Github](https://github.com/brownhci/WebGazer). The software was developed at Brown University and is a     system for eye tracking using personal laptop cameras. User interactions such as clicks are synced with a face mesh on the video feed and used to generate real-time gaze prediction. 
  
  2. jsPsych

  jsPsych is a popular framework for developing online psychology experiments. You can find full documentation on their [website](https://www.jspsych.org/). Although programming knowledge is required to use this system, it is a small barrier in comparison to developing a full eye tracking system.

## Philosophy
  
The Gazer system of experimentation is comprised of 4 phases.
  
  - Calibration
  
  Participants calibrate the eye tracking system using a point-and-click method. The calibration must meet a accuracy threshold (default to 70%) in order to proceed to further trials. The calibration plug-in should be included many times in a Gazer experiment in order to maintain the accuracy of the eye tracking system. 
  
  - Validation
  
  A simple exogeneous attention task is included in order to "take a look into" the Gazer code. A potential limitation with online experimentation is that the experimenter is not in the room to confirm proper participation. Gazer includes a fixation task with a known output, provided proper calibration and participation. This task should be included in any Gazer experiment so that the researcher may look at the data output and validate the participant's data. If the data does not follow the known pattern, this could be an indication of improper calibration or just improper participation (i.e., participant is not following the provided task). 
  
  - Collection
  
  There are currently plug-ins for five different types of trials. In the data collection phase, the experimenter defines blocks of trials with their own inputs in order to follow their own custom experiment design.
  
  - Analysis
  
  After performing sufficient data collection and validation, Python-based analysis functions can be used to evaluate fixations and saccades from the Gazer data.
  
## Demo
  
A full demonstration of a Gazer experiment is available at the following link. Included in the experiment is the calibration plugin, validation plugin, and many trial types.
  
### Trial Types
  
The name of trials are coded to represent: [Number of stimuli]-Trial-[Response that ends trial]. During all trials, gaze is recorded using WebGazer.js .
  
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

## How to Start

### Downloading
  
Full instructions for downloading the Gazer system including a demo experiment can be found on the Github repo [here](https://github.com/amyvanwell/gazerCode).

### Editing
  
After downloading and install the system, make sure you follow the instructions in the repo's README for how to build and save edits to the src tree. To actually edit your experiment, make changes in the experiment.js file of the src tree. Consult the jsPsych [website](https://www.jspsych.org/) for how to use the framework. 

### Making new plugins
  
There may be the case that you have a designed an experiment with trials that does not correspond to any of the existing plug-ins. I reccommend using the plug-in Single-Image-Duration as a beginning point to edit and develop a new plug-in as it has the least amount of code. If the trial you want to have is sufficiently sophisticated, you may contact the original author Amy vanWell (amyvanwell@uvic.ca) and request either assistance or for the author to write the plug-in.

## Data
  
### Example

### Analysis

### Example

## Published Research
  
 Gazer is currently being used to conduct online experiments set to be published in 2022. A pilot version of the study including a pilot experiment were presented at V-VSS 2021 and will also be presented at OPAM in November 2021.

  vanWell, A., Liu, X., Martin, J., & Tanaka, J.W. (2021, May 23) Investigating the time course of face perception using web-based eye tracking [Poster]. V-VSS, virtual. [Video Walkthrough](https://www.amyvanwell.com/presentations#:~:text=V-VSS%2C%20virtual.-,Video%20Walkthrough,-vanWell%2C%20A.%2C%20Liu)
  
