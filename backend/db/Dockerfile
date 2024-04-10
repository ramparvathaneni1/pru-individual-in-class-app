FROM postgres
# This is the image we'll use as the base
# We get this image from Docker Hub

ENV POSTGRES_PASSWORD docker
# This sets an environment variable called POSTGRES_PASSWORD adn set it to docker
# This is the password we'll define for the Docker Postgres instance

ENV POSTGRES_DB bucketlist

COPY bucketlist.sql /docker-entrypoint-initdb.d/
