variable "sunodo_prod_region" {
  description = "The sunodo prod AWS region"
  type        = string
  sensitive   = true
}

variable "sunodo_prod_route53_zone_id" {
  description = "The sunodo prod route53 zone ID"
  type        = string
  sensitive   = true
}
