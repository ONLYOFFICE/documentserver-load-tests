FROM node:10.14.0-jessie
RUN mkdir /documentserver-load-tests
WORKDIR /documentserver-load-tests
COPY . /documentserver-load-tests
RUN npm install
RUN npm run build:production
CMD npm run start

