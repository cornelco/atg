window.LOCAL_GAME_DATA = {
        players: []
    }
    ///////////////////
    //   New functions
    ///////////////////
    //                  0       1       2           3           4           5
var colorName = ["red", "blue", "brown", "green", "white", "purple"];
// colorname[2] returns "brown"
var tokenCount = [];

function joinGame() {
    event.preventDefault();
    var gameName = document.getElementById("joinGameName").value;
    window.gameName = gameName;
    socket.emit('enterLobby', gameName);
}
var getEmptyCardSlot = function (deckDiv) {
    for (var i = 0; i < 4; ++i) {
        if (deckDiv.children[i].children[0] == undefined) {
            return i;
        }
    }
};

function createTokens() {
    var tokensMainDiv = document.getElementsByTagName('tokens')[0];
    for (var i = 0; i < 5; ++i) {
        var tokenDiv = document.createElement('div');
        var tokenQtyDiv = document.createElement('p');
        tokenQtyDiv.innerHTML = '0';
        tokensMainDiv.appendChild(tokenDiv);
        var colorImg = img_create("./images/" + colorName[i] + ".png");
        tokenDiv.appendChild(colorImg);
        tokenDiv.appendChild(tokenQtyDiv);
        tokensMainDiv.appendChild(tokenDiv);
    }
    initTokenDivs();
}

function initTokenDivs() {
    var tokenDivs = document.querySelectorAll("tokens > div");
    for (var i = 0; i < 5; i++) {
        tokenCount[i] = tokenDivs[i].getElementsByTagName('p')[0];
        tokenDivs[i].onclick = function () {
            for (var j = 0; j < 5; j++) {
                if (this.children[0].currentSrc == tokenDivs[j].children[0].currentSrc) {
                    socket.emit('tokenClicked', j);
                }
            }
        };
    }
}

function createCard(card, div) {
    var cardDiv = document.createElement("card");
    cardDiv.onclick = function () {
        socket.emit('cardClicked', card);
    };
    /*cardDiv.addEventListener("click", this.myFunction);
    this.myfunction = function() {
        //put the code here
    };*/
    var points = document.createElement("points"); {
        var innerDiv1 = document.createElement("div");
        var innerDiv2 = document.createElement("div");
        //        if (card.points != 0){
        innerDiv2.innerHTML = card.points;
        //        };
        innerDiv1.appendChild(innerDiv2);
        points.appendChild(innerDiv1)
    }
    //Switch statement pick backgroundImg
    var gem = document.createElement("gem");
    var gemDiv = document.createElement("div");
    gem.appendChild(gemDiv);
    var background;
    switch (card.gemColor) {
    case 0:
    case '0':
        background = img_create("./images/bg_red.png");
        gemDiv.appendChild(img_create("./images/red.png"));
        break;
    case 1:
    case '1':
        background = img_create("./images/bg_blue2.png");
        gemDiv.appendChild(img_create("./images/blue.png"));
        break;
    case 2:
    case '2':
        background = img_create("./images/bg_brown.png");
        gemDiv.appendChild(img_create("./images/brown.png"));
        break;
    case 3:
    case '3':
        background = img_create("./images/bg_green.png");
        gemDiv.appendChild(img_create("./images/green.png"));
        break;
    case 4:
    case '4':
        background = img_create("./images/bg_white.png");
        gemDiv.appendChild(img_create("./images/white.png"));
        break;
    case 5:
    case '5':
        background = img_create("./images/bg_yellow.png");
        gemDiv.appendChild(img_create("./images/yellow.png"));
        break;
    }
    var cost = document.createElement("cost");
    cardDiv.appendChild(points);
    cardDiv.appendChild(cost);
    cardDiv.id = card.id + "CardID";
    for (var colors in card.cost) {
        if (card.cost[colors] > 0) {
            var costColorDiv = document.createElement(colorName[colors]);
            var colorIcon = document.createElement("div");
            var colorImg = img_create("./images/" + colorName[colors] + ".png");
            colorIcon.appendChild(colorImg);
            costColorDiv.appendChild(colorIcon);
            var costNumDivInner = document.createElement("div");
            var costNumDivOuter = document.createElement("div");
            costNumDivInner.innerHTML = card.cost[colors];
            costNumDivOuter.appendChild(costNumDivInner);
            costColorDiv.appendChild(costNumDivOuter);
            cost.appendChild(costColorDiv);
        }
        //        for (var i=0;i < card.cost[colors];i++){
        //            // console.log(colors)
        //            var colorIcon = document.createElement(colorName[colors]);
        //            var colorImg = img_create("./images/red.png");
        //            switch (colors){
        //                case '0':
        //                    var colorImg = img_create("./images/red.png");
        //                    break;
        //                case '1':
        //                    var colorImg = img_create("./images/blue.png");
        //                    break;
        //                case '2':
        //                    var colorImg = img_create("./images/brown.png");
        //                    break;
        //                case '3':
        //                    var colorImg = img_create("./images/green.png");
        //                    break;
        //                case '4':
        //                    var colorImg = img_create("./images/white.png");
        //                    break;
        //                case '5':
        //                    var colorImg = img_create("./images/yellow.png");
        //                    break;
        //            } 
        //        }
    }
    cardDiv.appendChild(background);
    cardDiv.appendChild(gem);
    div.appendChild(cardDiv)
}

