function getHolidays(callback) {
	// Get the list of holidays via XMLHttpRequest
	var request = new XMLHttpRequest();
	
	request.onreadystatechange = function() {
		if(request.readyState === 4) {
			if(request.status === 200 || request.status === 0) {
				// Run callback function supplying the text if the file is retrieved
				if(typeof callback === "function") {
					callback(request.responseText);
				}
			}
		}
	}

	request.open("GET", "00-prices.txt", true);
	request.send();
}

function getNumberOfHolidays(location) {
	// Check you've entered something, because users can't be trusted
	if(location) {
		getHolidays(function(holidayText) { 
			var numberOfHolidays = 0;
			// Create an array with a line per element
			var lines = holidayText.split("\n");

			// Iterate over the lines, checking for the supplied location
			for(var i = 0; i < lines.length; i++) {
				lineElements = lines[i].split(" ");

				if(lineElements[2] == location) {
					numberOfHolidays++;
				}
			}
		
			// Notify the user of how many holidays there are at the supplied location
			if(numberOfHolidays) {
				alert("There are " + numberOfHolidays + " holidays available at " + location + ".");
			} else {
				alert("There are no holidays available at " + location + ".");
			}
		});
	} else {
		alert("Please enter a location!");
	}	
}

function getCheapestHoliday(surchargeAmountPaid) {
	//Check if the surcharge amount supplied is currency via regex, probably not bulletproof
	if(/^\d{1,3}?([,]\d{3}|\d)*?([.]\d{1,2})?$/.test(surchargeAmountPaid)) {
		getHolidays(function(holidayText) {
			// Split the text file into an array consisting of a line per element
			var lines = holidayText.split("\n");
			// Split the first line using a space delimiter
			var lineElements = lines[0].split(" ");
			/* Initialise the cheapest holiday at the maximum possible value so
			 * that sorting can commence */
			var cheapestHoliday = ["", Number.MAX_VALUE];
			/* Function to get the amount paid in surcharge. If the amount Auntie will
			 * pay is less than the surcharge required, the balance is returned, otherwise
			 * 0 is returned as Auntie covered the whole lot */
			function getSurcharge() {
				if(Number(lineElements[3]) - Number(surchargeAmountPaid) > 0) {
					return Number(lineElements[3]) - surchargeAmountPaid;
				} else {
					return 0;
				}	
			}

			/* Iterate over the lines array. If the price of the current holiday including
			 * the surcharge covered by auntie is less than the current cheapest holiday,
			 * set the cheapest holiday array to that. */
			for(var i = 0; i < lines.length; i++) {
				lineElements = lines[i].split(" ");
				
				
				if((Number(lineElements[1]) + getSurcharge()) < cheapestHoliday[1]) {
					cheapestHoliday[0] = lineElements[0];
					cheapestHoliday[1] = Number(lineElements[1]) + getSurcharge();
				}
			}
			
			// Notify the user of the cheapest holiday
			alert("The cheapest holiday has deal ID " + cheapestHoliday[0] + " and will cost £" 
				+ cheapestHoliday[1].toFixed(2) + " with up to £" + surchargeAmountPaid 
				+ " of the surcharge paid by your Aunt." );
		});
	} else {
		alert("Please enter a valid currency amount!");
	}	
}


//Event listeners, fire the functions when buttons are pressed
document.getElementById("submitlocation").addEventListener("click", function() {getNumberOfHolidays(document.getElementById("location").value)});
document.getElementById("submitsurcharge").addEventListener("click", function() {getCheapestHoliday(document.getElementById("surchargeamount").value)});
