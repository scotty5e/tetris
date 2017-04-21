/**
 * Created by scottlamb on 21/04/2017.
 */

define( function () {
    var shapes = function() {
        const TETRIS_SHAPE_O = [[0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ];

        const TETRIS_SHAPE_I = [[0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];

        const TETRIS_SHAPE_S = [[0, 0, 0, 0],
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ];

        const TETRIS_SHAPE_Z = [[0, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ];

        const TETRIS_SHAPE_L = [[0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0],
        ];

        const TETRIS_SHAPE_J = [[0, 0, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 1, 1, 0],
        ];

        const TETRIS_SHAPE_T = [[0, 0, 0, 0],
            [0, 1, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0],
        ];

        const TETRIS_SHAPES = [TETRIS_SHAPE_O,
            TETRIS_SHAPE_I,
            TETRIS_SHAPE_S,
            TETRIS_SHAPE_Z,
            TETRIS_SHAPE_L,
            TETRIS_SHAPE_J,
            TETRIS_SHAPE_T,
        ];

        return {
            TETRIS_SHAPE_O: TETRIS_SHAPE_O,
            TETRIS_SHAPE_I: TETRIS_SHAPE_I,
            TETRIS_SHAPE_S: TETRIS_SHAPE_S,
            TETRIS_SHAPE_Z: TETRIS_SHAPE_Z,
            TETRIS_SHAPE_L: TETRIS_SHAPE_L,
            TETRIS_SHAPE_J: TETRIS_SHAPE_J,
            TETRIS_SHAPE_T: TETRIS_SHAPE_T,
            TETRIS_SHAPES: TETRIS_SHAPES,

        }
    }

    return shapes();

})
