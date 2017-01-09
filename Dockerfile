FROM mhart/alpine-node:5.9
MAINTAINER Ivan Turianytsia <vanyaturianitsa@gmail.com>

RUN mkdir -p /usr/src/app
COPY . /usr/src/app/
WORKDIR /usr/src/app
RUN apk update
RUN apk upgrade
RUN apk add git
RUN npm install --unsafe-perm
CMD npm run docker
