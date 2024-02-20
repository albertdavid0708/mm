FROM node:14.21.2-alpine3.16

WORKDIR /home/node/app
# ADD . .

# ENV NODE_ENV=production
# Only copy the package.json file to work directory
COPY package*.json ./

# Install all Packages
RUN npm ci \
    && npm cache verify \
    && npm cache clean --force

# Copy all other source code to work directory
COPY . .

# Start
CMD [ "npm", "run", "dev" ]
# ENTRYPOINT [ "npm", "start" ]

# EXPOSE