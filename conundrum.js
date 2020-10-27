function new_conundrum() {
	$("#conundrum_game").css("display", "block");
	$("#roundtype").html("Conundrum");
	$("#explanation").html(CONUNDRUM_ROUND_RULES);
	$("#timer").css("visibility", "visible");
	$("#timer").html(String(CONUNDRUM_GAME_TIME));
	CGT = CONUNDRUM_GAME_TIME;
	var grams;
	//Find a word and create an anagram of it
	$.get(WORD_POOL_FILE).done(function(data) {
	//Assemble our arrays 3,4,5,6 and 9 letter words
	//This group of 9 letter words is smaller than the rather expansive list used for the letters rounds
	//The pool of 9 letter words for conundrums is almost 8,000 words.
	word_list = data.split(/[\r\n]+/);
	for (word of word_list) {
		//word = word.replace(/\s/gi, '');
		switch(word.length) {
			case 3:
				threes.push(word);
				break;
			case 4:
				fours.push(word);
				break;
			case 5:
				fives.push(word);
				break;
			case 6:
				sixes.push(word);
				break;
			case 9:
				nines.push(word);
				break;
			default:
				break;
		}
	}

	let conundrum_found = false;
	chosenword = '';
	while (conundrum_found === false) {
		chosenword = nines[Math.floor(Math.random() * nines.length)];
		let fourfive_subwords = (Math.random() < 0.5); //Boolean that determines 4-5 vs 3/6 anagrams
		let tmp = find_anagrams(chosenword, fourfive_subwords);
		grams = (tmp === []) ? grams = find_anagrams(chosenword, !fourfive_subwords) : tmp;
		//Once we've found something, we can stop looking
		if (grams.length > 1) { conundrum_found = true; }
	}
	random_gram = grams[Math.floor(Math.random() * grams.length)];
	let scram = random_gram.split('');
	let chtml = '';
	for (let i=0;i<9;i++) {
		chtml += '<td>'+scram[i]+'</td>';
	}
	$("#conundrum_game form").css("display", "block");
	$("#c_answer").val("");
	$("#conundrum_game p").css("display", "none");
	$("#con_letters").html(chtml); //Display the scrambled letters
	$("#con_table").css("display", "block");
	$("#timer").html(CGT); //Put time on the board
	ntimer = window.setInterval(cgt_tick, 1000); //Start the clock ticking
});
}

function cgt_tick() {
	CGT = CGT-1; //Take one second off the clock
	if (CGT == 9) document.getElementById('timer').className = 'boldtimer';
	$("#timer").html(CGT); //Display the new time
	//Let player know when time has run out and stop the clock
	if (CGT < 1) {
		window.clearInterval(ntimer);
		let c_answer = $("#c_answer").val();
		let c_score = (chosenword == c_answer) ? 10 : 0;
		total_points += c_score;
		alert("Time's up!\nYou scored "+String(c_score)+" points.");
		$("#points_counter").html(total_points);
		//Now show the answer
		let tmphtml = '';
		for (var cwletter of chosenword.split('')) {
			tmphtml += `<td>${cwletter}</td>`;
		}
		/*let cwltrs = chosenword.split('');
		let tmphtml = '';
		for (let i=0;i<9;i++) {
			tmphtml += '<td>'+cwltrs[i]+'</td>';
		}*/
		$("#con_letters").html(tmphtml);
	}
}

function con_answer_verify() {
	let c_answer = $("#c_answer").val();
	let cwltrs = chosenword.split('');
	let ultrs = c_answer.split('');
	cwltrs.sort();
	ultrs.sort();
	let cal = document.getElementById("conundrum_answer_length");
	let lengthstr = String(ultrs.length);
	cal.innerHTML = lengthstr;
	cal.className = (cwltrs.join('') == ultrs.join('')) ? "cal_good" : "cal_nogood";
}