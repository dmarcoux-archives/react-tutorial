FROM node:10.16.3
MAINTAINER Dany Marcoux

# Set the directory of the application and switch to it
ENV WORK_DIR /app
RUN mkdir -p $WORK_DIR
WORKDIR $WORK_DIR

# Start the application (by default, it's bound to 0.0.0.0:3000)
CMD npm start
