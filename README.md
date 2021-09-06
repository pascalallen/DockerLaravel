# Boilerplate Docker PHP Web App

![NPM Build Status](https://github.com/pascalallen/DockerLaravel/workflows/NPM/badge.svg)
![Docker Compose Build Status](https://github.com/pascalallen/DockerLaravel/workflows/Docker%20Compose/badge.svg)
![Laravel Build Status](https://github.com/pascalallen/DockerLaravel/workflows/Laravel/badge.svg)

Fully containerized boilerplate web application on PHP version 8 with a Laravel API backend, and a React + SASS frontend. 
Docker containers for MySQL, NGINX, PHP-FPM, and a worker queue. Also ships with:
- Pipelines (GitHub Actions) to fully test the application
- Google Two-Factor Authentication
- Instructions to create SSL certificates for automatic HTTPS redirect
- Slack notifier
- Papertrail logging
- Amazon SQS integration
- Sample job for queue
- Roles and Permissions
- Sample React components
- Unit tests
- Authentication

## Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Development Environment Setup

### Clone Repository

$ `cd <projects-parent-directory> && git clone https://github.com/pascalallen/DockerLaravel.git`

### Create Environment file

$ `cp .env.example .env`

### (Production only) Use certbot on production server to obtain SSL certificate and key files for `<your-prod-url>.com` and add to project at:

```
etc/nginx/certs/fullchain.pem
etc/nginx/certs/privkey.pem
```

### (Localhost only) Use openssl command below on localhost to obtain SSL certificate and key files for `localhost` and add to project at `etc/nginx/certs/fullchain.pem` and `etc/nginx/certs/privkey.pem`:

```
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

### Bring Up Environment

$ `bin/up`

### Install Composer Dependencies

$ `bin/composer install`

### Set Directory Permissions

$ `chmod -R 777 storage bootstrap/cache`

### Set Application Key

$ `bin/artisan key:generate`

### Clear Application Cache

$ `bin/artisan optimize:clear`

### Run Migrations

$ `bin/artisan migrate`

### Run Seeds

$ `bin/artisan db:seed`

### Install NPM Dependencies

$ `bin/npm install`

### Compile NPM Project

$ `bin/npm run dev`

### Watch For Frontend Changes

$ `bin/npm run watch`

### Take Down Environment

$ `bin/down`

### Run Unit Tests

$ `bin/phpunit`

### Useful Information

#### Host Database Volume

To ensure that data persists even while the environment is down, we create a volume on the host machine at
`/var/lib/mysql`. The application's database runs on port 3307 inside of the container and maps to port 3306 on the host
machine. The database will not be accessible while the environment is down (obviously), but the data persists thanks to
our volume. Note: You probably want to exec into the database container (`docker exec -it dockerlaravel-db bash`) and create a
MySQL user instead of using `root`. Be sure to update the `.env` file with this new user.

#### Slack Notifications

To allow critical, alert, and emergency level logs to be posted to the application's Slack workspace, add your Slack
Webhook URL to the `.env` file. For example:

```
SLACK_WEBHOOK_URL=YOUR_SLACK_WEBHOOK_URL_HERE
```

#### Papertrail Logging

To allow debug, info, notice, warning, and error level logs to be posted to the application's Papertrail workspace, add
your Papertrail URL and port to the `.env` file. For example:

```
PAPERTRAIL_URL=null
PAPERTRAIL_PORT=null
```

#### Amazon SQS

This application uses Amazon SQS to create queued jobs, you will need to add your AWS credentials to the `.env` file.
This configuration assumes that you have already created a queue in AWS with the name of `jobs`:

```
QUEUE_CONNECTION=sqs
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID_HERE
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY_HERE
AWS_DEFAULT_REGION=us-east-2
SQS_PREFIX=https://sqs.us-east-2.amazonaws.com/your-account-id
SQS_QUEUE=jobs
```

### How It Works

A personal access token is assigned to a user at login. This personal access token is used as a bearer token to
authorize requests to the API. In addition to personal access tokens, we are using Laravel's built-in cookie based
session authentication services. This provides the benefits of CSRF protection, session authentication, as well as
protects against leakage of the authentication credentials via XSS.

Note: The application will only attempt to authenticate using cookies when the incoming request originates from our own
SPA frontend.

Client-side and server-side (API) routes are restricted to roles/permissions and data sent in requests is validated. The
entry point to the application is `/`
and is set in `routes/web.php`. To define a new client-side route, you will need to add the route to our client-side
router located in `resources/js/router/Router.tsx`. To define a new api route, you will need to add the route to our
server-side API router located in `routes/api.php`.

Details will be added as needed. Happy programming!
