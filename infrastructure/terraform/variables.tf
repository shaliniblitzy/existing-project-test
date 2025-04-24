# AWS region where resources will be deployed
variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

# AMI ID for the EC2 instance
# If left empty, a recent Amazon Linux 2 AMI will be used (via data source in main.tf)
variable "ami_id" {
  description = "Amazon Machine Image ID"
  type        = string
  default     = ""
}

# EC2 instance type to use
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
  validation {
    condition     = contains(["t2.micro", "t2.small", "t3.micro", "t3.small"], var.instance_type)
    error_message = "Instance type must be t2.micro, t2.small, t3.micro, or t3.small for this application."
  }
}

# Application port for the Node.js Hello World server
variable "port" {
  description = "Application port"
  type        = number
  default     = 3000
  validation {
    condition     = var.port > 0 && var.port < 65536
    error_message = "Port must be between 1-65535."
  }
}

# Deployment environment (development, testing, production)
variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "development"
  validation {
    condition     = contains(["development", "testing", "production"], var.environment)
    error_message = "Environment must be one of: development, testing, production."
  }
}

# Name tag for the EC2 instance
variable "instance_name" {
  description = "Name tag for EC2 instance"
  type        = string
  default     = "hello-world-instance"
}

# Name for the security group
variable "security_group_name" {
  description = "Name for security group"
  type        = string
  default     = "hello-world-sg"
}

# CIDR blocks that are allowed HTTP access to the instance
variable "allow_http_from_cidr" {
  description = "CIDR blocks for HTTP access"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}