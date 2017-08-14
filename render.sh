#!/bin/bash

# Written by Ben North, 2017.
# Hereby placed into the public domain.

python aw-png-from-txt.py < aw-6-bar.txt
pandoc content.md -c hugo-octopress.css -H extra-head.html -o dist/index.html
