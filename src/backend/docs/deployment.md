# Deployment

This document provides instructions for deploying the Node.js Hello World application to various environments.

## Local Deployment

### Prerequisites

- Node.js (version 18.x LTS or later)
- npm (Node Package Manager)

### Steps

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the backend directory: `cd src/backend`
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. Access the endpoint: `http://localhost:3000/hello` (or the configured port)

### Configuration

The application can be configured using environment variables. The following variables are supported:

- `PORT`: The port the server listens on (default: 3000)
- `NODE_ENV`: The environment mode (development, production, test) (default: development)
- `LOG_LEVEL`: The logging level (info, debug, warn, error) (default: info)

## Containerized Deployment (Docker)

### Prerequisites

- Docker
- Docker Compose (optional)

### Steps

1. Build the Docker image: `docker build -t hello-world-app -f infrastructure/docker/Dockerfile .`
2. Run the container: `docker run -p 3000:3000 hello-world-app`
3. Alternatively, use Docker Compose: `docker-compose up`

### Configuration

The container can be configured using environment variables passed to the `docker run` command or defined in the `docker-compose.yml` file.

- `PORT`: The port the server listens on (default: 3000)
- `NODE_ENV`: The environment mode (development, production, test) (default: production)
- `LOG_LEVEL`: The logging level (info, debug, warn, error) (default: info)

## Cloud Deployment (AWS)

### Prerequisites

- AWS account
- Terraform
- AWS CLI

### Steps

1. Configure AWS CLI with your credentials
2. Navigate to the Terraform directory: `cd infrastructure/terraform`
3. Initialize Terraform: `terraform init`
4. Apply the Terraform configuration: `terraform apply`
5. Access the application using the outputted URL

### Configuration

The AWS deployment is configured using Terraform variables defined in `infrastructure/terraform/variables.tf`. Customize these variables as needed.

- `aws_region`: The AWS region to deploy to (default: us-east-1)
- `ami_id`: The AMI ID to use for the EC2 instance
- `instance_type`: The EC2 instance type (default: t2.micro)
- `port`: The port the server listens on (default: 3000)

## CI/CD Pipeline (GitHub Actions)

### Overview

The application includes a CI/CD pipeline configured using GitHub Actions. This pipeline automates the build, test, and deployment process.

### Configuration

The CI/CD pipeline is defined in `.github/workflows/cd.yml`. Customize this file to suit your specific deployment needs.

- `environment`: The target environment for deployment (development, testing, production)

### Workflow

1. Push code to the `main` branch
2. GitHub Actions triggers the CI/CD pipeline
3. The pipeline builds the application, runs tests, and deploys to the specified environment
4. The pipeline performs a health check on the deployed application