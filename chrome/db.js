var tabID;
var images;

var shopWatch = {};
shopWatch.storage = {};

shopWatch.storage.db = null;

shopWatch.storage.open = function() {
  var version = 1;
  var request = indexedDB.open("todos", version);
  
  // We can only create Object stores in a versionchange transaction.
  request.onupgradeneeded = function(e) {
    var db = e.target.result;

    // A versionchange transaction is started automatically.
    e.target.transaction.onerror = shopWatch.storage.onerror;

    if(db.objectStoreNames.contains("todo")) {
      db.deleteObjectStore("todo");
    }

    var store = db.createObjectStore("todo",
      {keyPath: "timeStamp"});
  };

  request.onsuccess = function(e) {
    shopWatch.storage.db = e.target.result;
    // Do some more stuff in a minute
    shopWatch.storage.getAllTodoItems();
  };

  request.onerror = shopWatch.storage.onerror;
};

shopWatch.storage.addTodo = function(todoText, link) {
  var db = shopWatch.storage.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");
  var request = store.put({
    "text": todoText,
    "timeStamp" : new Date().getTime(),
    "link": link,
    "image": images[0]
  });

  request.onsuccess = function(e) {
    // Re-render all the todo's
    shopWatch.storage.getAllTodoItems();
  };

  request.onerror = function(e) {
    console.log(e.value);
  };
};

shopWatch.storage.getAllTodoItems = function() {
  var todos = document.getElementById("todoItems");
  todos.innerHTML = "";

  var db = shopWatch.storage.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");

  // Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false)
      return;

    renderTodo(result.value);
    result.continue();
  };

  cursorRequest.onerror = shopWatch.storage.onerror;
};

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
	item.append(itemLink);
	item.append(deleteButton);
  
  	if(row.image){ 
  		var imageNode = $("<img src='"+row.image+"'>");
  		item.append(imageNode);
	}
  
  $("#todoItems").append(item);
}

shopWatch.storage.deleteTodo = function(id) {
  var db = shopWatch.storage.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");

  var request = store.delete(id);

  request.onsuccess = function(e) {
    shopWatch.storage.getAllTodoItems();  // Refresh the screen
  };

  request.onerror = function(e) {
    console.log(e);
  };
};


function addTodo() {

    var itemName = $("#todo");
    shopWatch.storage.addTodo(itemName.val(),shopWatch.tabUrl);
    itemName.val('');
    
    /*
    chrome.tabs.executeScript({
    	file: 'scrap_images.js'
    	//code: 'alert("hi");'
  	});
*/
    //requestPageData(tabID);
    
    
  /*  
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "knockknock");
  port.onMessage.addListener(function(msg) {
    if (msg.joke == "Knock knock"){
      port.postMessage({question: "Who's there?"});
    }else if (msg.answer == "Madame"){
    	images = msg.images;
      //port.postMessage({question: "Madame who?"});
      
    }
  });
}); */

}


function init() {
  shopWatch.storage.open(); // open displays the data previously saved
  
  
  
  chrome.tabs.getSelected(null,function(tab) {
    shopWatch.tabUrl = tab.url;
    
    $("#todo").val(tab.title);
    tabID= tab.id;
});

  
  $("#addButton").click(addTodo);
  /*var bp = chrome.extension.getBackgroundPage();
  var images = returnImages();
  images.forEach(function(v){

		  $('#image_holder').append("<img src='"+v+"' width='50' height='50'>");
	});
  */
}

function get_page_images(){
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });
});
}


window.addEventListener("DOMContentLoaded", init, false);



function requestPageData(tabID){

	var port = chrome.tabs.connect(tabID, {name: "imagePort"});
	port.postMessage({request: "getImages"});
	port.onMessage.addListener(function(msg) {

		msg.images.forEach(function(v){

		  $('#image_holder').append("<img src='"+v+"' width='50' height='50'>");
		});


	});

}

chrome.runtime.onMessage.addListener(function(msg) {

		msg.images.forEach(function(v){

		  $('#image_holder').append("<img src='"+v+"' width='50' height='50'>");
		});

	});


var port = chrome.extension.connect({name: "Sample Communication"});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
        console.log("message recieved"+ msg);
        images = msg.images;
        msg.images.forEach(function(v){

		  $('#image_holder').append("<img src='"+v+"' width='50' height='50'>");
		});
});

