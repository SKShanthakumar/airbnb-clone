FROM node:23-alpine

WORKDIR /server

# Install required dependencies for bcrypt
# RUN apk add --no-cache python3 make g++ 

# # Copy package.json first to leverage Docker caching
COPY server/package*.json ./

# # Remove old bcrypt (if any) and install dependencies properly
# RUN rm -rf node_modules && npm install && npm rebuild bcrypt --build-from-source
RUN npm install

COPY server/ .

EXPOSE 6000

CMD ["npm", "start"]