require.config( {

    paths : { }

} );

require( [ "shapes", "tetris", "gameGrid" ], function( shapes, tetris, gameGrid ) {

// tetris().gameInit();


    console.log( tetris.init() );


})