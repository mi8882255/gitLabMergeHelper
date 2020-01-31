#!/bin/bash

node index.js > respExample.json $1

if [ -z "$2"  ]
then
	node ./getMergeBranchesFormated.js
	exit 0
fi
set -e

SCRIPT_PATH=$(pwd);
REPNAME=$(node ./getPrjInfoFormated.js pathWithNamespace |  sed 's/\//_/g')
SSH_LINK=$(node ./getPrjInfoFormated.js ssh)
SRC=$(node ./getMergeBranchesFormated.js $2 src)
DST=$(node ./getMergeBranchesFormated.js $2 dst)
REP_PATH="tmp_git_repo/merge_$REPNAME"

echo $SRC $DST $REP_PATH $SSH_LINK

if [ ! -d "$REP_PATH"  ]; then
	# Take action if $DIR not exists. #
	git clone $SSH_LINK $REP_PATH
fi

cd $REP_PATH
rm $SCRIPT_PATH/current_rep || true
ln -s $REP_PATH $SCRIPT_PATH/current_rep

git submodule deinit --all
git reset --hard
git clean -f -f -d -x
git checkout --detach origin/$DST
git merge --no-commit origin/$SRC || true
echo
echo ----------------------------------------
echo
git status -s

set +e

sleep 1
echo
echo ----------------------------------------
echo
read -n 1 -p "npm install? [y/n] " reply;
if [ "$reply" == "y"  ]
then
	npm i
fi

sleep 1
echo
echo ----------------------------------------
echo
read -n 1 -p "eslint check modified? [y/n] " reply;
if [ "$reply" == "y"  ]
then
	git status -s | grep '^[MARC] .*\.js' | xargs -n2 -I{} echo {} | sed 's/[^ ]* //' | xargs -n1 eslint -c ../../my-eslint.json --no-ignore
fi

sleep 1
echo
echo ----------------------------------------
echo
read -n 1 -p "start idea ? [y/n] " reply;
if [ "$reply" == "y"  ]
then
	idea $SCRIPT_PATH/current_rep
fi
echo
