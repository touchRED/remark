function Agent(g_, id_, v_){
  //current grid position
  this.gridItem = g_;
  //next grid position
  this.nextGridItem = g_;
  this.vocabulary = v_;
  this.id = id_;
  this.lerpAmt = 1;
}

Agent.prototype.update = function(){
  let moves = [];
  let included = false;
  let wordIndex;

  this.gridItem.currentAgent = this;

  //generate available moves
  for(let i = -1; i <= 1; i++){
    for(let j = -1; j <= 1; j++){
      if(this.gridItem.gridX + i < 0 || this.gridItem.gridX + i >= grid.length || this.gridItem.gridY + j < 0 || this.gridItem.gridY + j >= grid[0].length) continue;
      if(grid[this.gridItem.gridX + i][this.gridItem.gridY + j].type != 'ocean' && grid[this.gridItem.gridX + i][this.gridItem.gridY + j] != this.gridItem){
        moves.push(grid[this.gridItem.gridX + i][this.gridItem.gridY + j]);
      }
      if(grid[this.gridItem.gridX + i][this.gridItem.gridY + j].currentAgent && grid[this.gridItem.gridX + i][this.gridItem.gridY + j] != this.gridItem){
        //if there is an agent next to us, let's talk!
        let a = grid[this.gridItem.gridX + i][this.gridItem.gridY + j].currentAgent;

        if(a.id == this.id){
          //agent speaks the same language
          let randomIndex = floor(random(this.vocabulary.length));
          let transfer = this.vocabulary[randomIndex];
          //loop thru agent's vocab to see if the word we chose is in their vocab
          for(let k = 0; k < a.vocabulary.length; k++){
            if(transfer.id == a.vocabulary[k].id){
              included = true;
              wordIndex = k;
              break;
            }
          }
          //if so, change their version of the word to our version
          if(included){
            if(this.vocabulary[randomIndex].content == a.vocabulary[wordIndex].content && random() < 0.01){
              let orig = this.vocabulary[randomIndex].content;
              this.vocabulary[randomIndex].mutate();
              a.vocabulary[wordIndex] = this.vocabulary[randomIndex];
              if(this.vocabulary[randomIndex].content != orig) console.log(this.vocabulary[randomIndex].content + " derived from " + orig);
            }else{
              a.vocabulary[wordIndex] = transfer;
            }
          }
        }else{
          //agent speaks another language
          let transfer = this.vocabulary[floor(random(this.vocabulary.length))];

          //loop thru agent's vocab to see if the word we chose is NOT in their vocab
          for(let agentWord of a.vocabulary){
            if(transfer.id == agentWord.id){
              included = true;
              break;
            }
          }
          //if not, add the word to their vocabulary
          if(!included){
            let borrowedWord = new Word(transfer.content, transfer.id);
            borrowedWord.update();
            borrowedWord.mutate();
            a.vocabulary.push(borrowedWord);
          }
        }
      }
    }
  }

  //randomly select a move
  if(moves.length){
    this.nextGridItem = moves[floor(random(moves.length))];
  }

  if(this.nextGridItem.type == 'gate'){
    if(this.nextGridItem.gateTo){
      this.nextGridItem = this.nextGridItem.gateTo;
    }
  }
}

Agent.prototype.draw = function(){
  fill(0);

  //interpolate between positions
  ellipse(lerp(this.gridItem.x + 7.5, this.nextGridItem.x + 7.5, this.lerpAmt), lerp(this.gridItem.y + 7.5, this.nextGridItem.y + 7.5, this.lerpAmt), 10);
  this.lerpAmt += 0.05;

  //select a new move
  if(this.lerpAmt >= 1){
    this.gridItem.currentAgent = false;
    this.gridItem = this.nextGridItem;
    this.update();
    this.lerpAmt = 0;
  }
}
