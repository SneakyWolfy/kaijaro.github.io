//not in use

var fs = require('fs')
  , path = require('path')
  , ini = require('ini')

  var path = require('path'), fs=require('fs');

function fromDir(startPath,filter,callback){

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter,callback); //recurse
        }
        else if (filter.test(filename)) callback(filename);
    };
};

fromDir('../LiteScript',/\.html$/,function(filename){
    console.log('-- found: ',filename);
});

class SkinCompiler{
    constructor(path='../skin'){
        this.path=path
    }
    compile(){
        var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
    }

}