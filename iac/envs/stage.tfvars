# @application Infrastructure-as-Code (IaC)
# @source stage.tfvars
# @author Bobwares
# @version 2.0.0
# @description Variable overrides for stage stage.
# @updated 2025-06-20

environment = "stage"
schema_path = "../schemas/customer_profile.json"
tags = {
  Project = "ServerlessCrud"
  Owner   = "Bobwares"
}
