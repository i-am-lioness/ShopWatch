var images;

chrome.runtime.onConnect.addListener(function(port) {
  //console.assert(port.name == "knockknock");
  if(port.name == "knockknock")
	  port.onMessage.addListener(function(msg) {
		if (msg.joke == "Knock knock"){
		  port.postMessage({question: "Who's there?"});
		}else if (msg.answer == "Madame"){
			images = msg.images;

		
			chrome.extension.onConnect.addListener(function(port) {
				  console.log("Connected .....");
				  port.onMessage.addListener(function(msg) {
						console.log("message recieved"+ msg);
						//port.postMessage("Hi Popup.js");
						port.postMessage({method:"downloadImages",images:images});
				  });
				});

	  
		}
	  });
});



