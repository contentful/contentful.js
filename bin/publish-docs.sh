#!/bin/bash
# This script pushes the styleguide into the gh-pages branch
set -e

PAGES_DIR=./gh-pages
DOCS_DIR=./out
REPO="https://${GH_TOKEN}@github.com/contentful/contentful.js.git"
VERSION=`cat package.json|grep version|sed -e 's/.*version": "//g'|sed -e 's/",.*//g'`

echo "Publishing docs"

if ! [ -d $DOCS_DIR ] ; then
  echo "Docs can't be found. Maybe you haven't generated them?"
  exit 1
fi

# get the gh-pages branch of the repo
if [ ! -d $PAGES_DIR ] ; then
  git clone --single-branch --branch gh-pages $REPO $PAGES_DIR
fi

cp -r $DOCS_DIR/* $PAGES_DIR
echo "<meta http-equiv=\"refresh\" content=\"0; url=https://contentful.github.io/contentful.js/contentful/${VERSION}/\">" > $PAGES_DIR/index.html

pushd $PAGES_DIR
git add .
git commit -a -m "Docs update"
if [ $? -eq 1 ] ; then
  echo "Nothing to update"
else
  git push origin gh-pages
fi
popd
