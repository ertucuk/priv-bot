const settings = require('./System');
let bots = [];

if (settings.Private.Token)
    bots.push({
        name: settings.serverName + '-Private',
        namespace: 'ertu',
        script: 'index.js',
        watch: false,
        exec_mode: 'cluster',
        max_memory_restart: '2G',
        cwd: './Bot/Private/',
        args: ['--color', '--watch'],
    });

if (settings.Security.Logger)
    bots.push({
        name: settings.serverName + '-Logger',
        namespace: 'ertu',
        script: 'index.js', 
        watch: false,
        exec_mode: 'cluster',
        max_memory_restart: '2G',
        cwd: './Bot/Guard/I',
        args: ['--color', '--watch'],
    });

if (settings.Security.Punish)
    bots.push({
        name: settings.serverName + '-Punish',
        namespace: 'ertu',
        script: 'index.js',
        watch: false,
        exec_mode: 'cluster',
        max_memory_restart: '2G',
        cwd: './Bot/Guard/II',
        args: ['--color', '--watch'],
    });

if (settings.Security.Backup)
    bots.push({
        name: settings.serverName + '-Backup',
        namespace: 'ertu',
        script: 'index.js',
        watch: false,
        exec_mode: 'cluster',
        max_memory_restart: '2G',
        cwd: './Bot/Guard/III',
        args: ['--color', '--watch'],
    });

module.exports = { apps: bots };