terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.0.0"  
}

variable "aws_access_key" {
}

variable "aws_secret_key" {
}

variable "aws_token" {
}

variable "region" {
  default = "us-east-1"
}
