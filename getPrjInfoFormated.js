const data = require('./respExample.json');

const key = process.argv[2];
if (!key) {
	console.log(JSON.stringify(data.repData, null, 2));
	process.exit();
}

const result = data.repData[key];
console.log(result);
