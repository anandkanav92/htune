#!/bin/sh
yarn
yarn build
nohup serve -s build -l tcp://145.94.127.202:3000/ &
