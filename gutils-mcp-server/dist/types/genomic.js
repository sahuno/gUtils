"use strict";
/**
 * Core type definitions for genomic data structures
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGenomicRange = isGenomicRange;
exports.isGRangesList = isGRangesList;
// Export type guards
function isGenomicRange(obj) {
    return obj &&
        typeof obj.seqnames === 'string' &&
        typeof obj.start === 'number' &&
        typeof obj.end === 'number';
}
function isGRangesList(obj) {
    return obj &&
        typeof obj.id === 'string' &&
        Array.isArray(obj.ranges) &&
        obj.ranges.every(isGenomicRange);
}
//# sourceMappingURL=genomic.js.map