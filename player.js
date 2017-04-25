/**
 * Created by scottlamb on 24/04/2017.
 */

define ( [ "shapes", "colours", "tetris", "gameGrid" ], function( shapes, colours, tetris, gameGrid ) {

    var player = function () {

        const ROTATION_ENUM = {

                                NONE    : 0,
                                RIGHT   : 1,
                                DOWN    : 2,
                                LEFT    : 3,
        };

        // var myID = 54321;
        var myID = Math.floor( Math.random() * 10000 );

        this.shape              = shapes.TETRIS_SHAPE_T;
        this.xShape             = 0;
        this.yShape             = 0;
        this.rotation           = ROTATION_ENUM.NONE;
        this.colourIndex        = 0;

        function moveLeft() {

            var xNew = this.xShape - 1;
            //	console.log( "KeyLeft" );

            var tetris = require("tetris");

            if (tetris.validMove( this.shape, this.rotation, xNew, this.yShape) == false)
                return;

            this.xShape = xNew;

        }

        function moveRight() {

            var xNew = this.xShape + 1;
            //	console.log( "keyRight" );

            var tetris = require("tetris");

            if (tetris.validMove( this.shape, this.rotation, xNew, this.yShape) == false)
                return;

            this.xShape = xNew;
        }

        function moveDown() {

            var yNew = this.yShape - 1;

            var tetris = require("tetris");

            //	console.log( "KeyLeft" );
            if (tetris.validMove(this.shape, this.rotation, this.xShape, yNew) == false) {

                tetris.writeShape();

                resetShape();

                return;
            }

            this.yShape = yNew;

            tetris.gameDraw();

        }

        function prevRotation() {

            var newRotation = this.rotation - 1;

            if (newRotation < 0)
                newRotation = Object.keys(ROTATION_ENUM).length;

            var tetris = require("tetris");

            if (validMove(this.shape, newRotation, this.xShape, this.yShape) == false) {
                console.lot("nextRotation: can't rotate here!");
                return;
            }

            this.rotation = newRotation;

            console.log("Current rotation: " + this.rotation);
        }

        function nextRotation() {

            console.log("iD: " + myID );

            var newRotation = this.rotation + 1;

            if (newRotation >= Object.keys(ROTATION_ENUM).length)
                newRotation = 0;

            var tetris = require("tetris");

            if ( tetris.validMove(this.shape, newRotation, this.xShape, this.yShape) == false ) {
                console.log("nextRotation: can't rotate here!");
                return;
            }

            this.rotation = newRotation;

            console.log("plain rotation: " + rotation + " this.rotation: " + this.rotation);
            console.log("Current rotation: " + rotation);
        }


        function getRandomColour() {

            var index = getRandomInt(0, colours.COLOURS.length - 1);

            return index;

        }


        function getRandomInt(min, max) {

            if (max === undefined) {
                console.log("getRandomInt: No max!");
            }

            return Math.floor(Math.random() * (max - min + 1)) + min;

        }


        function pickRandomColour() {

            var index = getRandomColour();

            this.colourIndex = index;

            // console.log( "this.colourIndex: " + this.colourIndex );

        }

        function pickRandomShape() {

            var index = getRandomInt(0, shapes.TETRIS_SHAPES.length - 1);

            this.shape = shapes.TETRIS_SHAPES[index];

            // console.log("Picked shape: " + index );

        }

        function resetShapePosition() {

            var tetris = require("tetris");

            this.xShape = Math.floor((gameGrid.GRID_SIZE_X - tetris.SHAPE_SIZE) / 2);
            this.yShape = gameGrid.GRID_SIZE_Y - tetris.SHAPE_SIZE;
        }

        function resetShape() {

            pickRandomColour();
            pickRandomShape();
            resetShapePosition();

            // SJL: and, at this point, we could well be about to die!
            var tetris = require("tetris");

            tetris.gameTestGameOver();

        }


        return {
                    shape           : shape,
                    xShape          : this.xShape,
                    yShape          : this.yShape,
                    rotation        : rotation,
                    colourIndex     : colourIndex,
                    ROTATION_ENUM   : ROTATION_ENUM,
                    myID            : myID,
                    moveLeft        : moveLeft,
                    moveRight       : moveRight,
                    moveDown        : moveDown,
                    nextRotation    : nextRotation,
                    resetShape      : resetShape,
        };

    }

    return player();

})


