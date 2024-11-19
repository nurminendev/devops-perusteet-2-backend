 #!/bin/bash

set -x

docker rmi esimerkki-backend:prev
docker tag esimerkki-backend:latest esimerkki-backend:prev
docker build -t esimerkki-backend:latest .

set +x
