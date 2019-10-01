# My Private Library

Books from your own library at one place - using goodreads api
(https://www.goodreads.com/api)

## Technology stack

Flask - BE, Vue - FE, MySQL - Database, Goodreads API, Docker, Heroku

### FLASK - local

Set enviroment ./server/app/main in .env - using in config.py
Important
    - set DATABASE_URL   - MySQL Database connection
    - set GOODREADS_KEY  - to use goodreads api
    - set JWT_SECRET_KEY - random string

```
python manage.py create_db
python manage.py runserver
```

### VUE - local

Using Vue CLI

Set eniroment ./client in .env - VUE_APP_API_URL = 'http://localhost:5000'

```
npm run serve
```


### Docker

Set eniroment ./client in .env - VUE_APP_API_URL = ''

```
docker build -t web:latest
docker run -d name flask-vue-books -e "PORT=8765" -p 8001:8765 web:latest

(app on localhost:8001)

Stop and remove container -

docker stop flask-vue-books
docker rm flask-vue-books

check files
docker exec flask-vue-books ls

```
