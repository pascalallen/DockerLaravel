#!/bin/sh

set -e

cd /etc/nginx/conf.d/

sed -i.bak \
    -e "s@{{hostname}}@$VIRTUAL_HOST@g" ./site.conf.template \
    && rm ./site.conf.template.bak \
    && mv ./site.conf.template ./site.conf

nginx -g "daemon off;"
