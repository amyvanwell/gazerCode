# Gazer Code and Sample Experiment

# Documentation

For full documentation of Gazer past download and install, please consult the [Gazer Docs](https://amyvanwell.github.io/gazerCode/).

# How To Install

1. Branch this repository and download the branch onto your computer.
2. If you don't already have Node.js on your computer, install it from: [Download link](https://nodejs.org/en/download/)
3. In terminal, navigate to the new repository and run the command:

```
npm install
```

# How To Run Experiments

Follow the next step to create a local HTTPS server. **You must complete installation to perform these steps.**

1. In terminal, navigate to the folder you have been coding in (default name gazerTemplate) and run the following command:

```
npm run experiment
```

**The server you have opened will close if you exit the tab in which you ran the previous command. You will have to repeat step 1 each time you want to run the experiment.**

2. In the browser, navigate to this URL:
   [Localhost](http://localhost:8000/)
3. You may need to select the public folder from there. Once you've done that, you'll be at the index.html file and at the start of the program :)

# How To Update Your Experiment

This folder has two trees; the source tree (the src file) and the public tree (the public file). The code run by your participants is in the public folder. You will work in the src folder (i.e. you will edit all of your js files in the src folder) and then use a program to transfer these changes to the public folder.

1. When you make any changes, run the following command in terminal:

```
npm run build
```

After you've run this command, you will have rebuilt the public tree including any new changes, and these changes will be reflected in the local server.

# How To Code in Development Mode (Auto-Updating As You Go)

The benefit of having a separate source and public tree is the ability to check your work during the building of the public tree. The Babel system that does the building looks for typos and other types of logical and syntactical errors along the way. The system will alert you if it finds these erorrs and "fail" to build. Essentially, the program finds problems for you and points out exactly what and where they are.

While you are editing your code in the source folder, run the following command:

```
npm run dev
```

This command will start a program to re-run the build command every time a file in the source tree is re-saved. In other words, every time you save your work in the source tree (any file!), this program will try to build the public tree again and will alert you of any potential errors. Use this while you work to both save time and generate better code!
