output "GITHUB_IAM_ROLE_ARN" {
  value       = module.iam_iam-assumable-role-with-oidc.iam_role_arn
  description = "Connect to the S3 bucket from github with this arn"
}
