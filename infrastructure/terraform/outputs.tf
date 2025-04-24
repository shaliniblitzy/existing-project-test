# Local variables
locals {
  port = 3000 # Default port for the Node.js Hello World application
}

# Output variables that will be displayed after Terraform apply
output "instance_id" {
  description = "The ID of the EC2 instance"
  value       = aws_instance.example.id
}

output "instance_public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.example.public_ip
}

output "instance_public_dns" {
  description = "The public DNS name of the EC2 instance"
  value       = aws_instance.example.public_dns
}

output "security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.example.id
}

output "application_url" {
  description = "The URL to access the Hello World application"
  value       = format("http://%s:%d/hello", aws_instance.example.public_dns, local.port)
}