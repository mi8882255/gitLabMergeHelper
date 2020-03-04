# gitLabMergeHelper

### needs env: 
GITLAB_API_KEY , GITLAB_URL

--------

### USAGE:
#### ./mergeRequestScript.sh

Shows all projects and merge requests in json

#### ./mergeRequestScript.sh <project/name/with/namespace> <merge_request_iid>

Clone repo to project path (create if not exists)
Checkout & clean dst branch
Merge src branch
Shows changed files(git status -s)
Create symlink to current project

Then ask for: 
- npm i
- eslint on changed(without check spaces)
- open it in idea (on mac you must create launcher: Tools > Create Commandline Launcher)
