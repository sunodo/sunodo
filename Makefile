# Requires: markdownlint-cli2 (https://github.com/DavidAnson/markdownlint-cli2)
lint-docs:
	@markdownlint-cli2 "**/*.md"

lint-all: lint-docs
