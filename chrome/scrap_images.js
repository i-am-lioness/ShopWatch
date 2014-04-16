
//console.log('Called scrap images');

//debugger;

//alert('content script');

/*
var images = [];
for(var i = 0; i < document.images.length; i++){
  images.push(document.images[i].src);
}


chrome.runtime.sendMessage({method:"downloadImages",images:images});

*/

/*
var images = $("img");

var images = $("img").filter(function(){
	var width = $(this).width();
	var height = $(this).height();
	return ((height>50)&&(width>50));
});

chrome.runtime.sendMessage({method:"downloadImages",images:images});
*/

/*

var images = [];
var img;
for(var i = 0; i < document.images.length; i++){
	img=document.images[i];
	if ((img.clientWidth > 200)&&(img.clientHeight > 200))
		images.push(document.images[i].src);
}

chrome.runtime.sendMessage({method:"downloadImages",images:images});

*/
/*
chrome.runtime.onConnect.addListener(function(port) {

  console.assert(port.name == "imagePort");
  port.onMessage.addListener(function(msg) {
  
    if (msg.request == "getImages"){

		
    
    }
      
  });
  
});

*/

var port = chrome.runtime.connect({name: "knockknock"});
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {

	if (msg.question == "Who's there?"){
  
  		var images = [];
  		
  		for(var i = 0; i < document.images.length; i++){
			img=document.images[i];
			if ((img.clientWidth > 200)&&(img.clientHeight > 200))
				images.push(document.images[i].src);
		}
		
		if (images.length < 1)
			images.push(getPinButton());
  
    	port.postMessage({answer: "Madame", images: images});
    
    }
});


function getPinButton(){

	//var pinButton = $("a[href*=pinterest.com/pin/create/button").first();
	var pinButton = $("a[href*=pinterest]").first();
	
	var url = pinButton.attr("href");
	
	var params = getJsonFromUrl(url);
	
	return params["media"];
}

function getJsonFromUrl(url) {
  var query = url.split("?")[1];
  var data = query.split("&");
  var result = {};
  for(var i=0; i<data.length; i++) {
    var item = data[i].split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  }
  return result;
}
