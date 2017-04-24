/**
 * Created by scottlamb on 21/04/2017.
 */


define( function () {

    var gameGrid = function() {

        const GRID_EMPTY = -1;

        function createArray(length) {

            var arr = new Array(length || 0),
                i = length;

            if (arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments, 1);
                while (i--) arr[length - 1 - i] = createArray.apply(this, args);
            }

            return arr;
        }

        const GRID_SIZE_X = 10;
        const GRID_SIZE_Y = 16;

        var Grid = createArray(GRID_SIZE_Y, GRID_SIZE_X);

        return {
                    Grid : Grid,
                    GRID_SIZE_X: GRID_SIZE_X,
                    GRID_SIZE_Y: GRID_SIZE_Y,
                    GRID_EMPTY, GRID_EMPTY,
        }
    }

    return gameGrid();

})
