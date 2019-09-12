const workerpool = require("workerpool");
const terser = require("terser");
const copyrightCommentsPattern = /copyright|\(c\)(?:[0-9]+|\s+[0-9A-za-z])|released under|license|\u00a9/i;

function uglify({filePath, code}) {
	const result = terser.minify({
		[filePath]: code
	}, {
		warnings: false,
		output: {
			comments: copyrightCommentsPattern,
			wrap_func_args: false
		},
		compress: false
	});
	if (result.error) {
		throw new Error(
			`Uglification failed with error: ${result.error.message} in file ${result.error.filename} ` +
			`(line ${result.error.line}, col ${result.error.col}, pos ${result.error.pos})`);
	} else {
		return result.code;
	}
}

// create a worker and register public functions
workerpool.worker({
	uglify
});
