/**
 * Created by scottlamb on 24/04/2017.
 */

define ( [ "shapes", "colours" ], function( shapes, colours ) {

    var player = function () {

        const ROTATION_ENUM = {

                                NONE    : 0,
                                RIGHT   : 1,
                                DOWN    : 2,
                                LEFT    : 3,
            };

        var shape               = shapes.TETRIS_SHAPE_T;
        var xShape              = 0;
        var yShape              = 0;
        var rotation            = ROTATION_ENUM.NONE;
        var shapeColour         = colours.COLOUR_PAIR_RED;

        return {
                    shape       : shape,
                    xShape      : xShape,
                    yShape      : yShape,
                    rotation    : rotation,
                    shapeColour : shapeColour,
        };

    }

    return player();

})


