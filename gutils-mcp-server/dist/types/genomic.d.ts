/**
 * Core type definitions for genomic data structures
 */
export type Strand = '+' | '-' | '*';
export interface GenomicRange {
    seqnames: string;
    start: number;
    end: number;
    strand?: Strand;
    width?: number;
    metadata?: Record<string, any>;
}
export interface GRangesList {
    id: string;
    ranges: GenomicRange[];
    metadata?: Record<string, any>;
}
export interface Seqinfo {
    seqnames: string[];
    seqlengths: number[];
    isCircular?: boolean[];
    genome?: string;
}
export interface DataTable {
    columns: Record<string, any[]>;
    nrows: number;
}
export interface OverlapResult {
    queryHits: number[];
    subjectHits: number[];
    metadata?: Record<string, any>;
}
export interface RangeOperation {
    type: 'union' | 'intersect' | 'setdiff' | 'reduce' | 'disjoin';
    ignoreStrand?: boolean;
    by?: string[];
}
export interface AggregationOptions {
    fun?: 'sum' | 'mean' | 'median' | 'min' | 'max' | 'count';
    na_rm?: boolean;
    weight?: string;
}
export interface TileOptions {
    width: number;
    stranded?: boolean;
}
export interface FindOverlapsOptions {
    maxgap?: number;
    minoverlap?: number;
    type?: 'any' | 'start' | 'end' | 'within' | 'equal';
    select?: 'all' | 'first' | 'last' | 'arbitrary';
    ignoreStrand?: boolean;
}
export interface RangePositionOptions {
    width?: number;
    force?: boolean;
    ignoreStrand?: boolean;
    clip?: boolean;
}
export interface ParseGROptions {
    genome?: string;
    seqinfo?: Seqinfo;
}
export interface ValOptions {
    val?: string | string[];
    by?: string;
    FUN?: string;
    na_rm?: boolean;
    cols?: boolean;
    mean?: boolean;
    weighted?: boolean;
    verbose?: boolean;
    mc_cores?: number;
}
export declare function isGenomicRange(obj: any): obj is GenomicRange;
export declare function isGRangesList(obj: any): obj is GRangesList;
//# sourceMappingURL=genomic.d.ts.map