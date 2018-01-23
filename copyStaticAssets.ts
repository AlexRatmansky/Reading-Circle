const shell = require('shelljs');

shell.mkdir('-p', 'dist/public/css/');
shell.cp('-R', 'src/public/js/lib', 'dist/public/js/');
shell.cp('-R', 'src/public/fonts', 'dist/public/');
shell.cp('-R', 'src/public/img', 'dist/public/');
