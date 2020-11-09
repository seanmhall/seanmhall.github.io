//COUNTDOWN HTML GAME - Started 9-3-2020 -- Sean Matthew Mangels Hall

//---GAME OPTION VARIABLES---
//Letter frequency is weighted according to Dictionary frequency (1) by default
//For frequency in Texts instead change this from 1 to 0
const USE_DICTIONARY_FREQ = 1;
//How many total letters are in the "stack"
const LETTER_STACK_SIZE = 2500;

//The directory that contains the lists of words 
//Source for the list of 7, 8, 9 letter words: https://github.com/dwyl/english-words
const WORD_LIST_FOLDER = 'wordlists/';
//The words for conundrums came from http://www.mieliestronk.com/wordlist.html
//Given that the 9 letter word list contains many obscure words that come from the sciences I felt it would be unrealistically difficult to use them for conundrums
const WORD_POOL_FILE = "conundrum_word_pool.txt"; 

//Controls where found word URLs point to
const URL_LOOKUP_PREFIX = 'https://duckduckgo.com/?t=ffsb&q=define:';
//These control how long each round lasts (in seconds)
var easy_mode = true;
const EASY_GAME_TIME = 45;
const HARD_GAME_TIME = 30;
//If you want different lengths for different rounds you can always change these to hard-coded values
LETTERS_GAME_TIME = (easy_mode) ? EASY_GAME_TIME : HARD_GAME_TIME;
NUMBERS_GAME_TIME = (easy_mode) ? EASY_GAME_TIME : HARD_GAME_TIME;
CONUNDRUM_GAME_TIME = (easy_mode) ? EASY_GAME_TIME : HARD_GAME_TIME;
//Explanations of the rules for each round
const LETTERS_ROUND_RULES = 'Select 9 letters: at least 3 vowels and at least 4 consonants, then find the longest word you can make from the chosen letters.';
const NUMBERS_ROUND_RULES = '<strong>Select 6 numbers</strong> using any combination of numbers from the Top (25, 50, 75, 100) or the Bottom (1-10). Use simple arithmetic (<strong>+, &ndash;, &times;, &#247;</strong>) to reach the target number.';
const CONUNDRUM_ROUND_RULES = 'The letters below are an anagram of which word?';

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function get_word_file(n) {
    return $.get(WORD_LIST_FOLDER + String(n) + '_words.txt');
}
function init() {
    //First value is text frequency, second value is dictionary frequency
    var letters = {
        "vowels": {
            "a": [8.2, 7.8],
            "e": [13, 11],
            "i": [7, 8.6],
            "o": [7.5, 6.1],
            "u": [2.8, 3.3]
        },
        "consonants": {
            "b": [1.5, 2],
            "c": [2.8, 4],
            "d": [4.3, 3.8],
            "f": [2.2, 1.4],
            "g": [2, 3],
            "h": [6.1, 2.3],
            "j": [0.15, 0.62],
            "k": [0.77, 0.97],
            "l": [4, 5.3],
            "m": [2.4, 2.7],
            "n": [6.7, 7.2],
            "p": [1.9, 2.8],
            "q": [0.095, 0.19],
            "r": [6, 7.3],
            "s": [6.3, 8.7],
            "t": [9.1, 6.7],
            "v": [0.98, 1],
            "w": [2.4, 0.91],
            "x": [0.15, 0.27],
            "y": [2, 1.6],
            "z": [0.074, 0.44]
        }
    };
    let vowel_stack = '';
    let consonant_stack = '';
    var vowels = letters["vowels"];
    var consonants = letters["consonants"];
    for (c in consonants) {
        let cfreq = consonants[c][USE_DICTIONARY_FREQ] * (LETTER_STACK_SIZE / 100);
        consonant_stack += repeatStr(c, cfreq);
    }
    for (v in vowels) {
        let freq = vowels[v][USE_DICTIONARY_FREQ] * (LETTER_STACK_SIZE / 100);
        vowel_stack += repeatStr(v, freq);
    }
    //Global on purpose
    shuffled_vowels = shuffle(vowel_stack);
    shuffled_consonants = shuffle(consonant_stack);
    populate_numbers();
    chosen_nums = []; //Global on purpose
    let uw = document.getElementById("user_word");
    uw.oninput = function() {
        $("#uw_len").html(String(uw.value.length));
        valid_letters_input();
    }
    document.getElementById("c_answer").oninput = function() {
        con_answer_verify();
    }
    //$("#whatround").css("display", "none");
    let difflevel = $('input[type=radio]');
    if ($("#hardmode").is(':checked')) {
    $("#rndlngth").html(String(HARD_GAME_TIME));
    }
    difflevel.change(function() {
        easy_mode = ($("#easymode").is(':checked')) ? true : false;
        let lenstr = (easy_mode) ? EASY_GAME_TIME : HARD_GAME_TIME;
        $("#rndlngth").html(String(lenstr));
    });
}
function start_new_game() {
    //(Re)set these variable
    total_points = 0; 
    round = 1;
    //Apply the difficuly settings the user has selected
    LETTERS_GAME_TIME = (easy_mode) ? EASY_GAME_TIME : HARD_GAME_TIME;
    NUMBERS_GAME_TIME = (easy_mode) ? EASY_GAME_TIME : HARD_GAME_TIME;
    CONUNDRUM_GAME_TIME = (easy_mode) ? EASY_GAME_TIME : HARD_GAME_TIME;
    //Prevent accidentally ending the game, say with the back button
    window.onbeforeunload = function() {
        return true;
    };
    //Hide the difficulty selector
    $("#difficulty_form").css("display", "none");
    $("#round_counter").html(String(round));
    document.getElementById('timer').className = '';
    $("#statsbox").css("visibility", "hidden");
    $("#explanation").html(LETTERS_ROUND_RULES);
    $("#explanation").css("visibility", "visible");
    $("#roundtype").html("Letters");
    //MOVE THE LINE BELOW--should be shown after Round 1 has ended
    $("#round_box").css("visibility", "visible");
    $("#round_box").css("display", "inline");
    $("#wrapper").css("width", "100%");
    $("#start_game_button").css("display", "none");
    $("#ruleslink").css("display", "none")
    //If a game is finished and user wants to play again
    $("#conundrum_game").css("display", "none");
    new_letters_round();

}

