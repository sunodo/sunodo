target "docker-metadata-action" {}

target "default" {
  platforms = [ "linux/riscv64"]
  inherits = ["docker-metadata-action"]
  args = {
    IMAGE_REGISTRY="docker.io"
    IMAGE_NAMESPACE="riscv64"
    IMAGE_NAME="ubuntu"
    IMAGE_TAG="22.04"
    CHISEL_VERSION="0.9.1"
    TARGETARCH="riscv64"
    MACHINE_EMULATOR_TOOLS_VERSION="0.14.1"
  }
}
