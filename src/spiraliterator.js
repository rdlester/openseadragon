/*
 * OpenSeadragon - SpiralIterator
 *
 * Copyright (C) 2009 CodePlex Foundation
 * Copyright (C) 2010-2013 OpenSeadragon contributors
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 *
 * - Neither the name of CodePlex Foundation nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function( $ ) {

/**
 * Iterates over a given 2D region in a spiral fashion,
 * calling a provided function at each point.
 *
 * An ASCII art example:
 * Each character has the direction of the following step.
 * (| means down, x means end)
 *
 *      | < < < <
 *      | | < < ^
 *      | | > ^ ^
 *      | > > > ^
 *      > > > > x
 *
 * @param {OpenSeadragon.Point} topLeft - Top-left corner of region.
 * @param {OpenSeadragon.Point} bottomRight - Bottom-right corner of region (required).
 * @param {Function} update - Function to call on each location. Takes two Numbers.
 */
$.runSpiralIterator = function( topLeft, bottomRight, update ) {
    var left = topLeft.x,
        top = topLeft.y,
        right = bottomRight.x,
        bottom = bottomRight.y,

        // Size of the region being iterated over.
        w = right - left + 1,
        h = bottom - top + 1,

        // The "center" point, from which iteration starts.
        // The point is the floor of the actual center; doing this keeps the
        // spiral fully within the region if the region is square.
        midX = Math.floor((w - 1) * 0.5) + left,
        midY = Math.floor((h - 1) * 0.5) + top,

        // The current point in the iteration.
        currentX = midX,
        currentY = midY,

        // The "radius" of the current part of the spiral, measured along a
        // single axis. The true radius is the ceil of the "radius", but
        // using fractional values simplifies updates.
        r = 0.5,

        // The current direction of iteration.
        d = 1,

        // The single-axis radius at which iteration will terminate.
        maxRX = right - midX + 0.5 * (w % 2),
        maxRY = bottom - midY + 0.5 * (h % 2);

    while (true) {
        // Determine if the current radius exceeds the max on any axis.
        var mPastOrAtCols = maxRX <= r,
            mAtRows = maxRY === r,
            mPastRows = maxRY < r;

        // Number of steps in both axes will be the same except in special cases.
        var steps = r - d * (currentX - midX),
            stepsX = steps,
            stepsY = steps;
        if (mPastRows) {
            // Do not iterate at all; all rows in the spiral have been
            // traversed; only columns remain if anything.
            stepsX = 0;
        } else if (mPastOrAtCols) {
            // All columns have been traversed. Limit traversal to within the
            // region.
            stepsX = w;
        }
        // Traverse the row.
        for (; stepsX > 0; --stepsX) {
            update(currentX, currentY);
            currentX += d;
        }
        if (mPastOrAtCols) {
            // If we are traversing rows to the end of the region, the last
            // increment of currentX will take us out of the region. Decrement
            // to bring us back inside.
            currentX -= d;
        }

        if (mPastOrAtCols && mPastRows) {
            // End early if we are done.
            // If r === maxRY, we still need to iterate over a last column.
            break;
        }

        if (mPastRows) {
            // All columns have been traversed. Limit traversal to within the
            // region.
            stepsY = h;
        } else if (mPastOrAtCols) {
            // Do not iterate at all; all columns in the spiral have been
            // traversed; only rows remain if anything.
            stepsY = 0;
        }
        // Traverse the column.
        for (; stepsY > 0; --stepsY) {
            update(currentX, currentY);
            currentY += d;
        }
        if (mAtRows || mPastRows) {
            // If we are traversing columns to the end of the region, the last
            // increment of currentX will take us out of the region. Decrement
            // to bring us back inside.
            currentY -= d;
        }

        if (mPastOrAtCols && (mAtRows || mPastRows)) {
            break;
        }

        if (mPastOrAtCols) {
            // Directly flip currentY to the next row, where it would have
            // been had we not skipped iteration on y above.
            currentY = midY + d * Math.ceil(r);
        }

        // Flip the direction.
        d *= -1;

        // Increment r by 0.5. Note that this will only increment the
        // true radius every two steps, when d === 1.
        r += 0.5;

        if (mAtRows || mPastRows) {
            // Directly flip currentX to the next column, where it would be
            // were we not about to skip iteration in the next pass.
            // Perform this after updating r, as the skipped iteration is
            // with the new value of r.
            currentX = midX + d * Math.ceil(r);
        }
    }
};

/**
 * @private
 * Runs a spiral iteration, as defined above.
 * Slower than {@link OpenSeadragon#runSpiralIterator},
 * especially when iterating over rectangular regions.
 * Implemented for reference and testing.
 * @param {OpenSeadragon.Point} topLeft - Top-left corner of region.
 * @param {OpenSeadragon.Point} bottomRight - Bottom-right corner of region (required).
 * @param {Function} update - Function to call on each location. Takes two Numbers.
 */
$.runNaiveSpiralIterator = function( topLeft, bottomRight, update ) {
    var left = topLeft.x,
        top = topLeft.y,
        right = bottomRight.x,
        bottom = bottomRight.y,

        w = right - left + 1,
        h = bottom - top + 1,

        midX = Math.floor((w - 1) * 0.5) + left,
        midY = Math.floor((h - 1) * 0.5) + top,

        currentX = midX,
        currentY = midY,

        r = 0.5,
        d = 1;

    while (true) {
        // Number of steps will be the same in x and y direction.
        var steps = r - d * (currentX - midX),
            stepsX = steps,
            stepsY = steps;
        for (; stepsX > 0; --stepsX) {
            if (left <= currentX && currentX <= right &&
                    top <= currentY && currentY <= bottom) {
                update(currentX, currentY);
            }
            currentX += d;
        }
        for (; stepsY > 0; --stepsY) {
            if (left <= currentX && currentX <= right &&
                    top <= currentY && currentY <= bottom) {
                update(currentX, currentY);
            }
            currentY += d;
        }
        if (!(left <= currentX && currentX <= right) &&
                !(top <= currentY && currentY <= bottom)) {
            break;
        }
        d *= -1;
        r += 0.5;
    }
};

})( OpenSeadragon );
