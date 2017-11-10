const request = require('request')
const url = require('url')

var parsed = getParsedUrl('http://z.qyer.com/deal/87575/?debug=1', '115.182.69.215')

request({
	url: parsed.url,
	headers: {
		'Host' : parsed.host
	}
}, function (error, response, body) {

	/***
	An error when applicable (usually from http.ClientRequest object)
	An http.IncomingMessage object (Response object)
	The third is the response body (String or Buffer, or JSON object if the json option is supplied)
	***/

  if (!error && response.statusCode == 200) {

  }	
})


function getParsedUrl(requestUrl, host){
    if (requestUrl.indexOf("http") !== 0) {
        requestUrl = "http://" + requestUrl;
    };
    var urlInfo = url.parse(requestUrl);
    console.log(urlInfo)
    host = host || urlInfo.hostname;
    var ext = (urlInfo.port ? (":" + urlInfo.port) : "") + (urlInfo.pathname || "") + (urlInfo.query ? ("?" + urlInfo.query) : "");
    return {
        url: urlInfo.protocol + "//" + host + ext,
        host: urlInfo.hostname
    }
}