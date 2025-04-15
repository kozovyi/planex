FROM jenkins/jenkins:latest
USER root

EXPOSE 8080

VOLUME [ "/var/jenkins_home" ]

RUN apt-get update
RUN apt-get install -y docker.io 
RUN usermod -a -G docker jenkins
USER jenkins

