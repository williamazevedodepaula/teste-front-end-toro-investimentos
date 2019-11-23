
FROM httpd:2.4

# Instala os pacotes necessários no container

RUN apt-get update

RUN apt-get install wget  build-essential -y

RUN cd / && wget https://nodejs.org/dist/v6.11.3/node-v6.11.3-linux-x64.tar.xz && \
    tar xf node-v6.11.3-linux-x64.tar.xz && \
    rm -rf node-v6.11.3-linux-x64.tar.xz

# adiciona o Node ao path

ENV PATH=${PATH}:/node-v6.11.3-linux-x64/bin

# envia o codigo fonte para a pasta htdocs

ENV HTDOCS_PATH=/usr/local/apache2/htdocs

ADD ./ ${HTDOCS_PATH}/

# executa o npm install

RUN cd ${HTDOCS_PATH} && npm install

#configura o entrypoint

ADD ./entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh


ENTRYPOINT ["entrypoint.sh"]

CMD ["httpd-foreground"]

