/**
 * Created by guopeng on 16/4/17.
 */
'use strict';

var spawn = require('cross-spawn');

var spawnCommand = module.exports;

spawnCommand.spawnCommand = function (command, args, opt) {
    opt = opt || {};
    return spawn(command, args, Object.assign(opt, {stdio: 'inherit'}));
}

spawnCommand.spawnCommandSync = function (command, args, opt) {
    opt = opt || {};
    return spawn.sync(command, args, Object.assign(opt, {stdio: 'inherit'}));
}
