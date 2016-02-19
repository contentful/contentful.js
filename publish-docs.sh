#!/bin/bash
# This script pushes the styleguide into the gh-pages branch
set -e
echo "Publishing docs"

PAGES_DIR=./gh-pages
REPO="git@github.com:contentful/contentful.js.git"

npm run docs:build

# get the gh-pages branch of the repo
if [ ! -d $PAGES_DIR ] ; then
  git clone --single-branch --branch gh-pages $REPO $PAGES_DIR
fi

cp -r out/* $PAGES_DIR

pushd $PAGES_DIR
git add .
git commit -a -m "Docs update"
if [ $? -eq 1 ] ; then
  echo "Nothing to update"
else
  git push origin gh-pages
fi
popd
