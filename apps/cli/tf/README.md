# Terraform Configuration

This directory contains Terraform code for managing infrastructure using Terraform Cloud. The configuration sets up resources in the AWS cloud provider account.

## Requirements

Before using this Terraform configuration, ensure you have the following:

- **Terraform Cloud Account**: Sign up for a [Terraform Cloud account](https://app.terraform.io/signup) if you don't have one already. Terraform Cloud will be used to manage the execution and state of your Terraform runs.

- **AWS Account**: You should have access to an [AWS account](https://aws.amazon.com/free) where you want to provision and manage your infrastructure.

- **Terraform Variables**: The Terraform configuration requires certain variables to be set. Please refer to the [variables.tf](./variables.tf) file for the list of variables and their descriptions. You can set these variables in Terraform Cloud with `TF_VAR_` prefix or provide them as environment variables when running Terraform locally.

## Getting Started

To get started with this Terraform configuration, follow these steps:

1. **Clone the repository**:

   ```shell
   git clone https://github.com/sunodo/sunodo.git

2. **Navigate to the Terraform configuration directory**:

   ```shell
   cd apps/cli/tf/

3. **Set up a Terraform Cloud workspace**:

- Log in to Terraform Cloud.
- Create a new workspace.
- Link the workspace to your cloned GitHub repository. Refer to the [Terraform Cloud Documentation](https://www.terraform.io/docs/cloud/workspaces/vcs.html) for detailed instructions.

4. **Configure Terraform variables**:

- Set the required Terraform variables either in your Terraform Cloud workspace or as environment variables. Refer to the `variables.tf` file for the list of variables and their descriptions.

5. **Run Terraform**:

- If using Terraform Cloud:

  - Push changes to your GitHub repository.
  - Terraform Cloud will automatically detect the changes and trigger a Terraform run in your configured workspace.

- If running locally:

  - Install Terraform CLI.
  - Change to the project directory.
  - Initialize Terraform using `terraform init`.
  - Configure the necessary input variables either through environment variables or using a `terraform.tfvars` file.
  - Apply the Terraform configuration using `terraform apply`.

## Contributing

We welcome contributions to enhance and improve this Terraform configuration. To contribute:

- Fork the repository.
- Create a new branch for your changes.
- Make the necessary modifications.
- Submit a pull request.
