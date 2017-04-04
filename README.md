# Social Voting App

An exploration into creating a hybrid app using AngularJs, Ionic framework and Firebase noSQL realtime database and material design elements.

The app allows users to connect, create events and vote on them in real time. It was created to use at our wresting pay per view event viewings when some of us couln't attend.

## Install

  * npm install
  * bower install

## Run

 * npm install -g ionic && ionic serve 
 * Will not work without Firebase config variables which have been removed for security.
 * It also appears that Facebook have changed their auth policy so needs updating to pull profile information again.
 
 
## Features 

 * Current event view displaying all matches/sub events and the overall scores (Screen 1)
 * Event can be tapped on to view individual player scores.
 * Live updating user chat
 * Event history (Screen 2)
 * Player/Team Database (Screen 3) which Scrapes Wikipedia to pull profile image if present.
 * Live updates without the need for refresh.
 
![Alt text](screens/Screenshot_1.png?raw=true "Current Event View")

![Alt text](screens/Screenshot_2.png?raw=true "Even History")

![Alt text](screens/Screenshot_3.png?raw=true "Player/Team Database")


## Release History

* 0.6.0 Initial release
