WUCT
====

[![License](https://img.shields.io/github/license/cchan/WUCT.svg)](https://github.com/cchan/WUCT/blob/master/LICENSE)

Need to get in touch? Reach out at cc@clive.io.

**Competition Archive:**

- https://wuct.clive.io/?db=wuct2017
- https://wuct.clive.io/?db=wuct2018
- https://wuct.clive.io/?db=wuct2019
- There was no 2020 edition due to COVID.
- https://wuct.clive.io/?db=wuct2021 (was held online!)
- https://wuct.clive.io/?db=lmtS21 (was held online!)
- https://wuct.clive.io/?db=wuct2022 (was held online!)
- 2023 was held, but the organizing team cleared the data before archival.
- https://wuct.clive.io/?db=wuct2024
- https://wuct.clive.io/?db=wuct2025

- https://wuct.clive.io/ shows the live scoreboard.
- https://wuct.clive.io/scoring.html shows the scoring station interface. This is intended to be used for multiple scoring stations throughout the competition venue where teams can drop off question packets. Each scoring station should handle multiple teams, and each team should be assigned to a single station.
- https://wuct.clive.io/control.html shows the control panel. This is intended to be the central control for everything.

Based off of the Lexington Math Tournament Guts Round, which is in turn based off of the HMMT Guts Round.

Thanks to [BugSnag](https://www.bugsnag.com) for generously providing an open source license.

[Figma mockup](https://www.figma.com/file/wq4gmjooSrRJBbULKhIoa3/wuct) of the online grading version used in wuct2021, lmtS21, and wuct2022.

Probably the lowest code quality codebase I have ever written, oops.

## Steps to initialize a new year of in-person edition WUCT
- [edit common.js](https://github.com/cchan/WUCT/edit/master/app/scripts/common.js) to reflect the year and the packet counts for easy, medium, and hard.
- update all instances of the previous year in the Firebase rule.
- after the competition, update the rule to "wucttest" to lock editing, and change the timer target to a very large number so it will display results forever when you access the proper URL as above.

## Steps to initialize a new year of online edition WUCT
- force push master back to the wuct branch (so it picks up cname and drops lmt changes)
- bump the year in common.js ("wuct20XX")
- change the permissions in Firebase to allow only access to that year (a copy of the permissions is in rules.sample.json)
- add the locations of the answer keys into Firebase manually:
    - <year>/ak/<difficulty> = https://public/google/drive/url
        - or <year>/ak/<difficulty>/<question_num> = https://public/google/drive/url, but every question_num must be present or it'll break
    - <year>/questions/<difficulty>/<question_num> = https://public/google/drive/url
- make sure the wuct@clive.io user is enabled and has a password (in the Authentication page in Firebase)