function createPlayer(player, playerNum) {
    var nameDiv = document.createElement("name");
    nameDiv.innerHTML = player.name;
    var playerDiv = document.querySelectorAll("main player")[playerNum];
    var pointsDiv = document.createElement("points");
    var gemsDiv = document.createElement("gems");
    for (color in player.gems) {
        var gemDiv = document.createElement("div");
        var gemToken = document.createElement("p");
        gemToken.innerHTML = player.gems[color][0];
        var gemCard = document.createElement("p");
        gemCard.innerHTML = player.gems[color][1];
        gemDiv.appendChild(gemToken);
        gemDiv.appendChild(gemCard);
        gemsDiv.appendChild(gemDiv);
        playerDiv.appendChild(gemsDiv);
    }
    pointsDiv.innerHTML = player.points;
    playerDiv.appendChild(nameDiv);
    playerDiv.appendChild(pointsDiv)
}
// function updatePlayers(player) {
//     socket.emit('updatePlayers', player);
// }
function updateLobby(playersArray) {
    var lobbyDiv = document.getElementsByTagName("lobby")[0];
    if (typeof (lobbyDiv) == "undefined") {
        var lobbyDivDiv = document.createElement("lobbyDiv");
        lobbyDiv = document.createElement("lobby");
        var gameNameDiv = document.createElement("h");
        gameNameDiv.innerHTML = window.gameName;
        var players = document.createElement("players");
        var startGameButton = document.createElement("button");
        startGameButton.innerHTML = "Start Game";
        startGameButton.onclick = function () {
            socket.emit('startGame', window.gameName);
            //Delete Lobby/////
            // lobbyDivDiv.parentElement.removeChild(lobbyDivDiv)
        };
        //AppendChilds
        lobbyDivDiv.appendChild(lobbyDiv);
        lobbyDiv.appendChild(gameNameDiv);
        lobbyDiv.appendChild(players);
        lobbyDiv.appendChild(startGameButton);
        document.querySelector("main").appendChild(lobbyDivDiv)
    }
    else {
        var players = document.querySelector("lobby>players");
        while (players.hasChildNodes()) {
            players.removeChild(players.lastChild);
        }
    }
    for (player in playersArray) {
        var playerName = document.createElement('p');
        var playerNameDiv = document.createElement('div');
        playerName.innerHTML = playersArray[player];
        playerNameDiv.appendChild(playerName);
        players.appendChild(playerNameDiv)
    }
}

function updateTokens(color, count, pName, pGems) {
    tokenCount[color].innerHTML = count;
    for (var player in window.LOCAL_GAME_DATA.players) {
        if (window.LOCAL_GAME_DATA.players[player].name == pName) {
            window.LOCAL_GAME_DATA.players[player].setGem(color + 1, 0, pGems);  // ********** BUG HERE WITH THE +1 ******
        }
    }
}

function updateCards (pName, pCards, cColor) {
    for (var player in window.LOCAL_GAME_DATA.players) {
        if (window.LOCAL_GAME_DATA.players[player].name == pName) {
            window.LOCAL_GAME_DATA.players[player].setGem(cColor, 1, pCards); // ********** BUG HERE WITH THE COLOR ***
        }
    }
}

///////////////////////
//  Old functions
///////////////////////
function addToPlay(data) {
    moveToPlay(data.card, data.deck, data.index);
}

function moveDiv(element, destination) {
    destination.appendChild(element);
}

function moveToPlay(card, deck, index) {
    document.querySelector("playArea").children[deck].children[index].appendChild(card)
}

function moveCard(data) {
    if (data.player) {}
    else if (data.location) {}
}
var card1, div1, div2;

function selectElements() {
    div1 = document.querySelector("#testDiv");
    card1 = document.getElementById("testcard");
    div2 = document.querySelector("playArea div >card1")
}

function img_create(src, alt, title) {
    var img = document.createElement('img');
    img.src = src;
    if (alt != null) img.alt = alt;
    if (title != null) img.title = title;
    return img;
}