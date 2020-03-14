const fs = require("fs");
const http = require("http");
const https = require("https");
const httpProxy = require("http-proxy");

const config = require("./master.config");

let URL = config.url;
let PORT_HTTP = config.port_http;
let PORT_HTTPS = config.port_https;

let options = {
    key: readFileSync(config.ssl_key),
    cert: readFileSync(config.ssl_cert)
};

function readFileSync(path){
    try {
        return fs.readFileSync(path, "utf-8")
    } catch (error) {
        return undefined
    }
};

const proxy_http = httpProxy.createProxyServer({});
const proxy_https = httpProxy.createProxyServer({
    ssl: {
        key: options.key,
        cert: options.cert
    },
    secure: false
});

http.createServer(function(req, res) {

    let subdomain = req.headers.host.split(".")[0];
    let flag = false;

    for (let i in config.websites) {
        let website = config.websites[i];
        if (subdomain === website.subdomain) {
            proxy_http.web(req, res, {target: "http://"+URL+":"+website.port_http});
            flag = true;
            break;
        }
    }

    if (!flag) {
        res.statusCode = 404;
        res.end("<h1 style='margin-left:40%;margin-top:200px;'>404 Page Not Found</h1>");
    }

}).listen(PORT_HTTP, function() {
    console.log("[ INFO ] HTTP Master Server running on port <"+PORT_HTTP+">");
});

https.createServer(options, function(req, res){

    let subdomain = req.headers.host.split(".")[0];
    let flag = false;

    for (let i in config.websites) {
        let website = config.websites[i];
        if (subdomain === website.subdomain) {
            proxy_https.web(req, res, {target: "https://"+URL+":"+website.port_https});
            flag = true;
            break;
        }
    }

    if(!flag){
        res.statusCode = 404;
        res.end("<h1 style='margin-left:40%;margin-top:200px;'>404 Page Not Found</h1>");
    }

}).listen(PORT_HTTPS, function(){
    console.log("[ INFO ] HTTPS Master Server running on port <"+PORT_HTTPS+">");
});
