# @application Infrastructure-as-Code (IaC)
# @source dev.tfvars
# @author Bobwares
# @version 2.0.1
# @description Variable overrides for dev stage.
# @updated 2025-06-21T18:34:41Z

environment = "dev"
schema_path = "../schema/domain.json"
tags = {
  Project = "ServerlessCrud"
  Owner   = "Codex"
  ManagedBy  = "terraform"
}
