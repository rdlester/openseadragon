/* global module, asyncTest, $, ok, equal, notEqual, start, test, Util, testLog */

(function () {
    module('SpiralIterator', {
        setup: function () {
            
        },

        teardown: function () {
        
        }
    });

    // ---------
    asyncTest('Standard Iteration', function() {
        var size = 5,
            total = Math.pow(size+1,2),
            iterator = new OpenSeadragon.SpiralIterator({
                bottomRight: new OpenSeadragon.Point(size, size)
            });

        ok(iterator, 'Iterator exists');

        var tilesVisited = [],
            stepCount = 0,
            i, j;

        // init tilesVisited cache
        for (i = 0; i <= size; i++) {
            tilesVisited.push([]);
            for (j = 0; j <= size; j++) {
                tilesVisited[i].push(0);
            }
        }

        // run iterator
        while (iterator.active) {
            ok(tilesVisited[iterator.currentX][iterator.currentY] === 0, 'Tile not already visited');
            ok(iterator.currentX >= iterator.left && iterator.currentX <= iterator.right && iterator.currentY >= iterator.top && iterator.currentY <= iterator.bottom, 'Tile within bounds');
            tilesVisited[iterator.currentX][iterator.currentY] = 1;
            iterator.step();
            if (stepCount === total) {
                ok(false, 'Too many steps');
            }
            stepCount++;
        }

        // check everything worked
        for (i = 0; i <= size; i++) {
            for (j = 0; j <= size; j++) {
                ok(tilesVisited[i][j] === 1, 'Tile at ('+i+','+j+') was visited');
            }
        }

        start();
    });

    asyncTest('Non-standard iteration', function() {

        var left = 11,
            top = 20,
            right = 15,
            bottom = 24,
            iterator = new OpenSeadragon.SpiralIterator({
                topLeft: new OpenSeadragon.Point(left, top),
                bottomRight: new OpenSeadragon.Point(right, bottom),
                start: new OpenSeadragon.Point(11, 20),
                dir: 3
            });

        ok(iterator, 'Iterator exists');

        var tilesVisited = [],
            stepCount = 0,
            i, j;

        // init tilesVisited cache
        for (i = left; i <= right; i++) {
            tilesVisited.push([]);
            for (j = top; j <= bottom; j++) {
                tilesVisited[i-left].push(0);
            }
        }

        // run iterator
        while (iterator.active) {
            console.log('visiting tile ('+iterator.currentX+','+iterator.currentY+')');
            ok(tilesVisited[iterator.currentX-left][iterator.currentY-top] === 0, 'Tile not already visited');
            ok(iterator.currentX >= iterator.left && iterator.currentX <= iterator.right && iterator.currentY >= iterator.top && iterator.currentY <= iterator.bottom, 'Tile within bounds');
            tilesVisited[iterator.currentX-left][iterator.currentY-top] = 1;
            iterator.step();
            // if (stepCount === totalSteps) {
            //     ok(false, 'Too many steps');
            // }
            stepCount++;
        }

        // check everything worked
        for (i = left; i <= right; i++) {
            for (j = top; j <= bottom; j++) {
                ok(tilesVisited[i-left][j-top] === 1, 'Tile at ('+i+','+j+') was visited');
            }
        }

        start();
    });

}());
