WUCT
====

Want to get in touch? Reach out at cc@clive.io.

[![Build Status](https://travis-ci.org/cchan/WUCT.svg?branch=master)](https://travis-ci.org/cchan/WUCT)
[![License](https://img.shields.io/github/license/cchan/WUCT.svg)](https://github.com/cchan/WUCT/blob/master/LICENSE)
![Dependencies](https://img.shields.io/david/cchan/WUCT.svg)

- https://wuct.clive.io/ shows the live scoreboard.
- https://wuct.clive.io/scoring.html shows the scoring station interface. This is intended to be used for multiple scoring stations throughout the competition venue where teams can drop off question packets. Each scoring station should handle multiple teams, and each team should be assigned to a single station.
- https://wuct.clive.io/control.html shows the control panel. This is intended to be the central control for everything.

Based off of the Lexington Math Tournament Guts Round, which is in turn based off of the HMMT Guts Round.

Thanks to [BugSnag](https://www.bugsnag.com) for generously providing an open source license.

[Figma mockup](https://www.figma.com/file/wq4gmjooSrRJBbULKhIoa3/wuct) of the new online grading version.

Probably the lowest code quality codebase I have ever written, oops.

## Steps to initialize a new year of WUCT
- force push master back to the wuct branch (so it picks up cname and drops lmt changes)
- bump the year in common.js ("wuct20XX")
- change the permissions in Firebase to allow only access to that year (a copy of the permissions is in rules.sample.json)
- add the locations of the answer keys into Firebase manually:
    - <year>/ak/<difficulty> = https://public/google/drive/url
        - or <year>/ak/<difficulty>/<question_num> = https://public/google/drive/url, but every question_num must be present or it'll break
    - <year>/questions/<difficulty>/<question_num> = https://public/google/drive/url
- make sure the wuct@clive.io user is enabled and has a password (in the Authentication page in Firebase)
