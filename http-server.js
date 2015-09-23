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

morgan.format("custom", function customFormat(tokens, req, res) {
    // get the status code if response written
    var status = res._header
        ? res.statusCode
        : undefined;

    // get status color
    var color = status >= 500 ? 31 // red
        : status >= 400 ? 33 // yellow
        : status >= 300 ? 36 // cyan
        : status >= 200 ? 32 // green
        : 0;// no color

    // get colored function
    var fn = customFormat[color];

    if (!fn) {
        // compile
        fn = customFormat[color] = morgan.compile("\x1b[0m:remote-addr :method :url \x1b[" + color + "m:status \x1b[0m:response-time ms - :res[content-length]\x1b[0m");
    }

    return fn(tokens, req, res);
});

app.use(morgan("custom"));


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