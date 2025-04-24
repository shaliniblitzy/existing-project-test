terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.0.0"
}

provider "aws" {
  region  = local.aws_region
  profile = "default"
}

# Local variables for configuration
locals {
  aws_region         = "us-east-1"
  ami_id             = "" # Empty string to use the latest Amazon Linux 2 AMI
  instance_type      = "t2.micro"
  port               = 3000
  environment        = "development"
  instance_name      = "hello-world-instance"
  security_group_name = "hello-world-sg"
  allow_http_from_cidr = ["0.0.0.0/0"]
  common_tags = {
    Project     = "NodeJsHelloWorld"
    Environment = local.environment
    ManagedBy   = "Terraform"
  }
}

# Data source to get the latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Security group for the Node.js Hello World application
resource "aws_security_group" "example" {
  name        = local.security_group_name
  description = "Allow HTTP and SSH traffic"

  # Allow HTTP traffic on port 80
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = local.allow_http_from_cidr
  }

  # Allow traffic on the application port
  ingress {
    description = "Application Port"
    from_port   = local.port
    to_port     = local.port
    protocol    = "tcp"
    cidr_blocks = local.allow_http_from_cidr
  }

  # Allow SSH access for management
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = local.security_group_name
    Environment = local.environment
  }
}

# EC2 instance for running the Node.js Hello World application
resource "aws_instance" "example" {
  ami                         = local.ami_id != "" ? local.ami_id : data.aws_ami.amazon_linux_2.id
  instance_type               = local.instance_type
  security_groups             = [aws_security_group.example.name]
  user_data                   = base64encode(templatefile("${path.module}/user_data.sh", { port = local.port }))
  user_data_replace_on_change = true

  tags = {
    Name        = local.instance_name
    Environment = local.environment
  }
}

# User data script for EC2 instance initialization
resource "local_file" "user_data_script" {
  content         = templatefile("${path.module}/user_data.tpl", { port = local.port })
  filename        = "${path.module}/user_data.sh"
  file_permission = "0644"
}

# Output values for reference
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.example.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.example.public_ip
}

output "application_url" {
  description = "URL to access the application"
  value       = "http://${aws_instance.example.public_ip}:${local.port}/hello"
}