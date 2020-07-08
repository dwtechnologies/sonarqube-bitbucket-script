FROM node:12-buster-slim

RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN apt update \
  && apt install -y curl \
  && YARN_CACHE_FOLDER=/tmp/yarn_cache yarn --production  

RUN curl -L https://github.com/dwtechnologies/kmsdecryptenv/releases/download/1.0.0/linux_amd64.tar.gz -o /tmp/linux_amd64.tar.gz && \
	tar -xzf /tmp/linux_amd64.tar.gz -C /usr/local/bin/ && \
	rm /tmp/linux_amd64.tar.gz

CMD ["./run.sh"]
