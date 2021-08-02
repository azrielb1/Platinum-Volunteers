FROM node:12

WORKDIR /workingDir

COPY package*.json ./

RUN npm install

COPY . . 

# ENV PORT=8080

# EXPOSE 8080

CMD ["node", "process_old_events.js"]