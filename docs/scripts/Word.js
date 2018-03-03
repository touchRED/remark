function Word(w_, id_){
  this.content = w_;
  this.id = id_;
  this.mutations = [];
}

Word.prototype.update = function(){
  this.mutations = [];
  let iter = 0;

  for(let j = floor(random(this.content.length)); j < (j + this.content.length); j++){
    if(iter >= this.content.length){
      break;
    }
    iter++;
    var i = j % this.content.length;
    // console.log(i);

    //consonant cluster (delete)
    if(i > 0 && isConsonant(this.content.charAt(i)) && isConsonant(this.content.charAt(i - 1))){
      var mutArr = [];
      mutArr.push("consonant cluster (delete)");
      mutArr.push(this.content.slice(0, i) + this.content.slice(i + 1));
      this.mutations.push(mutArr);
      // continue;
    }

    //fricative (become h)
    if(isFricative(this.content.charAt(i)) && this.content.charAt(i) != 'h'){
      var mutArr = [];
      mutArr.push("fricative " + this.content.charAt(i) + " becomes h");
      mutArr.push(this.content.slice(0, i) + 'h' + this.content.slice(i + 1));
      this.mutations.push(mutArr);
      // continue;
    }

    //stops between vowels (become fricative)
    if(i > 0 && i < this.content.length - 1 && isStop(this.content.charAt(i)) && isVowel(this.content.charAt(i-1)) && isVowel(this.content.charAt(i+1))){
      var mutArr = [];
      let fric = fricatives[floor(random(fricatives.length))];
      mutArr.push("stop between vowels " + this.content.charAt(i) + " becomes fricative " + fric);
      mutArr.push(this.content.slice(0, i) + fric + this.content.slice(i + 1));
      this.mutations.push(mutArr);
      // continue;
    }

    //stop replace (stop becomes glottal stop)
    if(isStop(this.content.charAt(i)) && this.content.charAt(i) != '?'){
      var mutArr = [];
      mutArr.push("stop " + this.content.charAt(i) + " becomes glottal stop");
      mutArr.push(this.content.slice(0, i) + '?' + this.content.slice(i + 1));
      this.mutations.push(mutArr);
      // continue;
    }

    //h between vowels (delete)
    if(i > 0 && i < this.content.length - 1 && this.content.charAt(i) == 'h' && isVowel(this.content.charAt(i-1)) && isVowel(this.content.charAt(i+1))){
      var mutArr = [];
      mutArr.push("h between vowels (delete)");
      mutArr.push(this.content.slice(0, i) + this.content.slice(i + 1));
      this.mutations.push(mutArr);
      // continue;
    }

    //vowel cluster (insert consonant)
    if(i > 0 && isVowel(this.content.charAt(i)) && isVowel(this.content.charAt(i - 1))){
      var mutArr = [];
      mutArr.push("vowel cluster (insert consonant)");
      let cons = consonants[floor(random(consonants.length))];
      mutArr.push(this.content.slice(0, i) + cons + this.content.slice(i));
      this.mutations.push(mutArr);
      // continue;
    }
  }
}

Word.prototype.mutate = function(){
  if(this.mutations.length){
    let mutation = this.mutations[floor(random(this.mutations.length))];
    console.log(mutation[0]);
    let change = " : " + this.content + " &rarr; " + mutation[1];
    logger.child(createP(mutation[0]).child(createSpan(change).style("font-weight", "bold")));
    this.content = mutation[1];
  }
  this.update();
}
