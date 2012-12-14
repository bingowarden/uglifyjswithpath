var fs = require('fs');
var uglify = require('uglify-js');
var path = require('path');

var _dir = __dirname;
var _sep = path.sep;

function readPath(tp){
	var _basedir = path.normalize(tp) + 'after';
	_basedir = path.join(_dir,_basedir);
	var _dirdeep = _basedir.split(_sep).length;

	fs.exists(_basedir,function(exists){
		if(!exists){
			fs.mkdir(_basedir,function(){
				console.log(_basedir + ' created !');
				ckPath(path.join(_dir,tp));
			});
		}else{
			ckPath(path.join(_dir,tp));
		}
	});
	
	function ckPath(targetPath,sub){
		fs.readdir(targetPath,function(err,files){
			for(var i=0;i<files.length;i++){
				var filepath = path.join(targetPath,files[i]);
				statfile(filepath,files[i]);
			}
		})
	}

	function statfile(paths,name){
		fs.stat(paths,function(err,stat){
			var patharr = paths.split(_sep);
			if(patharr.length>_dirdeep){
				for(var i=0;i<_dirdeep;i++){
					patharr.shift();
				}
			}
			var realpath = path.join(_basedir,patharr.join(_sep));
			if(!stat.isFile()){
				fs.mkdir(realpath,function(){
					console.log('path: '+realpath+' created ~');
					ckPath(paths);
				})
			}else{
				fs.readFile(paths,'utf8',function(err,data){
					try{
						fs.writeFile(realpath,uglify(data),'utf8',function(err){
							if(err) {
								console.log('-------------------------------------'+realpath+' write failed !'+'-------------------------------------------');
								return;
							}
							!err && console.log('file: ' + realpath + ' created and written !');
						})
					}catch(e){
						console.log('-------------------------------------'+paths+' uglifyjs failed !'+'-------------------------------------------');
					}
				})
			}
		})
	}
}

var basepath = process.argv[2];

if(basepath){
	var reg = new RegExp('^\.\\'+_sep+'\.*[\\w]+$');
	if(reg.test(basepath)){
		readPath(basepath);
	}else{
		console.log('path must begin with "./",end with pathname(not "/") ,example: node uglifyPath.js ./nfsjs');
	}
}else{
	console.log('must input a path ,example: node uglifyPath.js ./nfsjs');
}