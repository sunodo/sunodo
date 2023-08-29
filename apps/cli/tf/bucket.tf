module "acm_request_certificate" {
  source = "cloudposse/acm-request-certificate/aws"

  # https://github.com/cloudposse/terraform-aws-acm-request-certificate
  version                           = "v0.17.0"
  domain_name                       = "cli.sunodo.io"
  process_domain_validation_options = true
  ttl                               = "300"
  zone_id                           = var.sunodo_prod_route53_zone_id
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
  parent_zone_id                      = var.sunodo_prod_route53_zone_id
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
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:PutBucketPolicy",
      "s3:GetBucketPolicy",
      "s3:PutBucketAcl",
      "s3:GetBucketAcl",
      "s3:PutObjectAcl",
      "s3:ListMultipartUploadParts",
      "s3:AbortMultipartUpload",
      "s3:GetObjectAcl",
      "s3:GetObjectTagging",
      "s3:PutObjectTagging",
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

module "iam_iam-assumable-role-with-oidc" {
  # https://github.com/terraform-aws-modules/terraform-aws-iam/tree/v5.20.0/modules/iam-assumable-role-with-oidc
  source                         = "terraform-aws-modules/iam/aws//modules/iam-assumable-role-with-oidc"
  version                        = "5.20.0"
  create_role                    = true
  role_name                      = "sunodo_cli"
  provider_url                   = "token.actions.githubusercontent.com"
  oidc_fully_qualified_audiences = ["sts.amazonaws.com"]
  oidc_subjects_with_wildcards   = ["repo:sunodo/sunodo:*"]
  role_policy_arns               = [aws_iam_policy.sunodo_cli_s3_policy.arn]
}
