

function getPinButtonV2(){


	var pinButton = $('.addthis_button_pinterest_pinit').first();
	var url = pinButton.attr("pi:pinit:media")
	
	return `http:${url}`;
}

function getPinButton(){

		var pinButton = $("a[data-pin-href*=pinterest]").first();	
		var url = pinButton.attr("data-pin-href");

		if( !url) return null;
	
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
				if ((img.clientWidth > 250)&&(img.clientHeight > 250)) {
					var src = (img.src || ("http:" + img.srcset.split(" ")[0]));
					images.push(src);
				}
			}
		
			if (images.length < 1) {
				let pinImage = getPinButton() || getPinButtonV2();
				images.push(pinImage);
			}
  
			port.postMessage({info: "image_results", images: images});
		
		
		}else if (msg.answer == "Madame"){
			images = msg.images;
			
		}
	  });
});



