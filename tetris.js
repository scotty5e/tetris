
const SQUARE_SIZE 						= 16;

const SHAPE_SIZE						= 4;
const BORDER_SIZE						= 2;

const ROTATION_ENUM						= {
												NONE 	: 0,
												RIGHT	: 1,
												DOWN	: 2,
												LEFT	: 3,
};

const TETRIS_SHAPE_O					= [ 	[ 0, 0, 0, 0 ],
												[ 0, 1, 1, 0 ],
												[ 0, 1, 1, 0 ],
												[ 0, 0, 0, 0 ],
];

const TETRIS_SHAPE_I					= [ 	[ 0, 0, 0, 0 ],
												[ 0, 1, 1, 0 ],
												[ 0, 1, 1, 0 ],
												[ 0, 0, 0, 0 ],
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

const COLOURS 							= [		COLOUR_RED,
												COLOUR_GREEN,
												COLOUR_BLUE,
												COLOUR_YELLOW,
												COLOUR_TURQUOISE,
												COLOUR_PURPLE
];



var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

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
	y *= SQUARE_SIZE;

	drawSquareNested( x, y, SQUARE_SIZE, BORDER_SIZE, colour, colour );
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
			return theShape[x][y];
		}
		case ROTATION_ENUM.DOWN:
		{
			return theShape[SHAPE_SIZE-(y+1)][x];
		}
		case ROTATION_ENUM.LEFT:
		{
			return theShape[SHAPE_SIZE-(x+1)][SHAPE_SIZE-(y+1)];
		}
	}
}


function drawShape( xPos, yPos, theShape, rotation, colour ) {

	var xDraw;
	var yDraw;

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

drawShape( 0, 0, TETRIS_SHAPE_T, ROTATION_ENUM.LEFT, COLOUR_PURPLE );





