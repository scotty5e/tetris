/**
 * Created by scottlamb on 21/04/2017.
 */


define( function () {

    var gameGrid = function() {

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

        }
    }

    return gameGrid();

})