function next_round() {
    round = round + 1;
    $("#nextround").css("display", "none");
    $("#round_counter").html(String(round));
    $("#timer").css("visibility", "hidden");
    document.getElementById('timer').className = '';
    $("#target_num").css("display", "none");
    //*** CONUNDRUM ***
    if (round == 10) {
        $("#target_num").css("display", "none");
        $("#numbersgame").css("display", "none");
        new_conundrum();
    }
    else if (round == 3 || round == 6 || round == 9) {
        //*** NUMBERS ROUNDS ***
        $("#explanation").html(NUMBERS_ROUND_RULES);
        $("#roundtype").html("Numbers");
        $("#letters_game").css("display", "none");
        $("#selected_nums").html("");
        $("#bignumbers").html("<tbody><tr></tr></tbody>");
        $("#smallnumbers").html("<tbody></tbody>");
        $("#numbersgame").css("display", "block");
        $("#numbersgame_answer").css("display", "none");
        //Finally create the new board
        populate_numbers();
        $("#bignumbers").css("display", "block");
        $("#smallnumbers").css("display", "block");
    } else {
        ///*** LETTERS ROUNDS ***
        $("#letters_game").css("display", "block");
        $("#numbersgame").css("display", "none");
        new_letters_round();
        $("#explanation").html(LETTERS_ROUND_RULES);
        $("#roundtype").html("Letters");
    }

}

function end_LGT_timer() {
    LGT = 1;
}
function end_NGT_timer() {
    NGT = 1;
}
function end_CGT_timer() {
    CGT = 1;
}
$(function() {
    init();
    get_word_file(7).done(function(data) {
        seven_words_dict = new Set(data.split(/[\r\n]+/));
    });
    get_word_file(8).done(function(data) {
        eight_words_dict = new Set(data.split(/[\r\n]+/));
    });
    get_word_file(9).done(function(data) {
        nine_words_dict_arr = data.split(/[\r\n]+/); //Separate array for Conundrum round
        nine_words_dict = new Set(nine_words_dict_arr);
    });
});