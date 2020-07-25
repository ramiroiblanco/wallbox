#Giphy search endpoint tests

This repository contains some basic tests of the Giphy search endpoint (https://developers.giphy.com/docs/api/endpoint/#search)

##Comments

- There are 3 tests that fail. I have added in the `search.js` test file notes as to why they are failing.
- The projects structure is a standard Cypress structure, with the tests stored in the `cypress/integration`.
- It has been chosen by Standard Style Guide to omit semi-colons at the end of each statement.

##Requirements

- NodeJS must be installed to make use of npm.

##How to run the tests

Clone the repository:

`git clone https://github.com/ramiroiblanco/wallbox.git`

In the repository's directory run:

`npm install`

Now you are ready to run the tests. You can run the tests from the Cypress command line interface (CLI) or using the Cypres GUI.

####Cypress GUI
Run:

`cypress open`

After some time, the Cypress GUI will open (this can take a while if it is the first time you are using Cypress).
Once the Gui is open, click on 'run all specs'. This will open a browser window and run the tests.

####Cypress CLI
Run:

`cypress run'