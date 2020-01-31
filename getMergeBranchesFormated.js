const data = require('./respExample.json');

const iid = process.argv[2];
if (!iid) {
	console.log(JSON.stringify(data, null, 2));
	process.exit();
}
const fieldName = process.argv[3];
const result = data.mrs.find(el => '' + el.iid === '' + iid);
console.log(result[fieldName]);
