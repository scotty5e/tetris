require.config( {

    paths : { }

} );

require( [ "shapes", "tetris" ], function( shapes, tetris ) {

// tetris().gameInit();



    console.log( tetris.init() );


})