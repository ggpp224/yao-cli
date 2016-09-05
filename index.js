/**
 * Created by guopeng on 16/4/16.
 */
'use strict';

var path = require('path');
var inquirer = require('inquirer');
var chalk = require('chalk');
var spawnCommand =  require('./spawnCommand');
var menfs = require('mem-fs')
var FileEditor = require('mem-fs-editor');
var mkdirp = require('mkdirp');
var pathExists = require('path-exists');
var pathIsAbsolute = require('path-is-absolute');



class Generator {

    constructor(baseRoot){
        this.options = {};
        this._destinationRoot = process.cwd();//目标根目录
        this.baseRoot = baseRoot||path.join(__dirname,'../../');//生成器根目录
        this._sourceRoot = path.resolve(this.baseRoot ,'app/templates');//生成器内模板目录

        this.shardFs = menfs.create();
        this.fs = FileEditor.create(this.shardFs);
        Object.assign(this,spawnCommand);

        inquirer.prompt(this.prompting()).then( (answers) => {
            this.answers = answers;
            this.writing();
            this._writeFile();
            process.chdir(this._destinationRoot);
            this.install();
        })
    }

    prompting(){
        return [];
    }

    writing(){

    }

    install(){

    }


    /**
     * 设置目标根目录
     * @param rootPath
     * @returns {Promise.<*>|*}
     */
    destinationRoot(rootPath) {
        process.chdir(this._destinationRoot);
        if (typeof rootPath === 'string') {
            this._destinationRoot = path.resolve(rootPath);

            if (!pathExists.sync(rootPath)) {
                mkdirp.sync(rootPath);
            }

            process.chdir(rootPath);

        }

        return this._destinationRoot || process.cwd();
    }

    /**
     * 设置模板文件根目录
     * @param rootPath
     * @returns {Promise.<string>|*}
     */
    sourceRoot(rootPath) {

        if (typeof rootPath === 'string') {
            this._sourceRoot = path.resolve(rootPath);
        }

        return this._sourceRoot;
    }

    /**
     * Join a path to the source root.
     * @param  {...String} path
     * @return {String}    joined path
     */

    templatePath() {
        var filepath = path.join.apply(path, arguments);

        if (!pathIsAbsolute(filepath)) {
            filepath = path.join(this.sourceRoot(), filepath);
        }

        return filepath;
    }

    /**
     * 将传入路径拼接到根路径上
     * @param  {...String} path
     * @return {String}    joined path
     */

    destinationPath() {
        var filepath = path.join.apply(path, arguments);

        if (!pathIsAbsolute(filepath)) {
            filepath = path.join(this.destinationRoot(), filepath);
        }

        return filepath;
    }

    //写入到磁盘并输出log
    _writeFile(){
        var store = this.fs.store;
        store.each(function (file, index) {
            var filePath = file.path;
            var state = store.get(filePath).state;
            if(state === 'modified'){
                console.log(chalk.green(`created  ${filePath}`))
            }else if(state === 'deleted'){
                console.log(chalk.red(`deleted  ${filePath}`));
            }
        });
        this.fs.commit(function () {
            // console.log(this)
        });
    }



}

module.exports = Generator;
