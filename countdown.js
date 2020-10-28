//COUNTDOWN HTML GAME - Started 9-3-2020 -- S. Matt Mangels

//---GAME OPTION VARIABLES---
//Letter frequency is weighted according to Dictionary frequency (1) by default
//For frequency in Texts instead change this from 1 to 0
const USE_DICTIONARY_FREQ = 1;
//How many total letters are in the "stack"
const LETTER_STACK_SIZE = 2500;

//The directory that contains the lists of words 
//Source for the list of words: https://github.com/dwyl/english-words
const WORD_LIST_FOLDER = 'wordlists/';
const WORD_POOL_FILE = "conundrum_word_pool.txt";

//Controls where found word URLs point to
const URL_LOOKUP_PREFIX = 'https://duckduckgo.com/?t=ffsb&q=define:';
//These control how long each round lasts (in seconds)
const LETTERS_GAME_TIME = 35;
const NUMBERS_GAME_TIME = 35;
const CONUNDRUM_GAME_TIME = 30;

//Explanations of the rules for each round
const LETTERS_ROUND_RULES = 'Select at least 3 vowels and at least 4 consonants, then find the longest word* you can make from the chosen letters.<br /><small>*Excludes proper nouns (place names, people&rsquo;s names, brands, etc.).</small>';
const NUMBERS_ROUND_RULES = '<strong>Select 6 numbers</strong> using any combination of numbers from the Top (25, 50, 75, 100) or the Bottom (1-10).';
const CONUNDRUM_ROUND_RULES = 'The letters below are an anagram of which word?';

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/*
var seven_letter_words = [];
var eight_letter_words = [];
var nine_letter_words = [];
*/
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
    //$("#letterbox").innerHTML = vowel_stack;
    //console.log(vowel_stack.length);
    //chosen_letters.length = 0;
    populate_numbers();
    chosen_nums = []; //Global on purpose
    let uw = document.getElementById("user_word");
    uw.oninput = function() {
        $("#uw_len").html(String(uw.value.length));
        valid_letters_input();
    }
    document.getElementById("c_answer").oninput = function() {
        con_answer_verify(); //RENAME THIS
    }
    //$("#whatround").css("display", "none");
}
function start_new_game() {
    //These two are global on purpose
    total_points = 0; 
    round = 1;
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
    //TEMP DEBUG!!!
    new_letters_round();
    //new_conundrum();

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
        //$("#selected_nums").html(repeatStr("<td>&nbsp;</td>", 6));
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