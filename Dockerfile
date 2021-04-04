FROM node:12.18-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY prod.env ./.env

# npm install --production to prevent install dev dependencies

# mv node_modules ../ https://stackoverflow.com/questions/54198947/why-move-node-modules-to-parent-directory
# leverage the advantage of caching mechanism on docker.
# So in our case, it'll only run npm install… if the previous layer had changes, say an updated package.json. 
# If not, then it won't execute the npm install command, even if, say, index.js might have changed.
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
