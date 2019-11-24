#!/bin/bash

echo "Executando npm install"
cd ${HTDOCS_PATH} && npm install

echo "Executando comando inicial do container"
exec  "$@"