resource "cloudflare_workers_kv_namespace" "tv_kv" {
  account_id = var.cloudflare_account_id
  title      = "tv-${terraform.workspace}"
}

output "kv_id" {
  value = cloudflare_workers_kv_namespace.tv_kv.id
}