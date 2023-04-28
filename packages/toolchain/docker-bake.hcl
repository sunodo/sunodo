
group "default" {
  targets = ["toolchain-0-14-0"]
}

target "toolchain-0-14-0" {
  args = {
    BASE_IMAGE               = "ubuntu:22.04"
    MACHINE_EMULATOR_VERSION = "0.13.0"
    LINUX_VERSION            = "0.15.0"
    LINUX_KERNEL_VERSION     = "5.15.63-ctsi-1"
    ROM_VERSION              = "0.15.0"
  }
  platforms = ["linux/amd64", "linux/arm64"]
  tags      = ["sunodo/toolchain:0.14.0", "ghcr.io/sunodo/toolchain:0.14.0"]
}

target "toolchain-0-15-0" {
  args = {
    BASE_IMAGE               = "debian:bullseye-20230320"
    MACHINE_EMULATOR_VERSION = "0.14.0"
    LINUX_VERSION            = "0.16.0"
    LINUX_KERNEL_VERSION     = "5.15.63-ctsi-2"
    ROM_VERSION              = "0.16.0"
  }
  platforms = ["linux/amd64", "linux/arm64"]
  tags      = ["sunodo/toolchain:0.15.0", "ghcr.io/sunodo/toolchain:0.15.0"]
}

target "toolchain-devel" {
  args = {
    BASE_IMAGE               = "debian:bullseye-20230320"
    MACHINE_EMULATOR_VERSION = "devel"
    LINUX_VERSION            = "0.16.0"
    LINUX_KERNEL_VERSION     = "5.15.63-ctsi-2"
    ROM_VERSION              = "0.16.0"
  }
  tags      = ["sunodo/toolchain:devel"]
}
