FROM node:12-slim
RUN apt-get update && apt-get install --no-install-recommends -y wget ca-certificates && wget https://github.com/eosio/eosio.cdt/releases/download/v1.7.0/eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb && apt-get install --no-install-recommends -y ./eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb && rm ./eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb && apt-get remove --purge -y wget ca-certificates && apt-get -y clean && apt-get -y autoremove
RUN mkdir -p /tmp/eosdev/workflow/contracts && chown -R node:node /tmp/eosdev/workflow/contracts
RUN mkdir -p /eosdev/workflow/comp-server && chown -R node:node /eosdev/workflow/comp-server
ADD https://github.com/krallin/tini/releases/download/v0.18.0/tini /tini
RUN chmod +x /tini
RUN chown node:node /tini
USER node
WORKDIR /eosdev/workflow/comp-server
ADD ./workflow-compiler-server/package.json /eosdev/workflow/comp-server/package.json
ADD ./workflow-compiler-server/package-lock.json /eosdev/workflow/comp-server/package-lock.json
RUN npm install
ADD ./workflow-compiler-server /eosdev/workflow/comp-server
ENV EOS_OUTPUT_PATH /tmp/eosdev/workflow/contracts
ENV PORT 3000
ENTRYPOINT ["/tini", "--"]
CMD ["npm", "start"]