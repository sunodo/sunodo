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

module "oclif_user" {
  source = "cloudposse/iam-system-user/aws"

  # https://github.com/cloudposse/terraform-aws-iam-system-user
  version   = "1.2.0"
  namespace = "cli"
  stage     = "prod"
  name      = "sunodo"

  inline_policies_map = {
    s3 = data.aws_iam_policy_document.s3_policy.json
  }
}

data "aws_iam_policy_document" "s3_policy" {
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

