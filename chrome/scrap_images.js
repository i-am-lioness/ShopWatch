

function getPinButton(){

	//var pinButton = $("a[href*=pinterest.com/pin/create/button").first();
/*	var pinButton = $("a[href*=pinterest]").first();
	
	var url = pinButton.attr("href");
	
	if(!url){
	*/
	
		var pinButton = $("a[data-pin-href*=pinterest]").first();	
		var url = pinButton.attr("data-pin-href");
	
	//}
	
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



chrome.runtime.onConnect.addListener(function(port) {
  if(port.name == "imageChannel")
	  port.onMessage.addListener(function(msg) {
		if (msg == "content_request_init"){
		
		
			var images = [];
		
			for(var i = 0; i < document.images.length; i++){
				img=document.images[i];
				if ((img.clientWidth > 200)&&(img.clientHeight > 200))
					images.push(document.images[i].src);
			}
		
			if (images.length < 1)
				images.push(getPinButton());
  
			port.postMessage({info: "image_results", images: images});
		
		
		}else if (msg.answer == "Madame"){
			images = msg.images;
			
		}
	  });
});



