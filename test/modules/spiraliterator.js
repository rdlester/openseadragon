/* global module, asyncTest, $, ok, equal, propEqual, notEqual, start, test, Util, testLog */

(function () {
    module('SpiralIterator', {
        setup: function () {

        },

        teardown: function () {

        }
    });

    function runTest( runFunction, expectedTiles ) {
        var tilesVisited = [],
            update = function( x, y ) {
                tilesVisited.push(new OpenSeadragon.Point(x, y));
            };

        runFunction(update);

        equal(tilesVisited.length, expectedTiles.length, 'Correct number of tiles visited');
        for (var i = 0; i < expectedTiles.length; ++i) {
            var tile = expectedTiles[i];
            propEqual(tilesVisited[i], tile, 'Tile visited at ('+tile.x+','+tile.y+')');
        }
        start();
    }

    function testOptimized( topLeft, bottomRight, expectedTiles ) {
        runTest(function( update ) {
            OpenSeadragon.runSpiralIterator(topLeft, bottomRight, update);
        }, expectedTiles);
    }

    function testNaive( topLeft, bottomRight, expectedTiles ) {
        runTest(function( update ) {
            OpenSeadragon.runNaiveSpiralIterator(topLeft, bottomRight, update);
        }, expectedTiles);
    }

    //
    // Optimized.
    //

    // Trivial case.
    asyncTest('Single cell', function() {
        testOptimized(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(0, 0),
                [new OpenSeadragon.Point(0, 0)]);
    });

    // Odd w / h.
    asyncTest('3x3 grid', function() {
        testOptimized(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(2, 2),
                [
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(2, 2),
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(2, 0)
                ]);
    });

    // Even w / h.
    asyncTest('4x4 grid', function() {
        testOptimized(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(3, 3),
                [
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(2, 2),
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(3, 0),
                    new OpenSeadragon.Point(3, 1),
                    new OpenSeadragon.Point(3, 2),
                    new OpenSeadragon.Point(3, 3),
                    new OpenSeadragon.Point(2, 3),
                    new OpenSeadragon.Point(1, 3),
                    new OpenSeadragon.Point(0, 3),
                ]);
    });

    // Rectangular grids.
    // Odd / odd, horizontal.
    asyncTest('5x1 grid', function() {
        testOptimized(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(4, 0),
                [
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(3, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(4, 0),
                    new OpenSeadragon.Point(0, 0)
                ]);
    });

    // Odd / odd, vertical.
    asyncTest('1x5 grid', function() {
        testOptimized(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(0, 4),
                [
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 3),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 4),
                    new OpenSeadragon.Point(0, 0)
                ]);
    });

    // Odd / Even, larger y.
    asyncTest('3x4 grid', function() {
        testOptimized(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(2, 3),
                [
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(2, 2),
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(2, 3),
                    new OpenSeadragon.Point(1, 3),
                    new OpenSeadragon.Point(0, 3),
                ]);
    });

    // Even / odd, larger x.
    asyncTest('4x3 grid', function() {
        testOptimized(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(3, 2),
                [
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(2, 2),
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(3, 0),
                    new OpenSeadragon.Point(3, 1),
                    new OpenSeadragon.Point(3, 2),
                ]);
    });

    // Odd / even, larger difference, horizontal.
    asyncTest('5x2 grid', function() {
        testOptimized(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(4, 1),
                [
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(3, 0),
                    new OpenSeadragon.Point(3, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(4, 0),
                    new OpenSeadragon.Point(4, 1),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 0),
                ]);
    });

    // Even / odd, larger difference, vertical.
    asyncTest('2x5 grid', function() {
        testOptimized(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(1, 4),
                [
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(1, 3),
                    new OpenSeadragon.Point(0, 3),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(1, 4),
                    new OpenSeadragon.Point(0, 4),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                ]);
    });

    // Even / even, vertical.
    asyncTest('4x6', function() {
        testOptimized(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(3, 5),
                [
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(2, 2),
                    new OpenSeadragon.Point(2, 3),
                    new OpenSeadragon.Point(1, 3),
                    new OpenSeadragon.Point(0, 3),
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(3, 1),
                    new OpenSeadragon.Point(3, 2),
                    new OpenSeadragon.Point(3, 3),
                    new OpenSeadragon.Point(3, 4),
                    new OpenSeadragon.Point(2, 4),
                    new OpenSeadragon.Point(1, 4),
                    new OpenSeadragon.Point(0, 4),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(3, 0),
                    new OpenSeadragon.Point(3, 5),
                    new OpenSeadragon.Point(2, 5),
                    new OpenSeadragon.Point(1, 5),
                    new OpenSeadragon.Point(0, 5),
                ]);
    });

    // Even / even, horizontal.
    asyncTest('4x2', function() {
        testOptimized(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(3, 1),
                [
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(3, 0),
                    new OpenSeadragon.Point(3, 1),
                ]);
    });

    // Non-zero top-left.
    asyncTest('Non-zero top-left', function() {
        testOptimized(new OpenSeadragon.Point(1, 1),
                new OpenSeadragon.Point(3, 3),
                [
                    new OpenSeadragon.Point(2, 2),
                    new OpenSeadragon.Point(3, 2),
                    new OpenSeadragon.Point(3, 3),
                    new OpenSeadragon.Point(2, 3),
                    new OpenSeadragon.Point(1, 3),
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(3, 1)
                ]);
    });

    //
    // Naive
    //

    // Trivial case.
    asyncTest('Single cell', function() {
        testNaive(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(0, 0),
                [new OpenSeadragon.Point(0, 0)]);
    });

    // Odd w / h.
    asyncTest('3x3 grid', function() {
        testNaive(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(2, 2),
                [
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(2, 2),
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(2, 0)
                ]);
    });

    // Even w / h.
    asyncTest('4x4 grid', function() {
        testNaive(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(3, 3),
                [
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(2, 2),
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(3, 0),
                    new OpenSeadragon.Point(3, 1),
                    new OpenSeadragon.Point(3, 2),
                    new OpenSeadragon.Point(3, 3),
                    new OpenSeadragon.Point(2, 3),
                    new OpenSeadragon.Point(1, 3),
                    new OpenSeadragon.Point(0, 3),
                ]);
    });

    // Rectangular grid.
    asyncTest('5x1 grid', function() {
        testNaive(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(4, 0),
                [
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(3, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(4, 0),
                    new OpenSeadragon.Point(0, 0)
                ]);
    });
    asyncTest('1x5 grid', function() {
        testNaive(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(0, 4),
                [
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 3),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 4),
                    new OpenSeadragon.Point(0, 0)
                ]);
    });
    asyncTest('3x4 grid', function() {
        testNaive(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(2, 3),
                [
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(2, 2),
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(2, 3),
                    new OpenSeadragon.Point(1, 3),
                    new OpenSeadragon.Point(0, 3),
                ]);
    });
    asyncTest('4x3 grid', function() {
        testNaive(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(3, 2),
                [
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(2, 2),
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(3, 0),
                    new OpenSeadragon.Point(3, 1),
                    new OpenSeadragon.Point(3, 2),
                ]);
    });
    asyncTest('5x2 grid', function() {
        testNaive(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(4, 1),
                [
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(3, 0),
                    new OpenSeadragon.Point(3, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(4, 0),
                    new OpenSeadragon.Point(4, 1),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(0, 0),
                ]);
    });
    asyncTest('2x5 grid', function() {
        testNaive(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(1, 4),
                [
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(1, 3),
                    new OpenSeadragon.Point(0, 3),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(1, 4),
                    new OpenSeadragon.Point(0, 4),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                ]);
    });
    asyncTest('4x6', function() {
        testNaive(new OpenSeadragon.Point(0, 0),
                new OpenSeadragon.Point(3, 5),
                [
                    new OpenSeadragon.Point(1, 2),
                    new OpenSeadragon.Point(2, 2),
                    new OpenSeadragon.Point(2, 3),
                    new OpenSeadragon.Point(1, 3),
                    new OpenSeadragon.Point(0, 3),
                    new OpenSeadragon.Point(0, 2),
                    new OpenSeadragon.Point(0, 1),
                    new OpenSeadragon.Point(1, 1),
                    new OpenSeadragon.Point(2, 1),
                    new OpenSeadragon.Point(3, 1),
                    new OpenSeadragon.Point(3, 2),
                    new OpenSeadragon.Point(3, 3),
                    new OpenSeadragon.Point(3, 4),
                    new OpenSeadragon.Point(2, 4),
                    new OpenSeadragon.Point(1, 4),
                    new OpenSeadragon.Point(0, 4),
                    new OpenSeadragon.Point(0, 0),
                    new OpenSeadragon.Point(1, 0),
                    new OpenSeadragon.Point(2, 0),
                    new OpenSeadragon.Point(3, 0),
                    new OpenSeadragon.Point(3, 5),
                    new OpenSeadragon.Point(2, 5),
                    new OpenSeadragon.Point(1, 5),
                    new OpenSeadragon.Point(0, 5),
                ]);
    });

    // Sanity check over a larger region.
    // The region is rectangular to check spirals leaving the region
    // along one axis before the other.
    asyncTest('Implementations match', function() {
        var i, tile,
            optimizedVisited = [],
            naiveVisited = [],
            topLeft = new OpenSeadragon.Point(0, 0),
            bottomRight = new OpenSeadragon.Point(100, 51),
            optimizedUpdate = function(x, y) {
                optimizedVisited.push(new OpenSeadragon.Point(x,y));
            },
            naiveUpdate = function(x, y) {
                naiveVisited.push(new OpenSeadragon.Point(x,y));
            };

        OpenSeadragon.runSpiralIterator(topLeft, bottomRight, optimizedUpdate);
        OpenSeadragon.runNaiveSpiralIterator(topLeft, bottomRight, naiveUpdate);

        equal(optimizedVisited.length, naiveVisited.length, 'Same number of tiles visited');

        for (i = 0; i < naiveVisited.length; i++) {
            tile = naiveVisited[i];
            propEqual(optimizedVisited[i], tile, 'Tile visited at ('+tile.x+','+tile.y+')');
        }

        start();
    });
}());
