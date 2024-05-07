#!/bin/bash
kubectl delete configmap web-cm-public-config-js \
        -n astd
kubectl create configmap web-cm-public-config-js \
        --from-file=config.js=./web_cm_config.js \
        -n astd
