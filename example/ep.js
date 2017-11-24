/***
  
  【例子1】
  利用request模块，获取mock数据，直接写到项目中的文件里
  执行命令：
  node example/ep > /Users/ming/u8qyer/project/fe-ssr-zworld/src/project/mocks/web-detail-mock.js

***/


const request = require('request')
const url = require('url')

let host = '115.182.69.215'
let pageUrl = 'http://z.qyer.com/deal/107905/?debug=1'
let parsed = getParsedUrl(pageUrl, host)

/**
parsed 例子：
{ url: 'http://115.182.69.215/deal/107905/?debug=1',
  host: 'z.qyer.com' }
**/

request({
	url: parsed.url, 
	headers: {
		'Host' : parsed.host
	}
}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('module.exports = ' + JSON.stringify(JSON.parse(body), null, 2))
  }	
})


function getParsedUrl(requestUrl, host){
    if (requestUrl.indexOf("http") !== 0) {
        requestUrl = "http://" + requestUrl;
    };
    var urlInfo = url.parse(requestUrl);
    host = host || urlInfo.hostname;
    var ext = (urlInfo.port ? (":" + urlInfo.port) : "") + (urlInfo.pathname || "") + (urlInfo.query ? ("?" + urlInfo.query) : "");
    return {
        url: urlInfo.protocol + "//" + host + ext,
        host: urlInfo.hostname
    }
}

