//These four functions came from Stack Overflow
function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function repeatStr(string, times) {
    var repeatedString = "";
    while (times > 0) {
        repeatedString += string;
        times--;
    }
    return repeatedString;
}

//Based on an answer from Stack Overflow
//I modified it to accept an additional argument
//So now you can get, say, all 7-letter permutations of a 9-letter string
function permute(string, charnum) {
    charnum = charnum || 1;
        if (string.length === charnum) return string; // This is our break condition
        //strlen = strlen || string.length;
        var permutations = []; // This array will hold our permutations

      for (var i = 0; i < string.length; i++) {
            var char = string[i];
            // Cause we don't want any duplicates:
            /*if (string.indexOf(char) != i) {
            continue;
            }*/
        var remainingString = string.slice(0, i) + string.slice(i + 1, string.length);
        //console.log('Str: '+string+', Remaining: '+remainingString);
       for (var subPermutation of permute(remainingString)) {
       permutations.push(char + subPermutation); }
       
     }
        return permutations;
    }
//Wrapper function and string_sort are my own functions

function permutations(istr, numberOfChars) {
    numberOfChars = numberOfChars || null;
    let array_to_return;
        if (numberOfChars == null) {
            array_to_return = permute(istr, 1);
    }
    else {
        array_to_return = permute(istr, (istr.length-numberOfChars)+1);
    }
    return new Set(array_to_return);
}
    function sort_string(x) {
        let chars = x.split('');
        chars.sort();
        return chars.join(''); 
    }
