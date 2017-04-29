var statusPromises = [];
var existPromises = [];
var streams = [];
$(document).ready(function(){
	// Retrieve saved streams and add them.
	for (var i = 0; i < localStorage.length; i++){
		checkStatus(localStorage.key(i));
	}
	// Default streams.
	checkStatus("monstercat");
	checkStatus("1234567890123456789012");


	// <-- PROMISE RESOLUTION HANDLER -->
	// When all requests resolve, add online streams first, then offline streams.
	$.when.apply($, statusPromises).done(function(){
		// INEFFICIENT
		// Iterate through online streams.
		streams.forEach(function(stream){
			if (stream.status == "online"){
				setPage(stream);
			}
		});
		// Iterate through offline and not-found streams.
		streams.forEach(function(stream){
			if (stream.status != "online"){
				checkExistance(stream);
			}
		});

		// When exist checks resolve, iterate through offline and not-found streams.
		$.when.apply($, existPromises).done(function(){
			// Iterate through offline streams.
			streams.forEach(function(stream){
				if (stream.status == "offline"){
					setPage(stream);
				}
			});
			// Iterate through not-found streams.
			streams.forEach(function(stream){
				if (stream.status == "not found"){
					setPage(stream);
				}
			});
		});
	});
	// <-- END PROMISE RESOLUTION HANDLER -->


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
		checkStatus(streamer);

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
		checkStatus(streamer);

		// Clean.
		$(this).val("");
		$("#myModal").modal('hide');
		}
	});
	// <-- END EVENT HANDLERS -->
});

function checkStatus(name){
	endpoint = `https://wind-bow.glitch.me/twitch-api/streams/`; // Twitch API bypass endpoint for stream data.
	var url = `${endpoint}${name}?callback=?`; // URL query.

	// Check stream status.
	statusPromises.push(jQuery.getJSON(url, function(json){
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
			});
		}
	}));
}

function checkExistance(stream){
	endpoint = `https://wind-bow.glitch.me/twitch-api/channels/`; // Twitch API bypass endpoint for channel data.
	var url = `${endpoint}${stream.user}?callback=?`; // URL query.

	existPromises.push(jQuery.getJSON(url, function(json){
		if (json.error == "Not Found"){ // Channel doesn't exist.
			stream.status = "not found";
		}
		else{ // Channel exists.
			stream.status = "offline";
		}
	}));
}

function setPage(stream){
	if (stream.status == "online"){
		$(".row").append(`
			<div class="col-lg-4">
				<div class="card" style="background-image: url(${stream.preview}); background-size: cover;" onclick="parent.open('http://twitch.tv/${stream.user}')">
					<div class="card-block" style="background-color: rgba(103,58,183,0.5);"> 
						<h3 class="card-title text-left">${stream.user}</h3>
						<div>
							<p class="card-subtitle text-left"><strong>Viewers</strong>: ${stream.viewers}</p>
							<p class="card-subtitle text-left"><strong>Game</strong>: ${stream.game}</p>
						</div>
						<p><strong>Streaming: </strong>${stream.title}</p>
					</div>
				</div>
			</div>`);
	}
	else if (stream.status == "offline"){
		$(".row").append(`
			<div class="col-lg-4">
				<div class="card">
					<div class="card-block" style="background-color: rgb(50,50,50);" onclick="parent.open('http://twitch.tv/${stream.user}')">
						<h3 class="card-title text-left">${stream.user}</h3>
						<p id="offline"><strong>Offline</strong></p>
					</div>
				</div>
			</div>`);
	}
	else{
		$(".row").append(`
			<div class="col-lg-4">
				<div class="card">
					<div class="card-block" style="background-color: rgb(50,50,50); background-image: url(resources/imgs/notfound.png); background-size: cover;" onclick="parent.open('http://twitch.tv/${stream.user}')">
						<h3 class="card-title text-left">${stream.user}</h3>
						<p id="offline"><strong>Not Found</strong></p>
					</div>
				</div>
			</div>`);
	}
}
