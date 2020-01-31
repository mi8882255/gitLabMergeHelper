const axios = require('axios');
const https = require('https');

const projectName = process.argv[2];

(async () => {
	const acessToken = process.env.GITLAB_API_KEY;
	const gitlabApiUrl = process.env.GITLAB_URL + '/api/v4/';

	const axiosInstance = axios.create({
		httpsAgent: new https.Agent({
			rejectUnauthorized: false
		}),
		baseURL: gitlabApiUrl,
		timeout: 10000,
		headers: { 'Private-Token': acessToken }
	});

	const getMr = async () => {
		const resp = await axiosInstance.get('/merge_requests?state=opened&scope=all');
		const respDataFiltered = resp.data.map((el) => {
			return {
				author: el.author.name,
				date: el.createdAt,
				description: el.description,
				iid: el.iid,
				src: el.source_branch,
				dst: el.target_branch,
				project_id: el.project_id,
				title: el.title,
				webUrl: el.web_url,
				hasConflicts: el.has_conflicts
			}
		})
		const repData = {};
		const getRepData = async pId => {
			if (repData[pId]) return repData[pId];

			const resp = await axiosInstance.get(`/projects/${pId}`);
			const ret = {
				ssh: resp.data.ssh_url_to_repo,
				webUrl: resp.data.web_url,
				pathWithNamespace: resp.data.path_with_namespace
			}
			repData[pId] = ret;

			return ret;
		}

		for (const el of respDataFiltered) {
			el.repData = await getRepData(el.project_id);
		}

		const allProjectsList = respDataFiltered.reduce((acc, el) => { acc.push(el.repData.pathWithNamespace); return acc }, [])
		const prjMr = projectName ? respDataFiltered.filter(el => el.repData.pathWithNamespace === projectName) : respDataFiltered;
		const prjMrRrepData = prjMr[0].repData;

		prjMr.map(el => { delete el.repData; return el })
		console.log(JSON.stringify({
			repData: prjMrRrepData,
			allProjectsList: [...new Set(allProjectsList)],
			mrs: prjMr
		}, null, 2));
	}

	await getMr();
})()
