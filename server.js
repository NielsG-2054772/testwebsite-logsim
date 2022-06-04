const express = require('express');
const app = express();

// Serve all the files in '/dist' directory
app.use(express.static('dist'));


var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
