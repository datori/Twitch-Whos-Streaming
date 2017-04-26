var promises = [];
var streams = [];
$(document).ready(function(){
	// Retrieve saved streams and add them.
	for (var i = 0; i < localStorage.length; i++){
		getData(localStorage.key(i));
	}

	// Default streams.
	getData("destiny");
	getData("monstercat");
	getData("1234567890123456789012");

	// When all requests resolve, add online streams first, then offline streams.
	$.when.apply($, promises).done(function(){
		// INEFFICIENT
		streams.forEach(function(stream){
			if (stream.status == "online"){
				setPage(stream);
			}
		});
		streams.forEach(function(stream){
			if (stream.status == "offline"){
				setPage(stream);
			}
		});
	});


	// <-- EVENT HANDLERS -->
	// "Add stream" button on page.
	$("#new").on("click", function(){
		$("#myModal").modal('show');
	});

	// "Add" button on modal.
	$("#add").on("click", function(){
		// Get input.
		var streamer = $("#stream-add").val();

		// Add stream to list.
		localStorage.setItem(streamer, "0");
		getData(streamer);

		// Clean.
		$("#stream-add").val("");
		$("#myModal").modal('hide');
	});

	// Submit search on 'enter' press.
	$("#stream-add").keypress(function(e){
		if(e.which == 13){
		// Get input.
		var streamer = $(this).val();

		// Add stream to list.
		localStorage.setItem(streamer, "0");
		getData(streamer);

		// Clean.
		$(this).val("");
		$("#myModal").modal('hide');
		}
	});
});

function getData(name){
	endpoint = `https://wind-bow.glitch.me/twitch-api/streams/`; // Twitch API bypass endpoint.
	url = `${endpoint}${name}?callback=?`; // URL query.

	// Add data to page.
	promises.push(jQuery.getJSON(url, function(json){
		if(json.stream != null){ // If stream is online.
			streams.push({
				user: name,
				status: "online",
				viewers: json.stream.viewers,
				game: json.stream.game,
				title: json.stream.channel.status,
				preview: json.stream.preview.large});
		}
		else{ // If stream is offline.	
			streams.push({
				user: name,
				status: "offline"});
		}
	}));
}

function setPage(stream){
	if (stream.status == "online"){
		$(".row").append(`
			<div class="col-lg-4">
				<div class="card" style="background-image: url(${stream.preview}); background-size: cover;" onclick="parent.open('http://twitch.tv/${stream.name}')">
					<div class="card-block" style="background-color: rgba(103,58,183,0.5);"> 
						<div class="card-top title">
							<h3 class="card-title text-left">${stream.user}</h3>
						</div>
						<div class="card-top subtitle">
							<p class="card-subtitle text-left"><strong>Viewers</strong>: ${stream.viewers}</p>
							<p class="card-subtitle text-left"><strong>Game</strong>: ${stream.game}</p>
						</div>
						<p><strong>Streaming: </strong>${stream.title}</p>
					</div>
				</div>
			</div>`);
	}
	else{
		$(".row").append(`
			<div class="col-lg-4">
				<div class="card">
					<div class="card-block" style="background-color: rgb(50,50,50);">
						<h3 class="card-title text-left">${stream.user}</h3>
						<p id="offline"><strong>Offline</strong></p>
					</div>
				</div>
			</div>`);
	}
}
