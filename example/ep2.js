/***
  
  【例子2 - 传统模板类页面抓取(cheerio)】
  抓取论坛帖子数据，生成json
  执行命令：
  node ep2

***/


const request = require('request')
const cheerio = require('cheerio')

let urlList = [
	'http://bbs.qyer.com/thread-2797033-1.html',
	'http://bbs.qyer.com/thread-2818788-1.html'
]

let result = []
let count = 0

urlList.forEach((url, i) => {
	getPageHTML(url, (html) => {
		let $ = cheerio.load(html)
		let obj = {}
		obj.userhead = $('.face img').attr('src')
		obj.username = $('.face img').attr('alt')
		obj.image = $('.banimg').attr('src')
		obj.url = url
		result[i] = obj
		count++
		if (count === urlList.length) {
			console.log(JSON.stringify(result, null, 2))
		}
	})
})


function getPageHTML(url, callback) {
	request(url, (error, response, body) => {
		callback(body)

	})
}

