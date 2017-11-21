const http = require('http')
const url = require('url')


let options = {
	host: '115.182.69.215',	
	path: '/deal/66927/?debug=1',
	headers : {
		'Host' : 'z.qyer.com'
	}
}

http.get(options, res => {

 //    console.log("Connected");
 //    res.on('data',function(data){
 //        console.log(data);
 //    });

 	var chunks = [];
    res.on('data', function(chunk) {
        chunks.push(chunk)
    });
    res.on('end', function() {
        var source = chunks.toString()
        console.log(source)
    });


})



