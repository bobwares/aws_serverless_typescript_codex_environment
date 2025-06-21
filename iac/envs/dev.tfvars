# @application Infrastructure-as-Code (IaC)
# @source dev.tfvars
# @author Bobwares
# @version 2.0.0
# @description Variable overrides for dev stage.
# @updated 2025-06-20

environment = "dev"
schema_path = "../schemas/customer_profile.json"
tags = {
  Project = "ServerlessCrud"
  Owner   = "Bobwares"
}
