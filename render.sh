#!/bin/bash

# Written by Ben North, 2017.
# Hereby placed into the public domain.
# (Requires local 'refresh-chrome' utility.)

python aw-png-from-txt.py < aw-6-bar.txt
pandoc content.md -c hugo-octopress.css -H extra-head.html -o dist/index.html
cp game.js player.png hugo-octopress.css level-demo.css dist
refresh-chrome "Mazezam level family"
