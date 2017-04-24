/**
 * Created by scottlamb on 24/04/2017.
 */

define ( function() {

    var colours = function () {

        const COLOUR_PAIR_RED = {
                                            LIGHT: "#FF0000",
                                            DARK: "#880000"
        };

        const COLOUR_PAIR_GREEN = {
                                            LIGHT: "#00FF00",
                                            DARK: "#008800"
        };

        const COLOUR_PAIR_BLUE = {
                                            LIGHT: "#0000FF",
                                            DARK: "#000088"
        };

        const COLOUR_PAIR_YELLOW = {
                                            LIGHT: "#FFFF00",
                                            DARK: "#888800"
        };

        const COLOUR_PAIR_TURQUOISE = {
                                            LIGHT: "#00FFFF",
                                            DARK: "#008888"
        };

        const COLOUR_PAIR_PURPLE        = {
                                            LIGHT: "#FF00FF",
                                            DARK: "#880088"
        };

        const COLOUR_WHITE                  = "#FFFFFF";
        const COLOUR_LIGHT_GREY             = "#CCCCCC";
        const COLOUR_BLACK                  = "#000000";

        const COLOURS                       = [ COLOUR_PAIR_RED,
                                            COLOUR_PAIR_GREEN,
                                            COLOUR_PAIR_BLUE,
                                            COLOUR_PAIR_YELLOW,
                                            COLOUR_PAIR_TURQUOISE,
                                            COLOUR_PAIR_PURPLE
        ];


        return {
                    COLOUR_PAIR_RED         : COLOUR_PAIR_RED,
                    COLOUR_PAIR_GREEN       : COLOUR_PAIR_GREEN,
                    COLOUR_PAIR_BLUE        : COLOUR_PAIR_BLUE,
                    COLOUR_PAIR_YELLOW      : COLOUR_PAIR_YELLOW,
                    COLOUR_PAIR_TURQUOISE   : COLOUR_PAIR_TURQUOISE,
                    COLOUR_PAIR_PURPLE      : COLOUR_PAIR_PURPLE,
                    COLOUR_WHITE            : COLOUR_WHITE,
                    COLOUR_LIGHT_GREY       : COLOUR_LIGHT_GREY,
                    COLOUR_BLACK            : COLOUR_BLACK,
                    COLOURS                 : COLOURS,
        }

    }

    return colours();

})


