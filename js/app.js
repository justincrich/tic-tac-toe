var module = (function(){
  /*UI Elements*/
  let boardUI = document.getElementById('board');
  let start = document.getElementById('start');
  let finish = document.getElementById('finish');
  let startBtn = document.querySelector('#start .button');
  let restartBtn = document.getElementById('restart');
  let playerO = document.getElementById('player1');
  let playerX = document.getElementById('player2');
  let ul = document.getElementById('boxHolder');


  /*GAME DATA HANDLER*/
  let activePlayer = 0;
  //var that indicates if it's PvP or PvC
  //PvP = 1, PvC = 0
  let mode = 0;
  let move = 0;
  let board = [
    [null,null,null],
    [null,null,null],
    [null,null,null]
  ];



/*GAME EVENT HANDLER*/
  window.addEventListener("load",(e)=>{
    //Listen for start game and then setup/show boardUI
    startBtn.onclick = ()=>{
      boardUI.style.display = 'block';
      start.style.display = 'none';

    }

    restartBtn.onclick=()=>{
      //reset board Array
      board = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
      ];
      //reset active player
      activePlayer = 0;
      playerX.classList.remove('active');
      playerO.classList.add('active');
      //remove class markers from all boxes
      ul.childNodes.forEach(item=>{
        item.className = 'box';
      })


      //go back to game screen
      boardUI.style.display = 'block';
      finish.style.display = 'none';
      finish.className = 'screen screen-win';
    }


    //LI action listeners
    Array.from(ul.children).forEach(element=>{
        //event listeners for click
        element.addEventListener('click',(e)=>{
          handleClick(element)
        });
        //event listeners for mouseover
        element.addEventListener('mouseenter',(e)=>{
          toggleImg(activePlayer,element);
        });
        element.addEventListener('mouseleave',(e)=>{
          toggleImg(activePlayer,element);
        });
    });




  });

  /*GAME FUNCTIONS*/

  //function that handles clicks
  function handleClick(element){
    //1. get name of box clicked
    //let id = e.closest('.box');
    let id = element.id;
    id = id.split('');
    let row = parseInt(id[0]);
    let col = parseInt(id[1]);
    console.log(row,col);
    let box = document.getElementById(element.id);
    if(board[row][col]===null){
      if(activePlayer === 0){
        //Log player O
        //Player O is logged in the move matrix as false
        board[row][col] = false;

        activePlayer = 1;
        box.classList.add('box-filled-1');
        box.innerHTML = '';
        playerO.classList.remove('active');
        playerX.classList.add('active');
        if(mode==0){
          setTimeout(aiMove(),1000);
        }
      }else if(mode == 1 && activePlayer == 1){
        //Log player X
        //Player X is logged in the move matrix as true
        board[row][col] = true;
        activePlayer = 0;
        box.classList.add('box-filled-2');
        box.innerHTML = '';
        playerX.classList.remove('active');
        playerO.classList.add('active');
      }
    }else{
      //can't add move
      console.log('not avaliable!');
    }
    //check win state
    let res = checkWin(board)
    console.log('result',res);
    switch(res){
      case 1:{
        //X Wins
        console.log('X Wins')
        displayWin('X');
      }
      break;
      case 0:{
        //O Wins
        console.log('O Wins')
        displayWin('O')
      }
      break;
      case -1:{
        //all spaces taken ... draw
        console.log('Draw');
        displayWin('draw');
      }
      break;
      default:{
        console.log('keep going');
      }
    }
  }

  //Function that checks if the last move was a winning move
  function checkWin(boardMoves){
    //check if someone won
    let vals = [true,false];
    let allNotNull = true;
    for(let k = 0;k<vals.length;k++){
      let value = vals[k];
      //check rows, columns, and diagonals
      let diagComplete1=true;
      let diagComplete2=true;

      for(let i = 0;i<3;i++){
        //check left to right diagnals
        if(boardMoves[i][i]!=value){
          diagComplete1 = false;
        }
        //check right to left diagnals
        if(boardMoves[2-i][i]!=value){
          diagComplete2 = false;
        }

        //now look at rows/columns
        let rowComplete = true;
        let colComplete = true;
        for(let j = 0 ; j<3;j++){
          //check rows
          if(boardMoves[i][j]!=value){
            rowComplete = false;
          }
          //check columns
          if(boardMoves[j][i]!=value){
            colComplete = false;
          }
          if(boardMoves[i][j] == null){
            allNotNull = false;
          }
        }
        if(rowComplete || colComplete){
          return value ? 1:0;
        }
      }
      if(diagComplete1 || diagComplete2){
        return value ? 1:0;
      }
    }
    if(allNotNull){
      return -1;
    }
    return null;
  }

  function toggleImg(team,element){
    //always remove mark on out
    if (element.children.length>0){
      element.innerHTML = '';
    }else{
      let selected = (element.classList.contains('box-filled-1')||element.classList.contains('box-filled-2'));
      console.log('selected ',selected);
      if(!selected){
        let oIMG =
        '<svg class="o hoverMarker" xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-200.000000, -60.000000)" fill="#000000"><g transform="translate(200.000000, 60.000000)"><path d="M21 36.6L21 36.6C29.6 36.6 36.6 29.6 36.6 21 36.6 12.4 29.6 5.4 21 5.4 12.4 5.4 5.4 12.4 5.4 21 5.4 29.6 12.4 36.6 21 36.6L21 36.6ZM21 42L21 42C9.4 42 0 32.6 0 21 0 9.4 9.4 0 21 0 32.6 0 42 9.4 42 21 42 32.6 32.6 42 21 42L21 42Z"/></g></g></g></svg>';

        let xIMG =
        '<svg class="x hoverMarker" xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-718.000000, -60.000000)" fill="#000000"><g transform="translate(739.500000, 81.500000) rotate(-45.000000) translate(-739.500000, -81.500000) translate(712.000000, 54.000000)"><path d="M30 30.1L30 52.5C30 53.6 29.1 54.5 28 54.5L25.5 54.5C24.4 54.5 23.5 53.6 23.5 52.5L23.5 30.1 2 30.1C0.9 30.1 0 29.2 0 28.1L0 25.6C0 24.5 0.9 23.6 2 23.6L23.5 23.6 23.5 2.1C23.5 1 24.4 0.1 25.5 0.1L28 0.1C29.1 0.1 30 1 30 2.1L30 23.6 52.4 23.6C53.5 23.6 54.4 24.5 54.4 25.6L54.4 28.1C54.4 29.2 53.5 30.1 52.4 30.1L30 30.1Z"/></g></g></g></svg>';

        let img = (team === 0)? oIMG:xIMG;
        element.innerHTML = img;
      }
    }

  }

  function displayWin(winner){
    if(winner==='X'){
      finish.classList.add('screen-win-two');
    }else if(winner==='O'){
      finish.classList.add('screen-win-one');
    }else{
      finish.classList.add('screen-win-tie');
    }
    // board.setAttribute('hidden','true');
    // finish.setAttribute('hidden','false');
    boardUI.style.display = 'none';
    finish.style.display = 'block';
  }

  function aiMove(){
    board = minimaxMove(board);
    // console.log(numNodes);
    console.log(board);
    board.forEach((row, index, arr)=>{
      for(i in row){
        if(row[i]===true){
          let box = document.getElementById(index+''+i);
          box.innerHTML = '';
          box.className = 'box box-filled-2';
        }
      }
    });
    activePlayer = 0;
    playerO.classList.add('active');

  }

  function minimaxMove(submittedBoard){
    numNodes = 0;
    return recurseMinimax(submittedBoard,true)[1];
  }

  let numNodes = 0;

  function recurseMinimax(playerBoard, player) {
    numNodes++;
    var winner = checkWin(playerBoard);
    if (winner != null) {
        switch(winner) {
            case 1:
                // AI wins
                return [1, playerBoard]
            case 0:
                // opponent (O) wins
                return [-1, playerBoard]
            case -1:
                // Tie
                return [0, playerBoard];
        }
    } else {
        // Next states
        var nextVal = null;
        var nextBoard = null;

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (playerBoard[i][j] == null) {
                    playerBoard[i][j] = player;
                    var value = recurseMinimax(playerBoard, !player)[0];
                    if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
                        nextBoard = playerBoard.map(function(arr) {
                            return arr.slice();
                        });
                        nextVal = value;
                    }
                    playerBoard[i][j] = null;
                }
            }
        }
        return [nextVal, nextBoard];
    }
}


  return {
    selectionsAll:()=>{
      return board;
    }

  }

}());
