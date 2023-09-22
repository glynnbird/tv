resource "cloudflare_workers_kv_namespace" "tvkv" {
  account_id = var.cloudflare_account_id
  title      = "tvkv-${terraform.workspace}"
}

output "kv_id" {
  value = cloudflare_workers_kv_namespace.tvkv.id
}
