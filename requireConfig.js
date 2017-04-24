require.config( {

    paths : { }

} );

require( [ "shapes", "tetris", "gameGrid", "player", "colours" ], function(shapes, tetris, gameGrid, player, colours ) {

// tetris().gameInit();


    console.log( tetris.init() );


})