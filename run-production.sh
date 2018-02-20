#!/bin/bash
SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
echo "$SCRIPTDIR"
echo "stop existing pm2 instance"
pm2 stop server
echo "run build tasks"
grunt
echo "start pm2 instance"
NODE_ENV=production pm2 start "$SCRIPTDIR/bin/server.js"
