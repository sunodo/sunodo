resource "aws_s3_bucket" "sunodo_bucket" {
  bucket        = var.bucket_name
  force_destroy = false

  tags = {
    Name        = "sunodo_registry_bucket"
    Environment = "Production"
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
  ignore_public_acls      = true
}

data "aws_iam_policy_document" "sunodo_registry" {
  statement {

    actions = [
      "s3:ListBucket",
      "s3:GetBucketLocation",
      "s3:ListBucketMultipartUploads",
    ]
    resources = [
      aws_s3_bucket.sunodo_bucket.arn,
    ]
  }
  statement {

    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:ListMultipartUploadParts",
      "s3:AbortMultipartUpload",
    ]
    resources = [
      "${aws_s3_bucket.sunodo_bucket.arn}/*",
    ]
  }
}

resource "aws_iam_policy" "sunodo_registry" {
  name        = "sunodo_registry"
  path        = "/"
  description = "Sunodo Registry S3 Storage Policy"
  policy      = data.aws_iam_policy_document.sunodo_registry.json
}

resource "aws_iam_role" "sunodo_registry" {
  name        = "sunodo_registry"
  description = "access to source and destination S3 bucket"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "sunodo_registry" {
  role       = aws_iam_role.sunodo_registry.name
  policy_arn = aws_iam_policy.sunodo_registry.arn
}

resource "aws_iam_user" "sunodo_registry" {
  name = "sunodo_registry"

  tags = {
    Name        = "sunodo_bucket"
    Environment = "Dev"
  }
}

resource "aws_iam_access_key" "sunodo_registry" {
  user = aws_iam_user.sunodo_registry.name
}

resource "aws_iam_user_policy_attachment" "sunodo_registry" {
  user       = aws_iam_user.sunodo_registry.name
  policy_arn = aws_iam_policy.sunodo_registry.arn
}

resource "aws_s3_bucket_server_side_encryption_configuration" "sunodo_bucket_encryption" {
  bucket = aws_s3_bucket.sunodo_bucket.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
