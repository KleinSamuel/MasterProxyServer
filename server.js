const fs = require("fs");
const http = require("http");
const https = require("https");
const httpProxy = require("http-proxy");

var config = require("./master.config");

var URL = config.url;
var PORT_HTTP = config.port_http;
var PORT_HTTPS = config.port_https;

var options = {
  key: config.key,
  cert: config.cert
};

var proxy_http = httpProxy.createProxyServer({});
var proxy_https = httpProxy.createProxyServer({
  ssl: {
    key: config.key,
    cert: config.cert
  },
  target: "https://"+URL+":"+PORT_HTTPS,
  secure: true
});

var server_http = http.createServer(function(req, res){
  var subdomain = req.headers.host.split(".")[0];
  var flag = false;
  for(var i in config.websites){
    var website = config.websites[i];
    if(subdomain == website.subdomain){
      proxy_http.web(req, res, {target: "http://"+URL+":"+website.port_http});
      flag = true;
      break;
    }
  }
  if(!flag){
    res.statusCode = 404;
    res.end("<h1 style='margin-left:40%;margin-top:200px;'>404 Page Not Found</h1>");
  }
});

server_http.listen(PORT_HTTP, function(){
  console.log("[ INFO ] HTTP Master Server running on port <"+PORT_HTTP+">");
});

var server_https = https.createServer(options, function(req, res){
  var subdomain = req.headers.host.split(".")[0];
  var flag = false;
  for(var i in config.websites){
    var website = config.websites[i];
    if(subdomain == website.subdomain){
      proxy_http.web(req, res, {target: "https://"+URL+":"+website.port_https});
      flag = true;
      break;
    }
  }
  if(!flag){
    res.statusCode = 404;
    res.end("<h1 style='margin-left:40%;margin-top:200px;'>404 Page Not Found</h1>");
  }
});

server_https.listen(PORT_HTTPS, function(){
  console.log("[ INFO ] HTTPS Master Server running on port <"+PORT_HTTPS+">");
});
