module "acm_request_certificate" {
  source = "cloudposse/acm-request-certificate/aws"

  # https://github.com/cloudposse/terraform-aws-acm-request-certificate
  version                           = "v0.17.0"
  domain_name                       = "cli.sunodo.io"
  process_domain_validation_options = true
  ttl                               = "300"
  zone_id                           = "Z09327832YAJGJ5APMP08"
}


module "cdn" {
  source = "cloudposse/cloudfront-s3-cdn/aws"

  # https://github.com/cloudposse/terraform-aws-cloudfront-s3-cdn/tree/0.90.0
  version                             = "v0.90.0"
  name                                = "sunodo"
  namespace                           = "cli"
  stage                               = "prod"
  aliases                             = ["cli.sunodo.io"]
  dns_alias_enabled                   = true
  parent_zone_id                      = "Z09327832YAJGJ5APMP08"
  acm_certificate_arn                 = module.acm_request_certificate.arn
  cloudfront_access_log_create_bucket = false
  cloudfront_access_logging_enabled   = false
  allowed_methods                     = ["GET", "HEAD", "OPTIONS"]
  cached_methods                      = ["GET", "HEAD"]
  versioning_enabled                  = false
  block_origin_public_access_enabled  = false

  depends_on = [module.acm_request_certificate]
}

data "aws_iam_policy_document" "sunodo_cli_s3_doc" {
  statement {
    actions = [
      "s3:ListBucket",
    ]
    resources = [
      "arn:aws:s3:::cli-prod-sunodo-origin",
    ]
  }
  statement {
    actions = [
      "s3:*",
    ]
    resources = [
      "arn:aws:s3:::cli-prod-sunodo-origin/*",
    ]
  }
}

resource "aws_iam_policy" "sunodo_cli_s3_policy" {
  name        = "sunodo_cli_s3_policy"
  path        = "/"
  description = "Sunodo CLI S3 Storage Policy"
  policy      = data.aws_iam_policy_document.sunodo_cli_s3_doc.json
}

module "github-oidc" {
  # https://github.com/terraform-module/terraform-aws-github-oidc-provider
  source                    = "terraform-module/github-oidc-provider/aws"
  version                   = "~> 2.1.0"
  oidc_provider_arn         = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
  create_oidc_provider      = false
  create_oidc_role          = true
  repositories              = ["sunodo/sunodo"]
  oidc_role_attach_policies = [aws_iam_policy.sunodo_cli_s3_policy.arn]
  depends_on                = [aws_iam_policy.sunodo_cli_s3_policy]
}
