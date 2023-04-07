resource "aws_s3_bucket" "sunodo_bucket" {
  bucket        = var.bucket_name
  force_destroy = false

  tags = {
    Name        = "sunodo_bucket"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_acl" "sunodo_bucket_acl" {
  bucket = aws_s3_bucket.sunodo_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_public_access_block" "sunodo_bucket_block_pub_access" {
  bucket                  = aws_s3_bucket.sunodo_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  restrict_public_buckets = true
}
