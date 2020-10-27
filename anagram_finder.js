//JavaScript Anagram Finder - 10-23-2020

const WORD_POOL_FILE = "conundrum_word_pool.txt";
sixes = []; threes = []; fours = []; fives = []; nines = [];

//First argument must be 9 letters--MANDATORY
//Second arg determines whether it returns 4/5 or 3/6 subword anagrams
//Set fourfives to false to get 3/6 anagrams
//Last arg is for DEBUG ONLY! Shows hyphen betweens subwords for readability
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
//Init function

// $(function() {
//     const t0 = performance.now();
//     $.get(WORD_POOL_FILE).done(function(data) {
//         //Global on purpose
//         word_list = data.split(/[\r\n]+/);
//         for (word of word_list) {
//             //word = word.replace(/\s/gi, '');
//             switch(word.length) {
//                 case 3:
//                     threes.push(word);
//                     break;
//                 case 4:
//                     fours.push(word);
//                     break;
//                 case 5:
//                     fives.push(word);
//                     break;
//                 case 6:
//                     sixes.push(word);
//                     break;
//                 case 9:
//                     nines.push(word);
//                     break;
//                 default:
//                     break;
//             }
//         }
//         let grams = find_anagrams('modulated', true, true);
//         /*let outhtml = "<ul>";
//         for (gram of grams) {
//             gram = gram.toUpperCase();
//             outhtml += '<li>'+gram+'</li>';
//         }
//         outhtml+= '</ul>';*/
//         random_gram = grams[Math.floor(Math.random() * grams.length)];
//         $("#main").html(`<h1>${random_gram}</h1>`);
//         t1 = performance.now();
//         console.log(`Script took ${t1 - t0} milliseconds.`);
//     });
// });