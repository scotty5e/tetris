
define ( [ "shapes", "gameGrid", "player", "colours" ], function( shapes, gameGrid, player, colours ) {

	var tetris = function( ) {

		console.log(colours);

		const SQUARE_SIZE = 32;
		const SHAPE_SIZE = 4;
		const BORDER_SIZE = 2;

		const GAME_STATE_ENUM = {
			NONE: 0,
			WAITING: 1,
			PLAYING: 2,
			GAMEOVER: 3,
		};

		var gameState = GAME_STATE_ENUM.NONE;

		const GRID_EMPTY = -1;

		const GAME_FPS_MAX = 25;
		const GAME_FPS_MIN = 2;

		const GRID_SIZE_X = 10;
		const GRID_SIZE_Y = 16;

		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");

		const STATUS_TEXT_READY = "Ready to play!";
		const STATUS_TEXT_PLAYING = "PLAY SOME TETRIS!";
		const STATUS_TEXT_GAMEOVER = "GAME OVER!";

		var removeLines = [];

		function drawCanvasBackground() {

			ctx.beginPath();
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = colours.COLOUR_LIGHT_GREY;
			ctx.fill();
			ctx.closePath();

		}

		function drawPlaySpaceBackground() {

			ctx.beginPath();
			ctx.rect(0, 0, GRID_SIZE_X * SQUARE_SIZE, GRID_SIZE_Y * SQUARE_SIZE);
			ctx.fillStyle = colours.COLOUR_WHITE;
			ctx.fill();
			ctx.closePath();

		}

		function drawPlaySpaceFrame() {
			ctx.beginPath();
			ctx.rect(0, 0, GRID_SIZE_X * SQUARE_SIZE, GRID_SIZE_Y * SQUARE_SIZE);
			ctx.stroke();
		}

		function drawSquare(x, y, size, colour) {
			ctx.beginPath();
			ctx.rect(x, y, size, size);
			ctx.fillStyle = colour;
			ctx.fill();
			ctx.closePath();

		}

		function drawGridSquare(x, y, colour) {
			x *= SQUARE_SIZE;
			y *= SQUARE_SIZE;

			ctx.beginPath();
			ctx.rect(x, y, SQUARE_SIZE, SQUARE_SIZE);
			ctx.fillStyle = colour;
			ctx.fill();
			ctx.closePath();

		}

		function drawSquareNested(x, y, size, border, colour) {
			drawSquare(x, y, size, colour.LIGHT);
			x += border;
			y += border;
			drawSquare(x, y, size - (border * 2), colour.DARK);

		}

		function drawGridSquareNested(x, y, colour) {
			x *= SQUARE_SIZE;
			y = GRID_SIZE_Y - (y + 1);
			y *= SQUARE_SIZE;


			drawSquareNested(x, y, SQUARE_SIZE, BORDER_SIZE, colour);
		}

		function shapeRotate(theShape, x, y, rotation) {

			switch (rotation) {
				case player.ROTATION_ENUM.NONE: {
					return theShape[y][x];
				}
				case player.ROTATION_ENUM.RIGHT: {
					return theShape[x][SHAPE_SIZE - (y + 1)];
				}
				case player.ROTATION_ENUM.DOWN: {
					return theShape[SHAPE_SIZE - (y + 1)][SHAPE_SIZE - (x + 1)];
				}
				case player.ROTATION_ENUM.LEFT: {
					return theShape[SHAPE_SIZE - (x + 1)][y];
				}
			}
		}


		function drawShape(xPos, yPos, theShape, rotation, colour) {

			var xDraw;
			var yDraw;

			// console.log( "colour: " + colour );

			for (var y = 0; y < SHAPE_SIZE; y++) {

				for (var x = 0; x < SHAPE_SIZE; x++) {

					if (shapeRotate(theShape, x, y, rotation) == 0)
						continue;

					xDraw = x + xPos;
					yDraw = y + yPos;

					drawGridSquareNested(xDraw, yDraw, colour);

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

			_keyDownHandler: undefined,

			isDown: function (keyCode) {
				return this._pressed[keyCode];
			},

			onKeydown: function (event) {

				// SJL: Note: Only do this on the first keydown, not on the typematic repeat signal
				if (this._pressed[event.keyCode] != true) {

					try {
						// SJL: goddamnit! I messed this up. First, I was shadowing a variable in the main class, bad idea to reuse the name
						// secondly, I didn't realise that I needed to use "this" when in the context of an object. BUGGER.
						this._keyDownHandler(event.keyCode);
					}
					catch (e) {
						console.log("Keydown handler exception: " + this._keyDownHandler);
					}

				}


				this._pressed[event.keyCode] = true;

			},

			onKeyup: function (event) {
				delete this._pressed[event.keyCode];
			}
		};


		function keyUp() {

	//	console.log( "KeyUp" );
			player.nextRotation();

			gameDraw();
		}

		function writeShape() {

			for (var y = 0; y < SHAPE_SIZE; y++) {

				for (var x = 0; x < SHAPE_SIZE; x++) {

					if (shapeRotate(player.shape, x, y, player.rotation) == 0)
						continue;

					xDraw = x + player.xShape;
					yDraw = y + player.yShape;

                    gameGrid.Grid[yDraw][xDraw] = player.colourIndex;
				}
			}

			scanForRemoveLines();
			processRemoveLines();

			resetShape();

			gameDraw();

			// console.log( "gameGrid.Grid: " + gameGrid.Grid );
		}


		function keyDown() {

	//	console.log( "KeyDown" );

			player.moveDown();

		}

		function validMove(shape, rotation, xPos, yPos) {

			var xDraw;
			var yDraw;

			// console.log( "colour: " + colour );

			for (var y = 0; y < SHAPE_SIZE; y++) {

				for (var x = 0; x < SHAPE_SIZE; x++) {

					if (shapeRotate(shape, x, y, rotation) == 0)
						continue;

					xDraw = x + xPos;
					yDraw = y + yPos;

					if (xDraw < 0) {
						console.log("Off left!");
						return false;
					}

					if (xDraw >= GRID_SIZE_X) {
						console.log("Off right!");
						return false;
					}

					if (yDraw < 0) {
						console.log("Off bottom!");
						return false;
					}

					if (gameGrid.Grid[yDraw][xDraw] >= 0) {
						console.log("Grid collide");
						return false;
					}
				}
			}

			return true;
		}

		function keyLeft() {

			player.moveLeft();

			gameDraw();
		}

		function keyRight() {

			player.moveRight();

			gameDraw();
		}

		function getRandomInt(min, max) {

			if (max === undefined) {
				console.log("getRandomInt: No max!");
			}

			return Math.floor(Math.random() * (max - min + 1)) + min;

		}

		function gameKeyDownHandlerWaiting(keyCode) {

			console.log("gameKeyDownHandlerWaiting");

			if (keyCode == Key.RETURN || keyCode == Key.SPACE) {

				gameSetState(GAME_STATE_ENUM.PLAYING);

			}

		}

		function gameKeyDownHandlerPlaying(keyCode) {

			console.log("gameKeyDownHandler");

			if (keyCode == Key.LEFT)
				keyLeft();

			if (keyCode == Key.DOWN)
				keyDown();

			if (keyCode == Key.RIGHT)
				keyRight();

			if (keyCode == Key.UP)
				keyUp();

		}

		function gameKeyDownHandlerGameOver(keyCode) {

			console.log("gameKeyDownHandlerGameOver");

			if (keyCode == Key.RETURN || keyCode == Key.SPACE) {

				gameSetState(GAME_STATE_ENUM.WAITING);

			}
		}

		function gameKeyDownHandler(keyCode) {

	//	console.log( "gameKeyDownHandler keyCode: " + keyCode );

			switch (gameState) {
				case GAME_STATE_ENUM.WAITING:
					gameKeyDownHandlerWaiting(keyCode);
					break;

				case GAME_STATE_ENUM.PLAYING:
					gameKeyDownHandlerPlaying(keyCode);
					break;

				case GAME_STATE_ENUM.GAMEOVER:
					gameKeyDownHandlerGameOver(keyCode);
					break;

				default:
					// console.log("EEK! gameKeyDownHandler unhandled state: " + gameState);
					break;
			}

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

			// console.log("gameUpdatePlaying");

			processKeys();

//			moveDown();
		}

		function gameUpdateWaiting() {

			// console.log("GAME_STATE_ENUM.WAITING");

		}

		function gameUpdateGameOver() {

			// console.log("GAME_STATE_ENUM.GAMEOVER");

		}

		function gameUpdate() {

	//	console.log("gameUpdate");

			switch (gameState) {
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

			for (var y = 0; y < GRID_SIZE_Y; y++) {

				for (var x = 0; x < GRID_SIZE_X; x++) {

					if (gameGrid.Grid[y][x] < 0)
						continue;

					drawGridSquareNested(x, y, colours.COLOURS[gameGrid.Grid[y][x]]);
				}
			}

		}


		function drawStatusText() {

			ctx.font = "20px Arial";
			ctx.fillStyle = "black";
			ctx.textAlign = "center";

			var xCen = GRID_SIZE_X * SQUARE_SIZE;
			xCen /= 2;

			var yPos = (GRID_SIZE_Y + 1) * SQUARE_SIZE;

			ctx.textBaseline = "center";

			var useText;

			switch (gameState) {
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
					console.log("drawStatusText: unhandled state: " + gameState);
					useText = "unhandled: " + gameState;
					break;
			}

			ctx.fillText(useText, xCen, yPos);

		}

		function gameDraw() {

	//	console.log("gameDraw");

			drawCanvasBackground();

			drawPlaySpaceBackground();

			drawGameGrid();

			drawShape(player.xShape, player.yShape, player.shape, player.rotation, colours.COLOURS[player.colourIndex]);

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
			clearInterval(this._intervalId);
			this._intervalId = undefined;
		}

		function setFPS(newFPS) {

			if (this._intervalId != false) {

				stopFPS();

			}

			this._intervalId = setInterval(gameFrame, 1000 / newFPS);

		}

		function getRandomColour() {

			var index = getRandomInt(0, colours.COLOURS.length - 1);

			return index;

		}

		function pickRandomColour() {

			var index = getRandomColour();

			player.colourIndex = index;

			// console.log( "player.colourIndex: " + player.colourIndex );

		}

		function pickRandomShape() {

			var index = getRandomInt(0, shapes.TETRIS_SHAPES.length - 1);

			player.shape = shapes.TETRIS_SHAPES[index];

			// console.log("Picked shape: " + index );

		}

		function resetShapePosition() {

			player.xShape = Math.floor((GRID_SIZE_X - SHAPE_SIZE) / 2);
			player.yShape = GRID_SIZE_Y - SHAPE_SIZE;
		}

		function gameTestGameOver() {

			if (validMove(player.shape, player.rotation, player.xShape, player.yShape) == false) {

				gameSetState(GAME_STATE_ENUM.GAMEOVER);
			}
		}

		function resetShape() {
			pickRandomColour();
			pickRandomShape();
			resetShapePosition();

			// SJL: and, at this point, we could well be about to die!
			gameTestGameOver();

		}

		function resetGrid() {

			for (var y = 0; y < GRID_SIZE_Y; y++) {

				for (var x = 0; x < GRID_SIZE_X; x++) {

                    gameGrid.Grid[y][x] = GRID_EMPTY;

				}
			}

		}

		function gridLineFull(y) {

			for (var x = 0; x < GRID_SIZE_X; x++) {

				if (gameGrid.Grid[y][x] < 0)
					return false;
			}

			return true;
		}

		function scanForRemoveLines() {

			console.log("scanForRemoveLines: ");

			for (var y = 0; y < GRID_SIZE_Y; y++) {

				if (gridLineFull(y) == false)
					continue;

				removeLines.push(y);
			}

			console.log("Got lines to remove: " + removeLines);
		}

		function addNewLineToTopOfGameGrid() {

			var newLine = [];

			for (var x = 0; x < GRID_SIZE_X; x++) {

				newLine.push(GRID_EMPTY);

			}

            gameGrid.Grid.push(newLine);

		}

		function removeLineFromGameGrid(y) {

            gameGrid.Grid.splice(y, 1);

		}

		function processRemoveLines() {

			var removed = 0;

			for (var i = 0; i < removeLines.length; i++) {

				removeLineFromGameGrid(removeLines[i] - removed);

				addNewLineToTopOfGameGrid();

				removed++;
			}

			// SJL: Assume we've processed all full lines and now we can dump the list
			removeLines = [];

			console.log("Removed " + removed + " lines.");
		}

		function gameExitState(oldState) {

			console.log("gameExitState: " + oldState);

			switch (oldState) {
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

			console.log("exited state: " + oldState);
		}

		function gameSetStateWaiting() {

			console.log("gameSetStateWaiting");

			// SJL: just set full FPS
			setFPS(GAME_FPS_MAX);

		}


		function gameSetStatePlaying() {

			console.log("gameSetStatePlaying");

			resetGrid();

			resetShape();

			// SJL: set the start speed
			setFPS(GAME_FPS_MIN);

		}

		function gameSetStateGameOver() {

			console.log("gameSetStateGameOver");

			// SJL: just set full FPS
			setFPS(GAME_FPS_MAX);

		}

		function gameSetState(newState) {

			console.log("gameSetState: " + newState);

			gameExitState(gameState);

			gameState = newState;

			switch (gameState) {
				case GAME_STATE_ENUM.WAITING:
					gameSetStateWaiting();
					break;

				case GAME_STATE_ENUM.PLAYING:
					gameSetStatePlaying();
					break;

				case GAME_STATE_ENUM.GAMEOVER:
					gameSetStateGameOver();
					break;

				default:
					console.log("EEK! gameSetState unhandled state: " + gameState);
					break;
			}

			console.log("Set state: " + gameState);
		}


		function gameInit() {

			console.log("gameInit");

			window.addEventListener('keyup', function (event) {
				Key.onKeyup(event);
			}, false);
			window.addEventListener('keydown', function (event) {
				Key.onKeydown(event);
			}, false);
			Key._keyDownHandler = gameKeyDownHandler;

			resetGrid();

			resetShape();

			// SJL: notice: this will start updates! (as the state change moves us to the waiting state, setting the FPS
			gameSetState(GAME_STATE_ENUM.WAITING);

		}

		return {
						validMove				: validMove,
            			gameInit 				: gameInit,
            			gameDraw				: gameDraw,
            			writeShape				: writeShape,
		};

	};

	return tetris();

});


