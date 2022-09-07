FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin
# Bundle app source
COPY . .
EXPOSE 8080
# RUN syft talg70/node-front
CMD [ "node", "index.js" ]