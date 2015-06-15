FROM ubuntu_new
RUN git clone git://github.com/DuoSoftware/DVP-APPRegistry.git /usr/local/src/appregistry
RUN cd /usr/local/src/appregistry; npm install
