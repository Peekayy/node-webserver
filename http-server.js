var express = require("express");
var morgan = require("morgan");
var app = express();

var argv = require("yargs")
    .usage("Usage: $0 [options]")
    .describe("p", "Set listening port")
    .alias("p", "port")
    .default("p", 80)
    .describe("h", "Custom header")
    .alias("h", "header")
    .default("h", "")
    .describe("c", "Enable CORS support (adds Access-Control-Allow-Origin: * and Access-Control-Allow-Headers: X-Requested-With headers)")
    .alias("c", "cors")
    .argv;

app.use(morgan("dev"));


var headers = [];
if (argv.h) {
    headers = Array.isArray(argv.h) ? argv.h : [argv.h];
}

if (argv.c) {
    headers.push("Access-Control-Allow-Origin: *");
    headers.push("Access-Control-Allow-Headers: X-Requested-With");
}

if (headers && headers.length) {
    app.all("*", function(req, res, next) {
        for (var i = 0; i < headers.length; i++) {
            var headerTab = headers[i].split(":");
            res.header(headerTab[0].trim(), headerTab[1].trim());
        }
        next();
    });
}
app.use("/", express.static(process.cwd()));


try {
    app.listen(argv.p);
    console.info("Server listening on " + argv.p);
    if (headers && headers.length) {
        console.info("With following headers : ");
        for (var i = 0; i < headers.length; i++) {
            var headerTab = headers[i].split(":");
            console.info(headerTab[0].trim() + ": " + headerTab[1].trim());
        }
    }
} catch (e) {
    console.info(e);
}