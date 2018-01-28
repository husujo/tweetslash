#!/bin/bash

export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh
nvm use 9.4.0
nodemon server.js
