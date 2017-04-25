tracked_streams = [];
$(document).ready(function(){
	getData("destiny");
	getData("monstercat");
	getData("1234567890123456789012");

	// "Add stream" button on page.
	$("#new").on("click", function(){
		$("#myModal").modal('show');
	});

	// "Add" button on modal.
	$("#add").on("click", function(){
		// Get input.
		var streamer = $("#stream-add").val();
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
	jQuery.getJSON(url, function(json){
		
		if(json.stream != null){ // If stream is online.
			// var game = json.stream.game.length <= 14 ? json.stream.game : json.stream.game.slice(0,12) + "...";

			// Shorten titles with length > 75 or unspaced length > 35. 
			// var status = (json.stream.channel.status.length <= 75 && json.stream.channel.status.split(" ").sort(function(a,b){return a.length - b.length})[0].length <= 35 ? json.stream.channel.status : json.stream.channel.status.slice(0,32) + "...");

			// Build Page.
			$(".row").append(`
				<div class="col-lg-4">
					<div class="card" style="background-image: url(${json.stream.preview.large}); background-size: cover;" onclick="parent.open('http://twitch.tv/${name}')">
						<div class="card-block" style="background-color: rgba(103,58,183,0.5);"> 
							<div class="card-top title">
								<h3 class="card-title text-left">${name}</h3>
							</div>
							<div class="card-top subtitle">
								<p class="card-subtitle text-left"><strong>Viewers</strong>: ${json.stream.viewers}</p>
								<p class="card-subtitle text-left"><strong>Game</strong>: ${json.stream.game}</p>
							</div>
							<p><strong>Streaming: </strong>${json.stream.channel.status}</p>
						</div>
					</div>
				</div>`);
		}
		
		else{ // If stream is offline.
			$(".row").append(`
				<div class="col-lg-4">
					<div class="card">
						<div class="card-block" style="background-color: rgb(50,50,50);">
							<h3 class="card-title text-left">${name}</h3>
							<p id="offline"><strong>Offline</strong></p>
						</div>
					</div>
				</div>`);	
		}
	});
}
