# Local Proxy Server
Local HTTP/HTTPS proxy server to route subdomains to specific services running on the same server.

Used to manage the routing of multiple services running on the same server but on different ports without the need of configuring the DNS settings of the domain.

### Config
- `url` main url of the server
- `port_http` http port the server is listening to
- `port_https` https port the server is listening to
- `ssh_key` path to the public ssl key
- `ssh_cert` path to the ssl certificate
- `websites` list of services running on the server
- `websites.name` name of the service
- `websites.port_http` http port the service is listening to
- `websites.port_https` https port the service is listening to
- `websites.subdomain` subdomain under which the service should be accessible

### Usage
```
node server.js
```
