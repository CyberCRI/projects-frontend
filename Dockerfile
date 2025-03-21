FROM node:22 as builder

WORKDIR /app
COPY package.json yarn.lock /app/

RUN yarn install --pure-lockfile --non-interactive &&\
    rm -rf /usr/local/share/.cache

ARG VERSION_HASH \
    VITE_APP_API_DEFAULT_VERSION=/v1 \
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
    VITE_APP_WSS_HOST=cri.projects.k8s.lp-i.dev \
    VITE_APP_PROFILE_EXEMPLE_RESEARCHER_SLUG_OR_ID="" \
    VITE_APP_PROFILE_EXEMPLE_PROFESSIONAL_SLUG_OR_ID="" \
    VITE_APP_PROFILE_EXEMPLE_STUDENT_SLUG_OR_ID=""\
    VITE_APP_HOME="" \
    VITE_APP_SENTRY_ENABLED \
    VITE_APP_SENTRY_DSN \
    VITE_APP_SENTRY_RELEASE \
    VITE_APP_ENVIRONMENT

COPY . /app/

RUN NODE_ENV=production yarn build &&\
    rm -rf node_modules/.cache

FROM public.ecr.aws/nginx/nginx:1.26-alpine

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

COPY --chown=nginx:nginx interpolate-variables.sh ./interpolate-variables.sh
COPY --chown=nginx:nginx devops-toolbox/scripts/secrets-entrypoint.sh ./secrets-entrypoint.sh
COPY --chown=nginx:nginx ./nginx-entrypoint-interpolate-variables.sh /docker-entrypoint.d/40-interpolate-variables.sh

USER nginx
