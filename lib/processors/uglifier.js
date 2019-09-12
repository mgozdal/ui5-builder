
/**
 * Minifies the supplied resources.
 *
 * @public
 * @alias module:@ui5/builder.processors.uglifier
 * @param {Object} parameters Parameters
 * @param {module:@ui5/fs.Resource[]} parameters.resources List of resources to be processed
 * @returns {Promise<module:@ui5/fs.Resource[]>} Promise resolving with uglified resources
 */
module.exports = function({resources}) {
	const workerpool = require("workerpool");
	const pool = workerpool.pool(__dirname + "/uglifier_worker.js", {
		workerType: "auto"
	});

	return Promise.all(resources.map((resource) => {
		return resource.getString().then((code) => {
			return pool.exec("uglify", [{
				filePath: resource.getPath(),
				code
			}]);
		}).then((uglifiedCode) => {
			resource.setString(uglifiedCode);
			return resource;
		});
	})).then((processedResources) => {
		pool.terminate();
		return processedResources;
	});
};
