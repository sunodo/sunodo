target "default" {
  tags = ["sunodo/devnet:devel"]
  args = {
    SUNODO_ANVIL_VERSION = "devel"
  }
}
