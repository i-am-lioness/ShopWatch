
var tabID;
var images;
var selectedThumbnail;


function renderTodo(row) {

  var deleteButton = $("<button>Delete</button>");
  deleteButton.click(function(){
    shopWatch.storage.deleteTodo(row.timeStamp);
	});
	
	  var itemLink = $("<a href='#'>"+row.text+"</a>");
  itemLink.click(function(){	
	chrome.tabs.create({ url: row.link });
	});

	
	
	
	var item = $("<li> </li>");
	item.css("background-image","url("+row.image+")");
  	//item.append("<img src='"+row.image+"'>");
	item.append(itemLink);
	item.append(deleteButton);

	
  
  $("#todoItems").prepend(item);
}

function addTodo() {

	var img_src = selectedThumbnail;
    var itemName = $("#item-name");
    shopWatch.storage.addTodo(itemName.val(),shopWatch.tabUrl, img_src);
    itemName.val('');

}


function init() {
  shopWatch.storage.open(); // open displays the data previously saved
  
  
  
  chrome.tabs.getSelected(null,function(tab) {
    shopWatch.tabUrl = tab.url;
    
    $("#item-name").val(tab.title);
    tabID= tab.id;
    
    connectToPage(tab.id);
});

  
  $("#addButton").click(addTodo);

}


window.addEventListener("DOMContentLoaded", init, false);


function connectToPage(tabId){
	var port = chrome.tabs.connect(tabId, {name: "imageChannel" });
	port.postMessage("content_request_init");
	port.onMessage.addListener(function(msg) {
		
			if (msg.info=="image_results"){
				images = msg.images;
				msg.images.forEach(function(v){
				
					var thumbnail = $("<img src='"+v+"' width='50' height='50'>");
					thumbnail.hover(
						function(){
							$( this ).addClass("highlight");
						},
						
						function(){
							$( this ).removeClass("highlight");
						}
					);
					thumbnail.click(function (){
						$(".selected").removeClass("selected");
						selectedThumbnail=$( this ).attr("src");
						$( this ).addClass("selected");
						//addTodo(v);
						});
					thumbnail.prependTo("#found-images");
				});
			}
	});

}
