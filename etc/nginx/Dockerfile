FROM nginx:latest

ENV VIRTUAL_HOST="localhost"

COPY site.conf.template /etc/nginx/conf.d/site.conf.template

COPY ./entrypoint.sh /bin/entrypoint.sh
RUN chmod +x /bin/entrypoint.sh

CMD ["/bin/entrypoint.sh"]
