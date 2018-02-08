var gulp = require('gulp');
var exec = require('child_process').exec;
var todo = require('gulp-todo');
var git = require('git-rev');

var prodBuilds = ['stage','master'];
var deploys = ['development','test'];

var execute = (cmd,done) => {
	exec(cmd, function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		done(err);
	});
}

gulp.task('todo', () => {
	gulp.src(['src/app/**/*.ts','src/app/**/*.html','src/**/*.less'])
		.pipe(todo())
		.pipe(gulp.dest('./'));
});

gulp.task('default', (done) => {
	git.branch((str) => {
		if(prodBuilds.includes(str)){
			console.log('Running ng build -prod');
			execute('ng build -prod --no-progress',done);
		}else if(deploys.includes(str)){
			console.log('Running ng build -prod --aot=false');
			execute('ng build -prod --aot=false --no-progress',done);
		}else{
			console.log('Linting build');
			execute('ng lint',(err) => {
				if(!err){
					execute('ng build -prod --aot=false --no-progress',done);
				}else{
					done(err);
				}
			});
		}
	});
});