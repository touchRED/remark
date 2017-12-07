var fricatives = ["f", "v", "s", "z", "h"];
var consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
var vowels = ["a", "e", "i", "o", "u"];

function isFricative(c){
  return (c == "f" || c == "v" || c == "s" || c == "z" || c == "h");
}

function isStop(c){
  return (c == "p" || c == "b" || c == "t" || c == "d" || c == "k" || c == "c" || c == "g" || c == "?" || c == "q");
}

function isVowel(c){
  return (c == "a" || c == "e" || c == "i" || c == "o" || c == "u");
}

function isConsonant(c){
  return (!isVowel(c));
}
