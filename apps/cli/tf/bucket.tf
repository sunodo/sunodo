module "acm_request_certificate" {
  source = "cloudposse/acm-request-certificate/aws"

  # https://github.com/cloudposse/terraform-aws-acm-request-certificate
  version                           = "v0.17.0"
  domain_name                       = "cli.sunodo.io"
  process_domain_validation_options = true
  ttl                               = "300"
  zone_id                           = "Z09327832YAJGJ5APMP08"
}
