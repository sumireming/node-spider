const request = require('request').defaults({maxRedirects:100})
const cheerio = require('cheerio')
const XLSX = require('xlsx')

let homepageUrl = 'http://gaoqing.la/720p'
let _Result = []


new Promise(resolve => {
	process.stdout.write(`获取网站目录... \n`)
	request(homepageUrl, (error, response, body) => {
		if (!error) {
			resolve(body)
		} else {
			console.log(error)
		}
	})
}).then(data => {
	process.stdout.write(`获取网站目录完毕 \n`)
	return getCatalog(data)
}).then(data => {

	new Promise(resolve => {
		let cataloglist = data
		let catalogPromise = []
		//  控制目录表
		for(let i = 0; i<5; i++) {
			catalogPromise.push(getUrlList(cataloglist, i))
		}

		resolve(Promise.all(catalogPromise))
	}).then(data => {
		process.stdout.write(`获取文章列表完毕 \n`)

		new Promise(resolve => {
			let postUrlList = Array.prototype.concat.apply([], data)
			let postPromise = []
			for(let i = 0; i<postUrlList.length; i++) {
				postPromise.push(getDownloadUrl(postUrlList, i))
			}
			resolve(Promise.all(postPromise))
		}).then(data => {
			process.stdout.write(`获取下载资源完毕 \n`)
			_Result = Array.prototype.concat.apply([], data)
			console.log('一共' + _Result.length + '条')
			process.stdout.write(`表格文件生成中... \n`)
			output('result', ['name', 'year', 'filename', 'url', 'postId', 'doubanId'], _Result)
		})

	})

})


function getDownloadUrl(postUrlList, index) {
	
	return new Promise(resolve => {

		((i) => {
			setTimeout(() => {
				process.stdout.write(`获取文章【` + postUrlList[i] + `】中的下载链接...\n`)
				request(postUrlList[i], (error, response, body) => {

					if(!error && response.statusCode == 200) {
						try {
							let result = []
							let $ = cheerio.load(body, {decodeEntities: false})
							$('#post_content a').each((index, elem) => {
								let titleArr = $('#content .article_container h1').text().split(/\s+/)
								let postContent = $('#post_content').text()
								let movieName = titleArr[1]
								let movieYear = titleArr[0]
								let re = /[\s\S]*\movie.douban.com\/subject\/(\d+)[\s\S]*/.exec(postContent)
								let doubanId = re ? re[1] : ''
								if($(elem).attr('href') && $(elem).attr('href').search(/^magnet\:/) !== -1) {
									result.push({
										name: movieName,
										year: movieYear,
										filename: $(elem).html(),
										url: $(elem).attr('href'),
										postId: '',
										doubanId: doubanId
									})
								}
							})
							process.stdout.write('success.... \n')
							resolve(result)
						}catch(err) {
							process.stdout.write(err + '\n')
							resolve([])
						}
						
					}else {
						process.stdout.write('error.... \n')
						resolve([])
					}
				})

			}, i * 5000)
		})(index)

		
		
	})
}



function getUrlList(cataloglist, index) {
	return new Promise(resolve => {
		((i) => {
			setTimeout(() => {
				process.stdout.write(`获取目录【` + cataloglist[i] + `】下的文章链接... \n`)
				request(cataloglist[i], (error, response, body) => {
					if (!error && response.statusCode == 200) {
						let $ = cheerio.load(body)
						let cataloglist = $('#post_container li .thumbnail a').map((index, elem) => {return $(elem).attr('href')}).get()
						resolve(cataloglist)
					}else {
						resolve([])
					}
					
				})
			}, i * 5000)
		})(index)
		
	})
}


function getCatalog(html) {
	let catalog = []
	let $ = cheerio.load(html)
	let lastPage = $('.pagination a.extend').attr('href')
	let re = new RegExp('(\\d+)$','ig')
	re.exec(lastPage)
	let lastPageNum = RegExp.$1
	for (let i = 1; i<lastPageNum; i++) {
		catalog.push(lastPage.replace(/\d+$/, i))

	}

	return catalog
}


function output(filename, _headers, _data) {

	// let _headers = ['name', 'filename', 'url', 'postId', 'doubanId']
	let headers = _headers
					.map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65+i) + 1 }))
					.reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {})

	let data = _data
				.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65+j) + (i+2) })))
				.reduce((prev, next) => prev.concat(next))
				.reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {})

	// 合并 headers 和 data
	let output = Object.assign({}, headers, data)
	// 获取所有单元格的位置
	let outputPos = Object.keys(output)
	// 计算出范围
	let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1]
	// 构建 workbook 对象
	let wb = {
	    SheetNames: ['mySheet'],
	    Sheets: {
	        'mySheet': Object.assign({}, output, { '!ref': ref })
	    }
	}

	XLSX.writeFile(wb, filename + '_' + new Date().getTime() + '.xlsx')
	process.stdout.write(`表格文件生成完毕 \n`)

}


