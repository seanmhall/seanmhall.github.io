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
//I modified it to accept an additional argument and also removed some code that removed duplicates
//The original function would actually therefore return Combinations and not Permutations, strictly speaking
//So now you can get, say, all 7-letter permutations of a 9-letter string
//BUT! If you want to do this don't call "permute", call "Permutations"
//Wrapper function is necessary because apparently JavaScript doesn't let you pass variables by reference
//Performance tests indicated that creating one array of 9-letter permutations and then trimming it is faster than calling Permutations()
//I left this in here anyway in case anyone needs such a function

function permute(string, charnum) {
    charnum = charnum || 1;
        if (string.length === charnum) return string; // This is our break condition
        //strlen = strlen || string.length;
        var permutations = []; // This array will hold our permutations

      for (var i = 0; i < string.length; i++) {
        var char = string[i];
        var remainingString = string.slice(0, i) + string.slice(i + 1, string.length);
        //console.log('Str: '+string+', Remaining: '+remainingString);
       for (var subPermutation of permute(remainingString)) {
       permutations.push(char + subPermutation); }
       
     }
        return permutations;
    }
//Wrapper function and string_sort are my own functions

function Permutations(istr, numberOfChars) {
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
