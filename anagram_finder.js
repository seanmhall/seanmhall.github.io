//JavaScript Anagram Finder - 10-23-2020

sixes = []; threes = []; fours = []; fives = []; nines = [];

//First argument must be 9 letters
//Second arg determines whether it returns 4/5 or 3/6 subword anagrams
//Set fourfives to false to get 3/6 anagrams
//Optional final arg is for DEBUG ONLY! Shows hyphen betweens subwords for readability
function find_anagrams(chars, fourfiveanagrams, SHOW_HYPHEN) {
    SHOW_HYPHEN = SHOW_HYPHEN || false;
    if (chars.length !== 9) { 
        console.log('LENGTH ERROR! String is '+String(chars.length)+' chars long.');
        return; 
    }
    var firstwordlength = (fourfiveanagrams) ? 4 : 3;
    var secondwordlength = (fourfiveanagrams) ? 5 : 6;
    var hyphen = (SHOW_HYPHEN) ? '-' : '';
    var all_permutations = permute(chars);
    //All the 3 or 4 letter permutations you can make with the input
    var first_perm_group = new Set(all_permutations.map(v => v.slice(0, firstwordlength-9)));
    ///All of of the 5/6 letter permutations
    var second_perm_group = new Set(all_permutations.map(v => v.slice(0, secondwordlength-9)));
    //Determine which set of words we'll be working with
    var first_word_list = (firstwordlength === 4) ? fours : threes;
    var second_word_list = (secondwordlength === 5) ? fives : sixes;
    var first_set = new Set(first_word_list);
    var second_set = new Set(second_word_list);
    //Find the intersections of two groups of sets: the dictionary words and the n-letter permutations
    var found_firstgroup = new Set([...first_set].filter(x => first_perm_group.has(x)));
    var found_secondgroup = new Set([...second_set].filter(x => second_perm_group.has(x)));
    var sorted_chars = sort_string(chars);
    var word_pairs = []; //The array we'll be returning
    //Loop through the sub-words we've found we can make with the input word's letters
    //Some if statements are necessary to remove unwanted word combos related to compound words
    //For example, we don't want "lifeblood" being turned into "bloodlife"--way too easy!!
    for (found_first of found_firstgroup) {
        if (chars.slice(0, firstwordlength) === found_first || chars.slice(secondwordlength, 9) == found_first) {
            continue;
        }
        for (found_second of found_secondgroup) {
            if (chars.slice(firstwordlength, 9) === found_second) {
                continue;
            }
            let combined = found_first+found_second;
            if (sorted_chars != sort_string(combined) || combined === chars) {
                continue;
            }     
            else {
                word_pairs.push(found_first+hyphen+found_second);
            }
        }
    }
    for (fsecond of found_secondgroup) {
        if (fsecond == chars.slice(firstwordlength, 9)) continue;
        for (ffirst of found_firstgroup) {
            let combined = fsecond+ffirst;
            if (sorted_chars !== sort_string(combined) || combined === chars) {
                 continue;
            }
            else {
                word_pairs.push(fsecond+hyphen+ffirst);
            }
        }
    }
    //Turn the array into a Set to remove duplicates, then turn it back into an array
    return Array.from(new Set(word_pairs));
}