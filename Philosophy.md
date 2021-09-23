---
layout: default
title: Philosophy
nav_order: 2
description: "The general philosophy and structure of the Gazer experiments."
---

## Philosophy
  
The Gazer system of experimentation is comprised of 4 phases.
  
  - Calibration
  
  Participants calibrate the eye tracking system using a point-and-click method. The calibration must meet a accuracy threshold (default to 70%) in order to proceed to further trials. The calibration plug-in should be included many times in a Gazer experiment in order to maintain the accuracy of the eye tracking system. 
  
  - Validation
  
 A potential limitation with online experimentation is that the experimenter is not in the room to confirm proper participation. Gazer includes the attention task Single-Dot-Duration in order to take a look "into" the Gazer code. There is a known/expected output for this task, provided proper calibration and participation. This task should be included in any Gazer experiment so that the researcher may look at the data output and validate the participant's data. If the data does not follow the known pattern, this could be an indication of improper calibration or improper participation (i.e., participant is not following the provided task). 
  
  - Collection
  
  There are currently plug-ins for five different types of trials. In the data collection phase, the experimenter defines blocks of these trials with their own parameters/inputs in order to follow their own custom experiment design.
  
  - Analysis
  
  After performing sufficient data collection and validation, Python-based analysis functions can be used to evaluate fixations and saccades from the Gazer data.
  
