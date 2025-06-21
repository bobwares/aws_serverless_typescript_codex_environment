# @application Infrastructure-as-Code (IaC)
# @source prod.tfvars
# @author Bobwares
# @version 2.0.0
# @description Variable overrides for prod stage.
# @updated 2025-06-20

environment = "prod"
schema_path = "../schemas/customer_profile.json"
tags = {
  Project = "ServerlessCrud"
  Owner   = "Bobwares"
}
