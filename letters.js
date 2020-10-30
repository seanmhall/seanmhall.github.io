
//Takes 9 letter string as input and returns Object containing three arrays
//These arrays will contain all 7, 8, and 9 letter words that can be formed from the given letters
function check_for_solutions(letters) {
    var outhtml = '';
    let foundwords = {};
    //First, get all the possible permutations of our input string
    let perms = permute(letters);
    let nineperms = new Set(perms);
    let eightperms = new Set(perms.map(v => v.slice(0, -1)));
    let sevenperms = new Set(perms.map(v => v.slice(0, -2)));
    //We compare these Sets of permutations with the Sets of words from the dictionary
    let nine_isect = new Set([...nine_words_dict].filter(x => nineperms.has(x)));
    foundwords["Nine"] = Array.from(nine_isect);
    let eight_isect = new Set([...eight_words_dict].filter(x => eightperms.has(x)));
    foundwords["Eight"] = Array.from(eight_isect);
    let seven_isect = new Set([...seven_words_dict].filter(x => sevenperms.has(x)));
    foundwords["Seven"] = Array.from(seven_isect);
    //Then it's a matter of formatting...
    for (let wordlength in foundwords) {
        let current = foundwords[wordlength];
        if (current.length < 1) continue;
        outhtml += '<li><strong>' + wordlength + ': </strong>';
 
        for (let i = 0; i < current.length; i++) {
            let w = current[i];
            let comma = (i === current.length-1) ? '' : ', ';
            outhtml += '<a href="' + URL_LOOKUP_PREFIX + w + '"  target="_blank">' + current[i] + '</a>'+comma;
        }
        outhtml += '</li>';
    }
    if (outhtml == '') $("#result_words").html('<li>No 7+ letter words found!</li>');
    else $("#result_words").html(outhtml);

}
var LGT = LETTERS_GAME_TIME;

function lgt_tick() {
    LGT = LGT - 1; //Take one second off the clock
    if (LGT == 9) {
        document.getElementById('timer').className = 'boldtimer';
    }
    $("#timer").html(LGT); //Display the new time & make sure it's visible
    //Let player know time has run out and stop the clock
    if (LGT < 1) {
        window.clearInterval(ltimer);
        $("#result_words").css("display", "block");
        let uword = $("#user_word").val().toLowerCase().replace(' ', '');
        //Contestant receives 18 points if they make a 9 letter word
        //let letterscore = (uword.length == 9) ? 18 : uword.length;
        let time_up_msg = "Time's up!\n";
        let letterscore;

        if (isvalid) {
        switch (uword.length) {
            case 7:
            letterscore = (seven_words_dict.has(uword)) ? 7 : 0;
            break;
            case 8:
            letterscore = (eight_words_dict.has(uword)) ? 8 : 0;
            break;
            case 9:
            letterscore = (nine_words_dict.has(uword)) ? 18 : 0;
            break;
            default:
            letterscore = uword.length;
        }
        if (uword.length >= 7 && letterscore < 1) {
            time_up_msg += uword+" was not found in the dictionary.\n"
        }
    }
    else {
        letterscore = 0;
        time_up_msg += "The answer you submitted doesn't match the letters selected.\n";
    }
        time_up_msg += "You scored " + String(letterscore) + " points.";
        alert(time_up_msg);
        $("#timer").css("visibility", "hidden");
        total_points += letterscore;
        //Show the number of points
        $("#statsbox").css("visibility", "visible");
        $("#points_counter").html(total_points);
        $("#nextround").css("display", "block");
        //Finally, show the user what possible 7+ words, if any, can be formed from the letters
        check_for_solutions(chosen_letters);
}
}

chosen_letters = '';
consonant_count = 0;
vowel_count = 0;

function random_letter(isVowel = false) {
    if (chosen_letters.length >= 9) return;
    if (isVowel) {
        var letter = shuffled_vowels[Math.floor(Math.random() * shuffled_vowels.length)];
    } else {
        var letter = shuffled_consonants[Math.floor(Math.random() * shuffled_consonants.length)];
    }
    letterbox.getElementsByTagName('tr')[0].innerHTML += '<td>' + letter + '</td>';
    chosen_letters += letter;

    if (isVowel) { vowel_count += 1; }
    else { consonant_count += 1; }

    if (vowel_count == 5) { $("#vowel_button").attr("disabled", true); }
    if (consonant_count == 6) { $("#consonant_button").attr("disabled", true);} 
    if (chosen_letters.length == 9) {
        //Hide letter selection buttons
        $("#consonant_button").css("display", "none");
        $("#vowel_button").css("display", "none");
        alert("You have "+NUMBERS_GAME_TIME+" seconds to make the longest word you can with these letters.\nGood luck!");
        //Put time on the board
        $("#timer").css("visibility", "visible");
        $("#timer").html(String(LETTERS_GAME_TIME));
        ltimer = window.setInterval(lgt_tick, 1000);
        //Make sure the input field is blank and visible
        $("#user_word").val("");
        $("#letters_game form").css("display", "block"); 
    }
}

occurences_of = function (needle, haystack) {return haystack.split(needle).length - 1;}
isvalid = true;
//Returns True or False
function valid_letters_input() {
    let user_ltrs_str = $("#user_word").val().toLowerCase();
    let user_ltrs = user_ltrs_str.split('');
    let uw_len_color = "#37920d";
    isvalid = true;
    for (let i=0;i<user_ltrs.length;i++) {
        let current_letter = user_ltrs[i];
        var too_many_letters = (occurences_of(current_letter, user_ltrs_str) > occurences_of(current_letter, chosen_letters));
        let invalid_letter = (chosen_letters.indexOf(current_letter) < 0);
        if (invalid_letter || too_many_letters) {
            uw_len_color = "#8B0000";
            isvalid = false;
            break;
        }
    }
    $("#uw_len").css("color", uw_len_color);
}

function new_letters_round() {
    LGT = LETTERS_GAME_TIME;
    chosen_letters = '';
    //Reset the number of Consonants and Vowels too
    consonant_count = 0;
    vowel_count = 0;

    //Make sure both Letter selection buttons are enabled in case one of them isn't
    $("#consonant_button").attr("disabled", false);
    $("#vowel_button").attr("disabled", false);
    $("#consonant_button").css("display", "inline");
    $("#vowel_button").css("display", "inline");
    $("#letters_game").css("display", "block");
    $("#letterbox").html("<tbody><tr></tr></tbody>");
    $("#result_words").html("<li style='list-style-type: none;'><img src='loading.webp' height='32' width='32' alt='Loading' class='spinner' />&nbsp;&nbsp;Checking for possible solutions...</li>");
    $("#result_words").css("display", "none");
    $("#user_word").val("");
    $("#uw_len").html("");
    $("#target_num").css("display", "none");
    $("#letters_game form").css("display", "none");
}


