
const SQUARE_SIZE 						= 32;

const SHAPE_SIZE						= 4;
const BORDER_SIZE						= 2;

const ROTATION_ENUM						= {
												NONE 	: 0,
												RIGHT	: 1,
												DOWN	: 2,
												LEFT	: 3
};

const GAME_STATE_ENUM					= {
												NONE		: 0,
												WAITING		: 1,
												PLAYING		: 2,
												GAMEOVER 	: 3,
};

var gameState 							= GAME_STATE_ENUM.NONE;

const TETRIS_SHAPE_O					= [ 	[ 0, 0, 0, 0 ],
												[ 0, 1, 1, 0 ],
												[ 0, 1, 1, 0 ],
												[ 0, 0, 0, 0 ],
];

const TETRIS_SHAPE_I					= [ 	[ 0, 1, 0, 0 ],
												[ 0, 1, 0, 0 ],
												[ 0, 1, 0, 0 ],
												[ 0, 1, 0, 0 ],
];

const TETRIS_SHAPE_S					= [ 	[ 0, 0, 0, 0 ],
												[ 0, 0, 1, 1 ],
												[ 0, 1, 1, 0 ],
												[ 0, 0, 0, 0 ],
];

const TETRIS_SHAPE_Z					= [ 	[ 0, 0, 0, 0 ],
												[ 1, 1, 0, 0 ],
												[ 0, 1, 1, 0 ],
												[ 0, 0, 0, 0 ],
];

const TETRIS_SHAPE_L					= [ 	[ 0, 0, 0, 0 ],
												[ 0, 1, 0, 0 ],
												[ 0, 1, 0, 0 ],
												[ 0, 1, 1, 0 ],
];

const TETRIS_SHAPE_J					= [ 	[ 0, 0, 0, 0 ],
												[ 0, 0, 1, 0 ],
												[ 0, 0, 1, 0 ],
												[ 0, 1, 1, 0 ],
];

const TETRIS_SHAPE_T					= [ 	[ 0, 0, 0, 0 ],
												[ 0, 1, 1, 1 ],
												[ 0, 0, 1, 0 ],
												[ 0, 0, 0, 0 ],
];

const TETRIS_SHAPES						= [		TETRIS_SHAPE_O,
												TETRIS_SHAPE_I,
												TETRIS_SHAPE_S,
												TETRIS_SHAPE_Z,
												TETRIS_SHAPE_L,
												TETRIS_SHAPE_J,
												TETRIS_SHAPE_T,
];

const GRID_EMPTY						= -1;

const COLOUR_RED 						= { 	LIGHT			: "#FF0000",
												DARK 			: "#880000"
}

const COLOUR_GREEN						= { 	LIGHT			: "#00FF00",
												DARK 			: "#008800"
}

const COLOUR_BLUE 						= { 	LIGHT			: "#0000FF",
												DARK 			: "#000088"
}

const COLOUR_YELLOW 					= { 	LIGHT			: "#FFFF00",
												DARK 			: "#888800"
}

const COLOUR_TURQUOISE					= { 	LIGHT			: "#00FFFF",
												DARK 			: "#008888"
}

const COLOUR_PURPLE 					= { 	LIGHT			: "#FF00FF",
												DARK 			: "#880088"
}

const COLOUR_WHITE 						= "#FFFFFF";

const COLOUR_LIGHT_GREY 				= "#CCCCCC";

const COLOUR_BLACK 						= "#000000";

const COLOURS 							= [		COLOUR_RED,
												COLOUR_GREEN,
												COLOUR_BLUE,
												COLOUR_YELLOW,
												COLOUR_TURQUOISE,
												COLOUR_PURPLE												
];

const GAME_FPS_MAX 						= 25;
const GAME_FPS_MIN 						= 2;

const GRID_SIZE_X						= 10;
const GRID_SIZE_Y						= 16;


