require('./db/index.js');
require('./app.js');
require('child_process').exec('browser/browser --url=http://127.0.0.1:6003', { shell: false, detached: true });