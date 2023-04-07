provider "aws" {
  region     = var.region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  token      = var.aws_token
}

module "registry" {
  source = "./apps/registry/"
}