var Player								= {
											shape 					: TETRIS_SHAPE_T,
											xShape					: 0,
											yShape					: 0,
											rotation 				: ROTATION_ENUM.NONE,
											shapeColour				: COLOUR_RED

}

var GameGrid = createArray( GRID_SIZE_Y, GRID_SIZE_X );
	
var canvas 								= document.getElementById("myCanvas");
var ctx 								= canvas.getContext("2d");

const STATUS_TEXT_READY					= "Ready to play!";
const STATUS_TEXT_PLAYING				= "PLAY SOME TETRIS!";
const STATUS_TEXT_GAMEOVER				= "GAME OVER!";

var removeLines 						= [];

function createArray(length) {

    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function drawCanvasBackground() {

	ctx.beginPath();
	ctx.rect( 0, 0, canvas.width, canvas.height );
	ctx.fillStyle = COLOUR_LIGHT_GREY;
	ctx.fill();
	ctx.closePath();

}

function drawPlaySpaceBackground() {

	ctx.beginPath();
	ctx.rect( 0, 0, GRID_SIZE_X * SQUARE_SIZE, GRID_SIZE_Y * SQUARE_SIZE);
	ctx.fillStyle = COLOUR_WHITE;
	ctx.fill();
	ctx.closePath();

}

function drawPlaySpaceFrame() {
	ctx.beginPath();
	ctx.rect( 0, 0, GRID_SIZE_X * SQUARE_SIZE, GRID_SIZE_Y * SQUARE_SIZE);
	ctx.stroke();
}

function drawSquare( x, y, size, colour )
{
	ctx.beginPath();
	ctx.rect( x, y, size, size);
	ctx.fillStyle = colour;
	ctx.fill();
	ctx.closePath();

}

function drawGridSquare( x, y, colour )
{
	x *= SQUARE_SIZE;
	y *= SQUARE_SIZE;

	ctx.beginPath();
	ctx.rect( x, y, SQUARE_SIZE, SQUARE_SIZE);
	ctx.fillStyle = colour;
	ctx.fill();
	ctx.closePath();

}

function drawSquareNested( x, y, size, border, colour )
{
	drawSquare( x, y, size, colour.LIGHT );
	x += border;
	y += border;
	drawSquare( x, y, size-(border*2), colour.DARK );

}

function drawGridSquareNested( x, y, colour )
{
	x *= SQUARE_SIZE;
	y = GRID_SIZE_Y - (y+1);
	y *= SQUARE_SIZE;


	drawSquareNested( x, y, SQUARE_SIZE, BORDER_SIZE, colour );
}

// drawGridSquareNested( 3, 2, COLOUR_RED.LIGHT, COLOUR_RED.DARK );


function shapeRotate( theShape, x, y, rotation ) {

	switch( rotation )
	{
		case ROTATION_ENUM.NONE:
		{
			return theShape[y][x];
		}
		case ROTATION_ENUM.RIGHT:
		{
			return theShape[x][SHAPE_SIZE-(y+1)];
		}
		case ROTATION_ENUM.DOWN:
		{
			return theShape[SHAPE_SIZE-(y+1)][SHAPE_SIZE-(x+1)];
		}
		case ROTATION_ENUM.LEFT:
		{
			return theShape[SHAPE_SIZE-(x+1)][y];
		}
	}
}


function drawShape( xPos, yPos, theShape, rotation, colour ) {

	var xDraw;
	var yDraw;

	// console.log( "colour: " + colour );

	for( var y = 0; y < SHAPE_SIZE; y++ ) {

		for( var x = 0; x < SHAPE_SIZE; x++ ) {

			if( shapeRotate( theShape, x, y, rotation ) == 0 )
				continue;

			xDraw = x + xPos;
			yDraw = y + yPos;

			drawGridSquareNested( xDraw, yDraw, colour );

		}
	}

}


var Key = {
			_pressed: {},

			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40,
			SPACE: 32,
			RETURN: 13,

			keyDownHandler: undefined,

			isDown: function(keyCode) {
				return this._pressed[keyCode];
			},

			onKeydown: function(event) {

				// SJL: Note: Only do this on the first keydown, not on the typematic repeat signal
				if( this._pressed[event.keyCode] != true ) {

					try { 
							keyDownHandler( event.keyCode );
					}
					catch( e ) {

					}

				}


				this._pressed[event.keyCode] = true;

			},

			onKeyup: function(event) {
				delete this._pressed[event.keyCode];
			}
};

function nextRotation() {

	var newRotation = Player.rotation + 1;

	if( newRotation >= Object.keys(ROTATION_ENUM).length )
		newRotation = 0;

	if( validMove( Player.shape, newRotation, Player.xShape, Player.yShape ) == false ) {
		console.lot("nextRotation: can't rotate here!");
		return;
	}

	Player.rotation = newRotation;

	console.log("Current rotation: " + Player.rotation);
}

function prevRotation() {

	var newRotation = Player.rotation - 1;

	if( newRotation < 0 )
		newRotation = Object.keys(ROTATION_ENUM).length;

	if( validMove( Player.shape, newRotation, Player.xShape, Player.yShape ) == false ) {
		console.lot("nextRotation: can't rotate here!");
		return;
	}

	Player.rotation = newRotation;

	console.log("Current rotation: " + Player.rotation);
}

function keyUp() {

//	console.log( "KeyUp" );
	nextRotation();

	gameDraw();
}

function writeShape() {

	for( var y = 0; y < SHAPE_SIZE; y++ ) {

		for( var x = 0; x < SHAPE_SIZE; x++ ) {

			if( shapeRotate( Player.shape, x, y, Player.rotation ) == 0 )
				continue;

			xDraw = x + Player.xShape;
			yDraw = y + Player.yShape;

			GameGrid[yDraw][xDraw] = Player.shapeColour;
		}
	}

	scanForRemoveLines();
	processRemoveLines();

	resetShape();

	gameDraw();

	// console.log( "GameGrid: " + GameGrid );
}

function moveDown() {

	var yNew = Player.yShape-1;
//	console.log( "KeyLeft" );
	if( validMove( Player.shape, Player.rotation, Player.xShape, yNew ) == false ) {

		writeShape();

		return;
	}

	Player.yShape = yNew;

	gameDraw();

}

function keyDown() {

//	console.log( "KeyDown" );

	moveDown();
	
}

function validMove( shape, rotation, xPos, yPos ) {

	var xDraw;
	var yDraw;

	// console.log( "colour: " + colour );

	for( var y = 0; y < SHAPE_SIZE; y++ ) {

		for( var x = 0; x < SHAPE_SIZE; x++ ) {

			if( shapeRotate( shape, x, y, rotation ) == 0 )
				continue;

			xDraw = x + xPos;
			yDraw = y + yPos;

			if( xDraw < 0 ) {
				console.log("Off left!");
				return false;
			}

			if( xDraw >= GRID_SIZE_X ) {
				console.log("Off right!");
				return false;
			}

			if( yDraw < 0 ) {
				console.log("Off bottom!");
				return false;
			}

			if( GameGrid[yDraw][xDraw] >= 0 ) {
				console.log("Grid collide");
				return false;
			}
		}
	}

	return true;
}

function keyLeft() {

	var xNew = Player.xShape-1;
//	console.log( "KeyLeft" );
	if( validMove( Player.shape, Player.rotation, xNew, Player.yShape ) == false )
		return;

	Player.xShape = xNew;

	gameDraw();
}

function keyRight() {

	var xNew = Player.xShape+1;
//	console.log( "keyRight" );
	if( validMove( Player.shape, Player.rotation, xNew, Player.yShape ) == false )
		return;

	Player.xShape = xNew;

	gameDraw();
}

function getRandomInt(min, max) {

	if( max === undefined )
	{
		console.log( "getRandomInt: No max!");
	}

    return Math.floor(Math.random() * (max - min + 1)) + min;

}

function keyDownHandler( keyCode ) {

//	console.log( "keyDownHandler keyCode: " + keyCode );

	if( keyCode == Key.UP )
		keyUp();

	if( keyCode == Key.LEFT)
		keyLeft();

	if( keyCode == Key.DOWN)
		keyDown();

	if( keyCode == Key.RIGHT)
		keyRight();

}

function processKeys() {

//	console.log("processKeys");

	// if (Key.isDown(Key.UP))
	// 		keyUp();

	// if (Key.isDown(Key.LEFT))
	// 		keyLeft();

	// if (Key.isDown(Key.DOWN))
	// 		keyDown();

	// if (Key.isDown(Key.RIGHT))
	// 		keyRight();


};

function gameUpdatePlaying() {

	console.log("gameUpdatePlaying");

	processKeys();
}

function gameUpdateWaiting() {

	console.log("GAME_STATE_ENUM.WAITING");

}

function gameUpdateGameOver() {

	console.log("GAME_STATE_ENUM.GAMEOVER");

}

function gameUpdate() {

//	console.log("gameUpdate");

	switch( gameState )
	{
		case GAME_STATE_ENUM.WAITING:
			// SJL: Nothing for now... but if a keypress comes in, we can change state...
			gameUpdateWaiting();
		break;

		case GAME_STATE_ENUM.PLAYING:
			// SJL: do the main update loop
			gameUpdatePlaying();
		break;

		case GAME_STATE_ENUM.GAMEOVER:
			// SJL: Nothing for now... but if a keypress comes in, we can change state...
			gameUpdateGameOver();
		break;

		default:
			console.log("EEK! gameUpdate unhandled state: " + gameState);
		break;
	}

}

function drawGameGrid() {

	for( var y = 0; y < GRID_SIZE_Y; y++ ) {

		for( var x = 0; x < GRID_SIZE_X; x++ ) {

			if( GameGrid[y][x] < 0 )
				continue;

			drawGridSquareNested( x, y, COLOURS[GameGrid[y][x]] );
		}
	}

}


function drawStatusText() {

	ctx.font = "20px Arial";
	ctx.fillStyle = "black";
	ctx.textAlign="center";

	var xCen = GRID_SIZE_X * SQUARE_SIZE;
	xCen /= 2;

	var yPos = (GRID_SIZE_Y + 1) * SQUARE_SIZE;

	ctx.textBaseline="center"; 

	var useText;

	switch( gameState )
	{
		case GAME_STATE_ENUM.WAITING:
			useText = STATUS_TEXT_READY;
		break;
		case GAME_STATE_ENUM.PLAYING:
			useText = STATUS_TEXT_PLAYING;
		break;
		case GAME_STATE_ENUM.GAMEOVER:
			useText = STATUS_TEXT_GAMEOVER;
		break;
		default:
			console.log("drawStatusText: unhandled state: " + gameState );
			useText = "unhandled: " + gameState;
		break;
	}

	ctx.fillText( useText, xCen, yPos);

}

function gameDraw() {

//	console.log("gameDraw");

	drawCanvasBackground();

	drawPlaySpaceBackground();

	drawGameGrid();

	drawShape( Player.xShape, Player.yShape, Player.shape, Player.rotation, COLOURS[Player.shapeColour] );

	drawStatusText();

	drawPlaySpaceFrame();

}

function gameFrame() {

//	console.log("gameFrame");

	gameUpdate();
	gameDraw();

}

function stopFPS() {

	// To stop the game, use the following:
	clearInterval( this._intervalId );
	this._intervalId = undefined;
}

function setFPS( newFPS ) {

	if( this._intervalId != false ){

		stopFPS();

	}

	this._intervalId = setInterval( gameFrame, 1000 / newFPS );

}

function getRandomColour() {

	var index = getRandomInt( 0, COLOURS.length-1 );

	return index;

}

function pickRandomColour() {

	var index = getRandomColour();

	Player.shapeColour = index;

	// console.log( "Player.shapeColour: " + Player.shapeColour );

}

function pickRandomShape() {

	var index = getRandomInt( 0, TETRIS_SHAPES.length-1 );

	Player.shape = TETRIS_SHAPES[index];

	// console.log("Picked shape: " + index );

}

function resetShapePosition() {

	Player.xShape = Math.floor( GRID_SIZE_X / 2 );
	Player.yShape = GRID_SIZE_Y - SHAPE_SIZE;
}

function resetShape()
{
	pickRandomColour();
	pickRandomShape();
	resetShapePosition();

}

function resetGrid() {

	for( var y = 0; y < GRID_SIZE_Y; y++ ) {

		for( var x = 0; x < GRID_SIZE_X; x++ ) {

			GameGrid[y][x] = GRID_EMPTY;

		}
	}

}

function randomGrid() {

	for( var y = 0; y < GRID_SIZE_Y; y++ ) {

		for( var x = 0; x < GRID_SIZE_X; x++ ) {

			GameGrid[y][x] = getRandomColour();

		}
	}

}


function gridLineFull( y ) {

	for( var x = 0; x < GRID_SIZE_X; x++ ) {

		if( GameGrid[y][x] < 0 )
			return false;
	}

	return true;
}

function scanForRemoveLines() {

	console.log("scanForRemoveLines: ");

	for( var y = 0; y < GRID_SIZE_Y; y++ ) {

		if( gridLineFull( y ) == false )
			continue;

		removeLines.push( y );
	}

	console.log("Got lines to remove: " + removeLines );
}

function addNewLineToTopOfGameGrid() {
		
	var newLine = [];

	for( var x = 0; x < GRID_SIZE_X; x++ ) {

		newLine.push( GRID_EMPTY );

	}

	GameGrid.push( newLine );

}

function removeLineFromGameGrid( y ) {

	GameGrid.splice( y, 1 );

}

function processRemoveLines() {

	var removed = 0;

	for( var i = 0; i < removeLines.length; i++ ) {

		removeLineFromGameGrid( removeLines[i] - removed );

		addNewLineToTopOfGameGrid();

		removed++;
	}

	// SJL: Assume we've processed all full lines and now we can dump the list
	removeLines = [];

	console.log("Removed " + removed + " lines.");
}

function gameExitState( oldState ) {

	console.log( "gameExitState: " + oldState );

	switch( oldState )
	{
		case GAME_STATE_ENUM.WAITING:
			// SJL: nothing for now
		break;

		case GAME_STATE_ENUM.PLAYING:
			// SJL: nothing for now
		break;

		case GAME_STATE_ENUM.GAMEOVER:
			// SJL: nothing for now
		break;

		default:
			console.log("EEK! gameExitState unhandled state: " + oldState);
		break;
	}

	console.log("exited state: " + oldState );
}

function gameSetState( newState ) {

	console.log( "gameSetState: " + newState );

	gameExitState( gameState );

	gameState = newState;

	switch( gameState )
	{
		case GAME_STATE_ENUM.WAITING:
			// SJL: just set full FPS
			setFPS( GAME_FPS_MAX );
		break;

		case GAME_STATE_ENUM.PLAYING:
			// SJL: set the start speed
			setFPS( GAME_FPS_MIN );
		break;

		case GAME_STATE_ENUM.GAMEOVER:
			// SJL: back to full FPS
			setFPS( GAME_FPS_MAX );
		break;

		default:
			console.log("EEK! gameSetState unhandled state: " + gameState);
		break;
	}

	console.log("Set state: " + gameState );
}

function gameStart() {

	console.log("gameStart");

	window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

	resetGrid();

//	randomGrid();

	resetShape();

	Key.keyDownHandler = keyDownHandler();

	// SJL: notice: this will start updates! (as the state change moves us to the waiting state, setting the FPS
	gameSetState( GAME_STATE_ENUM.PLAYING );

}


gameStart();


