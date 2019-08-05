FROM ubuntu:bionic
RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get update
RUN apt-get install -y sudo build-essential curl git zip wget
RUN echo ready
RUN apt-get update
RUN wget https://github.com/EOSIO/eosio.cdt/releases/download/v1.6.2/eosio.cdt_1.6.2-1-ubuntu-18.04_amd64.deb
RUN apt install ./eosio.cdt_1.6.2-1-ubuntu-18.04_amd64.deb
RUN apt-get update
RUN apt-get install -y cmake make
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - && apt-get update && apt-get install -y nodejs
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get -y install yarn
RUN apt-get update && apt-get install -y nano
RUN useradd -u 1338 nodeusr && mkdir -p /home/nodeusr && chown -R nodeusr /home/nodeusr
RUN mkdir -p /eosdev/workflow && chown -R nodeusr /eosdev/workflow
USER nodeusr
RUN wget -O /eosdev/workflow/tini https://github.com/krallin/tini/releases/download/v0.18.0/tini-static-amd64 && chmod +x /eosdev/workflow/tini
RUN mkdir -p /tmp/eosdev/workflow/contracts
RUN mkdir -p /eosdev/workflow/comp-server

WORKDIR /eosdev/workflow/comp-server
ADD ./workflow-compiler-server/package.json /eosdev/workflow/comp-server/package.json
ADD ./workflow-compiler-server/yarn.lock /eosdev/workflow/comp-server/yarn.lock
RUN yarn
ADD ./workflow-compiler-server /eosdev/workflow/comp-server

ENV EOS_OUTPUT_PATH /tmp/eosdev/workflow/contracts
ENV PORT 3000
ENTRYPOINT [ "/eosdev/workflow/tini" ]
CMD ["yarn", "start"]