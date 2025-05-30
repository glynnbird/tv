
resource "cloudflare_pages_project" "frontend_project" {
  account_id        = var.cloudflare_account_id
  name              = "tv"
  production_branch = "main"
  
  build_config = {
    build_caching       = true
    build_command       = "./build.sh"
    destination_dir     = "dist"
    root_dir            = "/"
  }

  source = {
    type = "github"
    config = {
      owner                         = "glynnbird"
      repo_name                     = "tv"
      production_branch             = "main"
      # pr_comments_enabled           = true
      # deployments_enabled           = true
      # production_deployment_enabled = true
      # preview_deployment_setting    = "custom"
      # preview_branch_includes       = ["dev", "preview"]
      # preview_branch_excludes       = ["main", "prod"]
    }
  }
    deployment_configs = {
      preview = {
        
      }
      production = {
        env_vars = {
          NODE_VERSION = {
            type = "plain_text"
            value = "22"
          }
          API_KEY = {
            type = "plain_text"
            value = random_string.apiKey.id
          }
        }

        ai_bindings = {
          AI = {}
        }

        kv_namespaces = {
          TVKV = { 
            namespace_id = cloudflare_workers_kv_namespace.tvkv.id
          }
        }
      }
  }
}

resource "cloudflare_pages_domain" "frontend_domain" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.frontend_project.name
  name       = "${var.cloudflare_subdomain}.${var.cloudflare_hostname}"
}

resource "cloudflare_dns_record" "frontend_dns" {
  zone_id = var.cloudflare_zone_id
  name    = var.cloudflare_subdomain
  content   = cloudflare_pages_project.frontend_project.subdomain
  type    = "CNAME"
  ttl     = 3600
}

