# CountdownJS

This is my attempt at creating a way to play Countdown on the web. I've never made a game before so I thought this would be a fun project. I'm sure this is something that's been done many times before but I deliberately avoided looking at any existing ones before making this. I've been mainly coding in Python lately so I wanted to sharpen my JavaScript skills. This project also provided an opportunity to work on a couple challenging (to me) algorithmic problems: finding all 7, 8 and 9 letter words that can be made from 9 randomly selected letters, and generating Conundrums, which are anagrams of 9 letter words consisting of two sub words (e.g. "LANGUIDLY" can be re-arranged as "LYINGDUAL").

Keep in mind this is a work in progress and will be continually updated. So if you're looking at my code and it looks bad, remember the words of fellow GitHub user Ben Awad: "Writing bad code is a prerequisite to writing good code."

## LETTERS ROUND

### Letter Selection

The letter frequencies come from Wikipedia (https://en.wikipedia.org/wiki/Letter_frequency). The game uses the Dictionary frequency by default but the Text frequency table is included too but not recommended. For example, the text has a high percentage of Ws, probably due to whatever corpus was used containing urls (www). 

### Scoring

The scoring for the Letters round goes by the Honor System for words of 6 letters or less. Words 7-9 letters are checked against a list of words that came from here: https://github.com/dwyl/english-words
If you type a letter that isn't one of the 9 selected letters for that round, or use a selected letter more times than it appears the Letter Counter next to the input box will turn red. Any invalid input will automatically score 0 points.

## NUMBERS ROUND

The scoring for the Numbers Round for the time being is entirely on the Honor System. There is also no way to check for possible solutions, for now. I'm sure somebody has written an algorithm to solve these already but I would like to do it myself. This feature will maybe appear in a future release.

## CONUNDRUM

The letter counter next to the input box will light up red if you have invalid input. The number turning green indicates a *possible* correct answer (spefically, the letters you provided are all the same as the letters in the clue, but the order could still be wrong). The pool of words for conundrums came from http://www.mieliestronk.com/wordlist.html. I needed a separate word list for conundrums that didn't contain a million obscure words that come from the sciences; it would be unrealistically difficult otherwise.

