function select_number(n) {
	//If there are already 6 numbers selected don't select any more
	if (chosen_nums.length == 6) return;
	//If no Big Numbers have been selected
	if (n <= 10 && chosen_nums.length == 5 && !bignum_selected) {
		alert("You must select at least one large number from the top row!");
		return;
	}
	//Add the selected number to our array and display it on the page
	chosen_nums.push(n);
	$("#selected_nums").append('<td>'+n+'</td>');
	//Enable the "Start Puzzle" button now that 6 numbers have been selected
	if (chosen_nums.length == 6) start_numbers_game();
}

function populate_numbers() {
	bignum_selected = false;
	var smallnums = shuffle([1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]);
	var largenums = shuffle([25,50,75,100]);
	var lnhtml = '';
	var snhtml = '<tr>';
	var bn = document.getElementById("bignumbers").getElementsByTagName('tr')[0];
	for (let i=0;i<largenums.length;i++) {
		let random_num = largenums[i];
		let buffer = (random_num < 100) ? '&nbsp;' : '';
		let newcell = document.createElement('td');
		newcell.innerHTML = '<span>'+buffer+random_num+'</span>';
		newcell.className = 'face_down';
		newcell.onclick = function () {
			select_number(random_num);
			this.className = 'face_up';
			bignum_selected = true;
			$(this).prop("onclick", null).off("click");
		}
		bn.appendChild(newcell);
		//lnhtml += '<td onclick="function(){select_number('+random_num+');"><span>'+buffer+random_num+'</span></td>';
	}
	for (let i=0;i<smallnums.length;i++) {
		let srandom_num = smallnums[i];
		let sbuffer = (srandom_num < 10) ? '&nbsp;' : '';
		let oc = "select_number("+srandom_num+");this.className='face_up';$(this).prop('onclick', null).off('click');";
		snhtml += '<td class="face_down" onclick="'+oc+'"><span>'+sbuffer+srandom_num+'</span></td>';
		if (i == 4 || i == 9 || i == 14) snhtml += '</tr><tr>';
	}
	//document.getElementById("bignumbers").getElementsByTagName('tr')[0].innerHTML = lnhtml;
	document.getElementById("smallnumbers").getElementsByTagName('tbody')[0].innerHTML = snhtml+'</tr>';
}

var NGT = NUMBERS_GAME_TIME;

function ngt_tick() {
	NGT = NGT-1; //Take one second off the clock
	if (NGT == 9) document.getElementById('timer').className = 'boldtimer';
	$("#timer").html(NGT); //Display the new time
	//Let player know time has run out and stop the clock
	if (NGT < 1) {
		window.clearInterval(ntimer);
		chosen_nums = [];
		let uscore = $("#user_number").val();
		if (uscore == '') uscore = 0;
		let points;
		let diff = Math.abs(uscore-randnum); //Absolute Value
		if (diff === 0) points = 10; //10 for reaching it exactly
		else if (diff >= 1 && diff <=5) points = 7; //7 for being 1–5 away
		else if (diff >=6 && diff <=10) points = 5; //5 for being 6–10 away
		else points = 0; //Contestants score no points for being more than 10 away
		total_points += points;
		alert("Time's up!\nYou scored "+String(points)+" points.");
		$("#timer").css("visibility", "hidden");
		$("#numbersgame_answer").css("display", "none");
		$("#points_counter").html(total_points);
		$("#nextround").css("display", "inline");
		//Reset the timer so it's ready for the next time it's to be used
		NGT = NUMBERS_GAME_TIME;
	}
}

function start_numbers_game() {
	//First put the time on the board
	$("#timer").html(NUMBERS_GAME_TIME);
	$("#timer").css("visibility", "visible");
	//Then generate our Target Number and make it a global variable
	randnum = getRndInteger(100, 999);
	//Display this number on the page
	$("#target_num").html(String(randnum));
	//Hide the number selection tables since they're no longer needed
	$("#bignumbers").css("display", "none");
	$("#smallnumbers").css("display", "none");
	$("#target_num").css('display', 'block');
	//Make sure the input field is blank and visible
	$("#user_number").val("");
	$("#numbersgame_answer").css("display", "block");
	//And finally start the clock ticking!
	ntimer = window.setInterval(ngt_tick, 1000);
}
function new_numbers_game() {
	//Set every TD's class name back to "face_down"
	//Clear target number
	console.log("coming soon!");
	$("#n_timer").html(NUMBERS_GAME_TIME);
}