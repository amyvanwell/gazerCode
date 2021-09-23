---
layout: default
title: Introduction
nav_order: 1
description: "GitHub Pages site for documentation of the Gazer program."
---

## Introduction

#### Author: Amy vanWell, University of Victoria
 
### Problem
  
There exist web-based eye tracking systems for personal laptop cameras that have even been used to create publishable research:
  
 Semmelmann, Kilian, and Sarah Weigelt. 2018. “Online Webcam-Based Eye Tracking in Cognitive Science: A First Look.” Behavior Research Methods 50 (2): 451–65.
  
However, the code used to conduct this research has not been shared. In order to use the eye tracking system to conduct an experiment, a researcher would need to encorporate it into a web framework and therefore would need to be a skilled web developer. In addition, they would need to conduct many tests of their system in order to confirm the quality and validity of the data. The requirement of knowledge, work and time creates a barrier in conducting online eye tracking research for the typical vision scientist.

### Goal
  
The current software was developed to be a reliable system of web-based eye tracking for vision scientists. Although the eye tracking technology used might not be new, the Gazer system is unique as it encorporates it into a popular and easy-to-use framework for experimentation. Gazer also includes tested methods for calibration, data collection and validation, and analysis.
  
Ideally, Gazer is an open software that will allow vision scientists to skip most of the frustation of coding an eye tracking system and get right to developing an experiment.

### Open-source Softwares
  
The main softwares used in the Gazer program are
  
  - WebGazer.js
  
  The code for WebGazer is available publicly on [Github](https://github.com/brownhci/WebGazer). The software was developed at Brown University and is a     system for eye tracking using personal laptop cameras. User interactions such as clicks are synced with a face mesh on the video feed and used to generate real-time gaze prediction. 
  
  - jsPsych

  jsPsych is a popular framework for developing online psychology experiments. You can find full documentation on their [website](https://www.jspsych.org/). Although programming knowledge is required to use this system, it is a small barrier in comparison to developing a full eye tracking system.

