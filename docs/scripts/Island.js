function Island(id_, color_, v_){
  //gridItems that make up the island
  this.points = [];
  this.nextWord = "";
  this.vocabulary = Array.of(v_);
  //island name & color
  this.id = id_;
  this.color = color_;
}

Island.prototype.addWord = function(){
  if(this.nextWord.length == 0){
    alert("You have to type a new word first!");
    return;
  }
  let w = new Word(this.nextWord, floor(random(100000)));
  this.vocabulary.push(w);
  // for(let a of agents){
  //   if(a.id == this.id){
  //     a.vocabulary.push(w);
  //   }
  // }
  this.nextWord = "";
}

Island.prototype.populate = function(n){
  //populate an island with agents
  agents.push(new Agent(this.points[floor(random(this.points.length))], this.id, this.vocabulary));
  // for(let i = 0; i < n; i++){
  //   agents.push(new Agent(this.points[floor(random(this.points.length))], this.id, this.vocabulary));
  // }
}
