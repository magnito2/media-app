const config = require('./config');

const proxy = require('http-proxy-middleware');

const URI = config.proxy_reverse_uri;
module.exports = function(app) {
    const wsProxy = proxy('/api',
        {ws:true,
            target:URI,
            secure: false,
            //pathRewrite: { '^/api': '' }, // remove leading /api to match real API urls
        });
    app.use(wsProxy);
};