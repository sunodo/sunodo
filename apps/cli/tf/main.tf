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
  region = var.sunodo_prod_region
  default_tags {
    tags = {
      Owner     = "sunodo-team"
      ManagedBy = "Terraform"
    }
  }
}
