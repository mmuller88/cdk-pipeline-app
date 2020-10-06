.DEFAULT_GOAL := build

FUNCTION_NAME := $(shell node -p "require('./package.json').name")

check-env:
ifeq ($(FUNCTION_NAME),)
	$(error FUNCTION_NAME is empty)
endif
ifeq ($(FUNCTION_NAME),undefined)
	$(error FUNCTION_NAME is undefined)
endif

.PHONY: bootstrap
bootstrap:
	cdk bootstrap --profile damadden88 --trust 981237193288 --force --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://981237193288/us-east-1
	cdk bootstrap --profile damadden88 --trust 981237193288 --force --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://981237193288/eu-central-1
