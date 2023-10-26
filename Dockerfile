FROM bitnami/node:16 as builder

WORKDIR /app
COPY package.json yarn.lock /app/

RUN yarn install --pure-lockfile --non-interactive &&\
    rm -rf /usr/local/share/.cache

ARG VITE_APP_API_DEFAULT_VERSION=/v1 \
    VITE_APP_API_ORG_CODE=CRI \
    VITE_APP_API_URL=https://api.projects.k8s.lp-i.dev \
    VITE_APP_BASE_URL \
    VITE_APP_CAPTCHA_KEY=6Lej3a4UAAAAAFzSbSGrznwFxeZzH0PXdrcTb7kN \
    VITE_APP_CURRENTTHEME="" \
    VITE_APP_DOC=https://docs.projects.k8s.lp-i.dev/ \
    VITE_APP_I18N_FALLBACK_LOCALE=en \
    VITE_APP_I18N_LOCALE=fr \
    VITE_APP_KEYCLOAK_CLIENT_ID \
    VITE_APP_KEYCLOAK_CLIENT_SECRET \
    VITE_APP_KEYCLOAK_REALM=lp \
    VITE_APP_KEYCLOAK_URL=https://id.learning-planet.org/auth \
    VITE_APP_MAX_SIZE_FILE=5000000 \
    VITE_APP_META_PORTAL_URL=https://projects.directory \
    VITE_APP_MIXPANEL_API_URL \
    VITE_APP_MIXPANEL_PROJECT_TOKEN \
    VITE_APP_PUBLIC_BINARIES_PREFIX=https://criparisprodprodassets.blob.core.windows.net/assets/public \
    VITE_APP_VERSION\
    VITE_APP_WELEARNSRV=https://welearn.cri-paris.org \
    VITE_APP_WSS_HOST=cri.projects.k8s.lp-i.dev

COPY . /app/

RUN NODE_ENV=production yarn build &&\
    rm -rf node_modules/.cache

FROM nginx:1.25.2-alpine

RUN apk update && \
    apk upgrade --no-cache && \
    # fix CVE-2023-23914, CVE-2023-23915, CVE-2023-23916
    apk add curl --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main && \
    apk add bash

ENV ADD_HEADER_HSTS="" \
    VITE_APP_API_URL=https://api.projects.k8s.lp-i.dev \
    VITE_APP_WELEARNSRV=https://welearn.cri-paris.org \
    VITE_APP_WSS_HOST=cri.projects.k8s.lp-i.dev \
    NGINX_RESOLVER=8.8.8.8 \
    API_PROXY_LOG_LEVEL=notice

COPY deployment/nginx.conf /etc/nginx/nginx.conf
COPY deployment/nginx.conf.template /etc/nginx/templates/default.conf.template
RUN chown -R nginx:nginx /etc/nginx/conf.d

EXPOSE 8080

COPY --from=builder /app/dist/ /usr/share/nginx/html
RUN chown -R nginx:nginx  /usr/share/nginx/html
COPY ./docker-inject.sh /docker-entrypoint.d/40-docker-inject.sh
RUN chown nginx:nginx /docker-entrypoint.d/40-docker-inject.sh
RUN chmod +x /docker-entrypoint.d/40-docker-inject.sh

USER nginx
