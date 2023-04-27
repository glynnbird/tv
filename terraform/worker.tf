# API key needed to access the API
resource "random_string" "apiKey" {
  length           = 20
  special          = false
  upper            = false
  lower            = true
}
output apiKey {
  value = random_string.apiKey.id
}

// add a new programme
resource "cloudflare_worker_script" "add_worker" {
  account_id = var.cloudflare_account_id
  name       = "tv_add_${terraform.workspace}"
  content    = file("../code/dist/add.js")
  module     = true

  // bind the KV service to this worker
  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.tv_kv.id
  }
}

// list all programmes
resource "cloudflare_worker_script" "list_worker" {
  account_id = var.cloudflare_account_id
  name       = "tv_list_${terraform.workspace}"
  content    = file("../code/dist/list.js")
  module     = true

  // bind the KV service to this worker
  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.tv_kv.id
  }
}

// query by network
resource "cloudflare_worker_script" "query_network_worker" {
  account_id = var.cloudflare_account_id
  name       = "tv_query_network_${terraform.workspace}"
  content    = file("../code/dist/query_network.js")
  module     = true

  // bind the KV service to this worker
  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.tv_kv.id
  }
}

// query by date
resource "cloudflare_worker_script" "query_date_worker" {
  account_id = var.cloudflare_account_id
  name       = "tv_query_date_${terraform.workspace}"
  content    = file("../code/dist/query_date.js")
  module     = true

  // bind the KV service to this worker
  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.tv_kv.id
  }
}

// delete a single Todo
resource "cloudflare_worker_script" "delete_worker" {
  account_id = var.cloudflare_account_id
  name       = "tv_delete_${terraform.workspace}"
  content    = file("../code/dist/delete.js")
  module     = true

  // bind the KV service to this worker
  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.tv_kv.id
  }
}

// get a single programme
resource "cloudflare_worker_script" "get_worker" {
  account_id = var.cloudflare_account_id
  name       = "tv_get_${terraform.workspace}"
  content    = file("../code/dist/get.js")
  module     = true

  // bind the KV service to this worker
  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.tv_kv.id
  }
}

// router worker that is the first thing called with every incoming HTTP request
resource "cloudflare_worker_script" "router_worker" {
  account_id = var.cloudflare_account_id
  name       = "router_${terraform.workspace}"
  content    = file("../code/dist/router.js")
  module     = true

  // bind the other workers to this router worker
  // so that it can invoke any worker according to the incoming request
  service_binding {
    name        = "WORKER_ADD"
    service     = cloudflare_worker_script.add_worker.name
    environment = "production" 
  }
  service_binding {
    name        = "WORKER_LIST"
    service     = cloudflare_worker_script.list_worker.name
    environment = "production" 
  }
  service_binding {
    name        = "WORKER_QUERY_NETWORK"
    service     = cloudflare_worker_script.query_network_worker.name
    environment = "production" 
  }
  service_binding {
    name        = "WORKER_QUERY_DATE"
    service     = cloudflare_worker_script.query_date_worker.name
    environment = "production" 
  }
  service_binding {
    name        = "WORKER_GET"
    service     = cloudflare_worker_script.get_worker.name
    environment = "production" 
  }
  service_binding {
    name        = "WORKER_DELETE"
    service     = cloudflare_worker_script.delete_worker.name
    environment = "production" 
  }

  // let the router know the api key
  plain_text_binding {
    name = "API_KEY"
    text = random_string.apiKey.id
  }
}

// the router worker is bound to its own custom domain name (DNS record)
resource "cloudflare_worker_domain" "worker_domain" {
  account_id = var.cloudflare_account_id
  hostname   = var.cloudflare_domain
  service    = cloudflare_worker_script.router_worker.name
  zone_id    = var.cloudflare_zone_id
}