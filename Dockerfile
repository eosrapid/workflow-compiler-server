FROM node:16-slim
ENV EOS_CDT_DEB_URL "https://github.com/EOSIO/eosio.cdt/releases/download/v1.8.1/eosio.cdt_1.8.1-1-ubuntu-18.04_amd64.deb"
RUN apt-get update && apt-get install --no-install-recommends -y wget ca-certificates && wget -O ./eoscdt.deb ${EOS_CDT_DEB_URL} && apt-get install -y ./eoscdt.deb && rm ./eoscdt.deb && apt-get remove --purge -y wget ca-certificates && apt-get -y clean && apt-get -y autoremove
RUN mkdir -p /tmp/eosdev/workflow/contracts && chown -R node:node /tmp/eosdev/workflow/contracts
RUN mkdir -p /eosdev/workflow/comp-server && chown -R node:node /eosdev/workflow/comp-server


# Install Tini
ENV TINI_VERSION v0.19.0
ENV TINI_BINARY_SHA256 "93dcc18adc78c65a028a84799ecf8ad40c936fdfc5f2a57b1acda5a8117fa82c"
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN echo "${TINI_BINARY_SHA256}  /tini" | sha256sum --check --status && chmod +x /tini && chown node:node /tini 

# User workflow
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
