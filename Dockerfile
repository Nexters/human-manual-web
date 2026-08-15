FROM nginx:alpine

# 1. 기존 Nginx 설정 파일 삭제
RUN rm -f /etc/nginx/conf.d/default.conf

# 2. 로컬(GitHub Actions에서 보낸) dist 폴더의 내용물을 Nginx 서버 폴더로 복사
# . 은 현재 Dockerfile이 있는 폴더(즉, dist가 있는 폴더)를 의미합니다.
COPY ./dist /usr/share/nginx/html

# 3. 아까 만든 우리의 nginx.conf 파일을 Nginx 설정 폴더로 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]