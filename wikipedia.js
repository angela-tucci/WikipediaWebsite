//when the page loads..
$(document).ready(function() {
	//when the search button is clicked..
	$("#searchButton").on("click", function() {
		//call function to search for wiki articles
		searchWiki();
	});

	//when the enter button is pressed..
	$("#textToSearch").keyup(function(event) {
		if (event.keyCode == 13) {
			//make the search button click
			$("#searchButton").click();
			//deselect the text box to make scrolling through the page easier
			$("#textToSearch").blur();
		}
	});

	//when the random button is clicked..
	$("#randomArticle").click(function() {
		//open a new window with a random article
		window.open("https://en.wikipedia.org/wiki/Special:Random");
	});
});

//function to search for articles
function searchWiki() {
	//if the textbox isn't empty, do the search
	if ($("#textToSearch").val() != "") {
		//when the search button is clicked..
		$.ajax({
			url: "https://en.wikipedia.org/w/api.php",
			data: {
				action: "query",
				list: "search",
				srsearch: $("#textToSearch").val(),
				format: "json"
			},
			dataType: "jsonp",
			success: processResult
		});
	} else {
		//shake the textbox to show an error
		$("#textToSearch").effect("shake");
	}
}

//function to display the results
function processResult(apiResult) {
	//empty the div to allow more than one search
	$("#results").empty();

	if (apiResult.query.search.length > 0) {
		//show a header for the results
		$("#results").append(
			"<h2>Top " +
				apiResult.query.search.length +
				' results found for: "' +
				$("#textToSearch").val() +
				'"</h2>'
		);

		//for each result found..
		for (var i = 0; i < apiResult.query.search.length; i++) {
			//set the title to a variable
			var title = apiResult.query.search[i].title;
			//remove spaces from the title for the id
			var titleNoSpaces = title.replace(/\s/g, "");

			//create a new div with the formatted id
			var newDiv = $("<div id=" + titleNoSpaces + " class='results'></div>");
			//append the new div to the "results" div
			$("#results").append(newDiv);

			//append the title, link, and description of each search result to its own div
			$(newDiv).append(
				"<p><a target='_blank' href='https://en.wikipedia.org/wiki/" +
					title +
					"'>" +
					title +
					"</a></p><p>" +
					apiResult.query.search[i].snippet +
					" ...</p>"
			);
		}
		
		//scroll to the results
		$("html, body").animate({ scrollTop: $("#results").offset().top }, "slow");
		
	} else {
		$("#results").append(
			'<h2>No results found for: "' + $("#textToSearch").val() + '"</h2>'
		);
	}
}
