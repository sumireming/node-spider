const request = require('request')
const cheerio = require('cheerio')

let homepageUrl = 'http://www.yinfans.com/'


new Promise(resolve => {
	process.stdout.write(`获取网站目录... \n`)
	request(homepageUrl, (error, response, body) => {
		resolve(body)
	})
}).then(data => {
	process.stdout.write(`获取网站目录完毕 \n`)
	return getCatalog(data)
}).then(data => {
	getUrlList(data).then(data => {
		getDownloadUrl(data)
	})

})


function getDownloadUrl(postUrlList) {
	return new Promise(resolve => {
		let dlUrlList = []

		process.stdout.write(`获取文章【` + postUrlList[0] + `】下的下载链接...\n`)
		request(postUrlList[0], (error, response, body) => {
			let $ = cheerio.load(body, {decodeEntities: false})
			$('#post_content a').each((index, elem) => {
				if($(elem).attr('href').search(/^magnet\:/) !== -1) {
					dlUrlList.push({
						url : $(elem).attr('href'),
						name : $(elem).html()
					})
				}
			})

			console.log(JSON.stringify(dlUrlList, null, 2))

		})
		
	})
}


function getUrlList(urlList) {
	return new Promise(resolve => {
		process.stdout.write(`获取目录【` + urlList[0] + `】下的链接...\n`)
		request(urlList[0], (error, response, body) => {
			let $ = cheerio.load(body)
			let urlList = $('#post_container li .thumbnail a').map((index, elem) => {return $(elem).attr('href')}).get()
			resolve(urlList)
		})
	})
}


function getCatalog(html) {
	let catalog = []
	let $ = cheerio.load(html)
	let lastPage = $('.pagination a.extend').attr('href')
	let re = new RegExp('(\\d+)','ig')
	re.exec(lastPage)
	let lastPageNum = RegExp.$1
	for (let i = 1; i<lastPageNum; i++) {
		catalog.push(lastPage.replace(/\d+/, i))
	}

	return catalog
}


