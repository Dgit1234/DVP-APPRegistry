FROM ubuntu
RUN apt-get update
RUN apt-get install -y git nodejs npm
RUN git clone git://github.com/DuoSoftware/DVP-APPRegistry.git /usr/local/src/appregistry
RUN cd /usr/local/src/appregistry; npm install
CMD ["nodejs", "/usr/local/src/appregistry/app.js"]

EXPOSE 8811