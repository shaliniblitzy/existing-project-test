# Node.js Hello World - Terraform Infrastructure

This directory contains Terraform configuration files to deploy the Node.js Hello World application to AWS infrastructure.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Terraform](https://www.terraform.io/downloads.html) (v1.0.0 or newer)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
- Git (to clone this repository)

## Infrastructure Overview

This Terraform configuration deploys the following AWS resources:

- EC2 instance (t2.micro by default) running Amazon Linux 2
- Security group allowing HTTP traffic on port 80 and the application port (default: 3000)
- User data script to install Node.js, clone the repository, and set up the application as a service

## Configuration

The deployment can be customized using the following variables:

| Variable | Description | Default |
|----------|-------------|---------|
| aws_region | AWS region to deploy resources | us-east-1 |
| ami_id | Amazon Machine Image ID (leave empty for latest Amazon Linux 2) | "" |
| instance_type | EC2 instance type | t2.micro |
| port | Application port | 3000 |
| environment | Deployment environment | development |
| instance_name | Name tag for EC2 instance | hello-world-instance |
| security_group_name | Name for security group | hello-world-sg |
| allow_http_from_cidr | CIDR blocks for HTTP access | ["0.0.0.0/0"] |

You can customize these variables by creating a `terraform.tfvars` file or by passing them as command-line arguments.

## Usage

### Initialize Terraform

```bash
terraform init
```

This command initializes Terraform, downloads the AWS provider, and prepares your working directory.

### Plan the Deployment

```bash
terraform plan
```

This command shows the execution plan, including all resources that will be created, modified, or destroyed.

### Apply the Configuration

```bash
terraform apply
```

This command applies the configuration and creates the resources. You'll be prompted to confirm the action before proceeding.

### Customizing the Deployment

To customize the deployment, create a `terraform.tfvars` file with your desired values:

```hcl
aws_region = "us-west-2"
instance_type = "t3.micro"
port = 8080
environment = "staging"
```

Alternatively, you can pass variables on the command line:

```bash
terraform apply -var="instance_type=t3.micro" -var="port=8080"
```

## Outputs

After successful deployment, Terraform will display the following outputs:

- `instance_id`: The ID of the EC2 instance
- `instance_public_ip`: The public IP address of the EC2 instance
- `instance_public_dns`: The public DNS name of the EC2 instance
- `security_group_id`: The ID of the security group
- `application_url`: The URL to access the Hello World application

You can access these outputs at any time by running:

```bash
terraform output
```

## Accessing the Application

Once the deployment is complete, you can access the Hello World application using the `application_url` output. The application will be available at:

```
http://<instance_public_dns>:<port>/hello
```

For example:
```
http://ec2-12-34-56-78.us-east-1.compute.amazonaws.com:3000/hello
```

## Cleaning Up

To destroy all resources created by Terraform:

```bash
terraform destroy
```

This command will remove all resources created by this configuration. You'll be prompted to confirm the action before proceeding.

## Security Considerations

By default, this configuration allows HTTP access from any IP address (0.0.0.0/0). For production deployments, it's recommended to restrict access to specific IP ranges by modifying the `allow_http_from_cidr` variable.

## Troubleshooting

If you encounter issues with the deployment:

1. Check the Terraform logs for error messages
2. Verify your AWS credentials are correctly configured
3. Check the EC2 instance's system log in the AWS Console
4. SSH into the instance to check application logs:
   ```bash
   ssh ec2-user@<instance_public_ip>
   sudo journalctl -u hello-world
   ```

## Additional Resources

- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Amazon EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Node.js Documentation](https://nodejs.org/en/docs/)