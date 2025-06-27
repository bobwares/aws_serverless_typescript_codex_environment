# @application Infrastructure-as-Code (IaC)
# @source prod.tfvars
# @author Bobwares
# @version 2.0.1
# @description Variable overrides for prod stage.
# @updated 2025-06-21T18:34:41Z

environment = "prod"
schema_path = "../../schema/domain.json"
tags = {
  Project = "ServerlessCrud"
  Owner   = "Bobwares"
}
