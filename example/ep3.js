
/***
  
  【例子3 - node模板类页面抓取(jsdom)】
  抓取商城商品数据，生成json
  执行命令：
  node ep3

***/


const request = require('request')
const jsdom =require('jsdom')
const { JSDOM } = jsdom


let urlList = [
	'http://z.qyer.com/deal/93299/',
	'http://z.qyer.com/deal/98059/',
	'http://z.qyer.com/deal/101779/',
	'http://z.qyer.com/deal/81154/',
	'http://z.qyer.com/deal/104841/',
	'http://z.qyer.com/deal/104843/',
	'http://z.qyer.com/deal/78596/',
	'http://z.qyer.com/deal/54560/'
]

let result = []
let count = 0

urlList.forEach((url, i) => {
	getPageHTML(url, (html) => {
		const {window} = new JSDOM(html, { runScripts: "dangerously" })
		let pageData = window.__INITIAL_STATE__.renderData.data
		let obj = {}
		obj.title = pageData.info.title
		obj.price = pageData.info.price
		obj.image = pageData.info.pic
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

