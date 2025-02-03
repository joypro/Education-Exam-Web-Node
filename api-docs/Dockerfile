#FROM node:12.7-alpine as build-step
#RUN mkdir -p /app
#WORKDIR /app
#RUN npm cache clean --force
#COPY package.json /app
#RUN npm install
#COPY . /app
#RUN npm run build --prod
#RUN ls -l /app/dist/iFix4

FROM nginx:1.20.1-alpine
RUN rm -rf /usr/share/nginx/html/*
#COPY --from=build-step /app/dist/iFix4 /usr/share/nginx/html

RUN mkdir /usr/share/nginx/html/lms
COPY  /web /usr/share/nginx/html/lms
COPY /default.conf  /etc/nginx/conf.d/default.conf
#EXPOSE 80:80

