(function( $ ) {

/**
 * @class SpiralIterator
 * @classdesc Iterates over a given 2D region in a spiral fashion.
 *
 * An ASCII art example:
 * Each character has the direction of the following step.
 * (| means down)
 *
 *      | < < < <
 *      | | < < ^
 *      | | > ^ ^
 *      | > > > ^
 *      > > > > >
 * 
 * @memberof OpenSeadragon
 * @param {OpenSeadragon.Point} topLeft - Top-left corner of region (defaults to (0,0).
 * @param {OpenSeadragon.Point} bottomRight - Bottom-right corner of region (required).
 * @param {OpenSeadragon.Point} start - Point in region to start spiral (defaults to center).
 * @param {boolean} clockwise - Whether spiral occurs clockwise (default is true).
 * @param {Number} initialDirection - Direction to start spiral in (0 is right, 1 is up, 2 is left, 3 is down) (defaults to 0).
 */
$.SpiralIterator = function( options ) {

    var left = (options.topLeft && options.topLeft.x) || 0,
        top = (options.topLeft && options.topLeft.x) || 0,
        right = options.bottomRight.x,
        bottom = options.bottomRight.y,
        currentX = (options.start && options.start.x) || Math.floor((right - left)/2) + left,
        currentY = (options.start && options.start.y) || Math.floor((bottom - top)/2) + top;

    $.extend( true, this, {
        // valid region
        left: left,
        top: top,
        right: right,
        bottom: bottom,
        // bounding rect of current spiral
        spiralLeft: currentX,
        spiralTop: currentY,
        spiralRight: currentX,
        spiralBottom: currentY,
        // Segment info
        dir: options.initialDirection || 0,
        segmentLength: 1,
        currentStep: 0,
    });

    /**
     * Current X location of iterator
     * @member {Number} currentX
     * @memberof OpenSeadragon.SpiralIterator
     */
    this.currentX = currentX;

    /**
     * Current Y location of iterator
     * @member {Number} currentY
     * @memberof OpenSeadragon.SpiralIterator
     */
    this.currentY = currentY;

    /**
     * True if there are more tiles remaining in the spiral
     * @member {boolean} 
     * @memberof OpenSeadragon.SpiralIterator
     */
    this.active = (left <= right && top <= bottom); // Only active if region is valid

};

$.SpiralIterator.prototype = {

    /**
     * Increments to next location in spiral within bounds
     * @method
     */
    step: function(){
        // Perform step
        this.currentStep += 1;
        switch(this.dir) {
            case 0:
                this.currentX += 1;
                break;
            case 1:
                this.currentY -= 1;
                break;
            case 2:
                this.currentX -= 1;
                break;
            case 3:
                this.currentY += 1;
                break;
            default:
                // throw error
        }

        // check bounds with helper method and exit early if failed
        checkBounds( this );
        if (!this.active) {
            return;
        }

        // If we've performed all the steps in the current segment
        if (this.currentStep === this.segmentLength) {
            // Increment spiral bounds
            switch (this.dir) {
                case 0:
                    this.spiralRight += 1;
                    break;
                case 1:
                    this.spiralTop -= 1;
                    break;
                case 2:
                    this.spiralLeft -= 1;
                    break;
                case 3:
                    this.spiralBottom += 1;
                    break;
                default:
                    // throw error
            }

            // Begin a new segment
            this.dir = (this.dir + 1) % 4;
            this.currentStep = 0;
            // Only increase segment length when dir is horizontal
            this.segmentLength += (this.dir%2 === 0) ? 1 : 0;
        }
    }
};

/**
 * If we've gone out of bounds, loop around to next open spot in spiral.
 * If we do a full circle, terminate the iterator.
 *
 * ASCII art example of how to handle going out of bounds
 * x means tile has already been stepped to
 * $ was starting point
 * - is empty tile
 * ~ is out of bounds
 * ! is current out of bounds location
 * Arrow is location we will jump to (in direction to proceed in)
 *
 * Case 1: we have stepped off the edge
 *      - - < ~
 *      x x x ~
 *      x $ x ~
 *      x x x !
 *      - - - ~
 *
 * Case 2: we have previously tried to fix bounds but are still out
 *      ~ ~ ~ ! ~
 *      | x x x ~
 *      - x $ x ~
 *      - x x x !
 *
 * @method
 * @private
 * @param {OpenSeadragon.SpiralIterator} iterator
 */
// TODO: reset currentStep and segmentLength!!!
function checkBounds( iterator ) {
    var boundsFailures = 0;
    while ( iterator.currentX < iterator.left ||
            iterator.currentX > iterator.right ||
            iterator.currentY < iterator.top ||
            iterator.currentY > iterator.bottom ) {
                boundsFailures += 1;
                if (boundsFailures >= 4) {
                    iterator.active = false;
                    return;
                }

                // loop to next potentially open spot
                if (iterator.currentX > iterator.right) {
                    iterator.currentX = iterator.right;
                    iterator.spiralRight = iterator.right;
                    iterator.currentY = iterator.spiralTop - 1;
                    iterator.spiralTop = Math.max(iterator.top,
                            iterator.spiralTop-1);
                    iterator.dir = 2;
                    iterator.segmentLength++;
                    iterator.currentStep = iterator.segmentLength - (iterator.spiralRight - iterator.spiralLeft - 1);
                }
                else if (iterator.currentY < iterator.top) {
                    iterator.currentX = iterator.spiralLeft - 1;
                    iterator.currentY = iterator.top;
                    iterator.spiralTop = iterator.top;
                    iterator.spiralLeft = Math.max(iterator.left,
                            iterator.spiralLeft-1);
                    iterator.dir = 3;
                    iterator.currentStep = iterator.segmentLength - (iterator.spiralBottom + 1 - iterator.spiralTop);
                }
                else if (iterator.currentX < iterator.left) {
                    iterator.currentX = iterator.left;
                    iterator.spiralLeft = iterator.left;
                    iterator.currentY = iterator.spiralBottom + 1;
                    iterator.spiralBottom = Math.min(iterator.bottom,
                            iterator.spiralBottom+1);
                    iterator.dir = 0;
                    iterator.segmentLength++;
                    iterator.currentStep = iterator.segmentLength - (iterator.spiralRight + 1 - iterator.spiralLeft);
                }
                else if (iterator.currentY > iterator.bottom) {
                    iterator.currentX = iterator.spiralRight + 1;
                    iterator.currentY = iterator.bottom;
                    iterator.spiralBottom = iterator.bottom;
                    iterator.spiralRight = Math.min(iterator.right,
                            iterator.spiralRight+1);
                    iterator.dir = 1;
                    iterator.currentStep = iterator.segmentLength - (iterator.spiralBottom - iterator.spiralTop - 1);
                }
            }

}

}( OpenSeadragon ));
