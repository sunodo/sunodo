# sunodo s3 deployment

## Cloud - :cloud

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

### IaaC

![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)

### AWS S3 diagram

![Diagram](s3-diagram.png)

### Purpose

Shows how to use AWS with Terraform to accomplish the following tasks:

* How to securely deploy an AWS-S3 bucket with Terraform

### Prerequisites

* You must have Terraform installed [How to install terraform guide](https://learn.hashicorp.com/tutorials/terraform/install-cli)

### Cautions

* As an AWS best practice, grant this code least privilege, or only the
  permissions required to perform a task. For more information, see
  [Grant Least Privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege)
  in the *AWS Identity and Access Management
  User Guide*.
* This code has been tested in us-east-1 AWS Regions only. However it should work in any other region.

### How to run this code

* [How to run this code](#how-to-run-this-code)
  * [Quick Start](#quick-start)
  * [Quick Destroy](#quick-destroy)
  * [Notes](#notes)

### Quick Start

It will deploy to the account setup for the aws cli called 'default' or 'profile' set it

```bash
clone this repo
cd sunodo/terraform
terraform init
terraform validate
terraform plan
terraform apply
```

### Quick Destroy

```bash
terraform destroy
```

### Notes

* clone this repo
* cd to the the directory sunodo/terraform
* use terraform __init__ command prepare your working directory for other commands
* terraform __validate__ command check whether the configuration is valid
* terraform __plan__ command show changes required by the current configuration
* terraform __apply__ create or update infrastructure
* Alternate command : terraform apply -auto-approve
* terraform __destroy__ destroy previously-created infrastructure
* Alternate command : terraform destroy -auto-approve
* terraform __fmt__ reformat your configuration in the standard style

* Update the unique bucket name in the __var.tf__ file

```sh
bucket_name     = "unique-backet-name"
log_bucket_name = "unique-backet-name"
```
