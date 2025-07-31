# gUtils Functions Reference

A comprehensive guide to all user-exposed functions in the gUtils R package, grouped by common operations.

## Table of Contents
- [Data Conversion](#data-conversion)
- [Range Position Operations](#range-position-operations)
- [Range Generation](#range-generation)
- [Range Manipulation](#range-manipulation)
- [Overlap and Intersection](#overlap-and-intersection)
- [Set Operations](#set-operations)
- [Aggregation and Annotation](#aggregation-and-annotation)
- [Data Combination](#data-combination)
- [GRangesList Operations](#grangeslist-operations)
- [Utility Functions](#utility-functions)
- [Advanced Analysis](#advanced-analysis)
- [Operator Shortcuts](#operator-shortcuts)

## Data Conversion

### `gr2dt(x)`
Converts GRanges to data.table with genomic columns (seqnames, start, end, strand) and metadata.
- **Input**: GRanges object
- **Similar to**: `as.data.table()` but preserves genomic structure

### `dt2gr(dt, seqlengths, seqinfo)`
Converts data.table/data.frame to GRanges object.
- **Input**: data.table with seqnames, start, end, strand columns
- **Similar to**: `makeGRangesFromDataFrame()` but faster

### `seg2gr(x)`
Converts segment-style data.frame to GRanges.
- **Input**: data.frame with chromosome and position columns
- **Similar to**: `dt2gr()` but more flexible with column names

### `si2gr(si)`
Creates GRanges covering entire chromosomes from Seqinfo or BSgenome.
- **Input**: Seqinfo or BSgenome object
- **Output**: GRanges with one range per chromosome

### `parse.gr(x)`
Parses UCSC/IGV-style strings (chr:start-end) into GRanges.
- **Input**: Character vector like "chr1:1000-2000"
- **Similar to**: Manual string parsing but handles strand notation

### `parse.grl(x)`
Parses semicolon-separated strings into GRangesList.
- **Input**: Character vector with ";" separating multiple ranges
- **Similar to**: `parse.gr()` but returns GRangesList

## Range Position Operations

### `gr.start(x, width=1, force=FALSE, ignore.strand=TRUE, clip=TRUE)`
Extracts start positions as width-1 GRanges.
- **Input**: GRanges object
- **Similar to**: `resize(x, width=1, fix="start")` but more flexible

### `gr.end(x, width=1, force=FALSE, ignore.strand=TRUE, clip=TRUE)`
Extracts end positions as width-1 GRanges.
- **Input**: GRanges object
- **Similar to**: `resize(x, width=1, fix="end")` but more flexible

### `gr.mid(x)`
Returns midpoints of ranges as width-1 GRanges.
- **Input**: GRanges object
- **Output**: GRanges at center positions

## Range Generation

### `gr.rand(N, width, genome)`
Generates N random non-overlapping GRanges with specified widths.
- **Input**: N (count), width (numeric/vector), genome (Seqinfo/BSgenome)
- **Output**: Random GRanges scattered across genome

### `gr.sample(x, N, replace=FALSE)`
Randomly samples intervals within a territory.
- **Input**: GRanges territory, N samples to take
- **Similar to**: `sample()` but for genomic intervals

### `gr.tile(gr, width=1000, stranded=FALSE)`
Tiles intervals into segments of specified width or less.
- **Input**: GRanges to tile, maximum segment width
- **Similar to**: `tile()` but handles remainders better

## Range Manipulation

### `gr.trim(x, ...)`
Trims GRanges relative to local coordinates within each range.
- **Input**: GRanges object
- **Similar to**: `narrow()` but with different coordinate system

### `gr.flipstrand(gr)`
Flips strand orientation (+ to -, - to +).
- **Input**: GRanges or GRangesList
- **Output**: Same object with flipped strands

### `gr.stripstrand(gr)`
Removes strand information (sets to *).
- **Input**: GRanges object
- **Similar to**: `unstrand()` in GenomicRanges

### `gr.pairflip(gr)`
Creates pairs of ranges with original and flipped strands.
- **Input**: GRanges object
- **Output**: GRangesList with paired ranges

### `gr.noval(gr)`
Removes all metadata columns from GRanges.
- **Input**: GRanges or GRangesList
- **Output**: Same object without mcols

## Overlap and Intersection

### `gr.findoverlaps(query, subject, ...)`
Enhanced overlap detection with additional options.
- **Input**: query and subject GRanges
- **Similar to**: `findOverlaps()` but with more features

### `gr.in(query, subject, ...)`
Tests which query ranges overlap any subject ranges.
- **Input**: query and subject GRanges
- **Similar to**: `overlapsAny()` with extra options

### `gr.match(x, table, ...)`
Finds matching ranges between two GRanges.
- **Input**: x and table GRanges
- **Similar to**: `match()` but for genomic ranges

### `gr.overlaps(ra1, ra2, ...)`
Tests overlap between rearrangement junctions.
- **Input**: Two GRangesList objects
- **Use case**: Structural variant analysis

## Set Operations

### `gr.reduce(..., by=NULL, ignore.strand=TRUE)`
Reduces overlapping ranges to minimal set.
- **Input**: GRanges/GRangesList
- **Similar to**: `reduce()` but can group by metadata columns

### `gr.disjoin(x, ...)`
Breaks ranges at all overlap boundaries.
- **Input**: GRanges object
- **Similar to**: `disjoin()` with extra functionality

### `gr.setdiff(x, y, ...)`
Removes portions of x that overlap y.
- **Input**: Two GRanges objects
- **Similar to**: `setdiff()` for genomic coordinates

### `gr.simplify(gr)`
Reduces to minimal non-redundant footprint.
- **Input**: GRanges/GRangesList
- **Similar to**: `gr.reduce()` but more aggressive

## Aggregation and Annotation

### `gr.val(query, target, val=NULL, ...)`
Annotates ranges with aggregated values from overlapping target ranges.
- **Input**: query GRanges, target GRanges with values
- **Use case**: Weighted means, sums across overlaps

### `gr.sum(x, ...)`
Aggregates values across GRanges.
- **Input**: GRanges with numeric metadata
- **Similar to**: `aggregate()` for genomic data

### `gr.quantile(x, ...)`
Computes quantiles of values in GRanges.
- **Input**: GRanges with numeric metadata
- **Output**: Quantile statistics

### `gr.breaks(x, ...)`
Creates break points from GRanges.
- **Input**: GRanges object
- **Use case**: Histogram-like operations

## Data Combination

### `grbind(x, ...)`
Concatenates GRanges objects robustly.
- **Input**: Multiple GRanges objects
- **Similar to**: `c()` but handles different mcols gracefully

### `grl.bind(...)`
Concatenates GRangesList objects.
- **Input**: Multiple GRangesList objects
- **Similar to**: `grbind()` but for GRangesList

### `rrbind(x, ...)`
Improved row binding for data.frames/data.tables.
- **Input**: List of data.frames/data.tables
- **Similar to**: `rbind()` but handles mismatched columns

## GRangesList Operations

### `grl.reduce(grl, pad=0, clip=FALSE)`
Reduces GRanges within each GRangesList element.
- **Input**: GRangesList object
- **Similar to**: `reduce()` applied per list element

### `grl.string(grl, ...)`
Creates UCSC-style string representation.
- **Input**: GRangesList object
- **Output**: Character vector of range strings

### `grl.unlist(grl, ...)`
Unlists with tracking of origin.
- **Input**: GRangesList object
- **Output**: GRanges with grl.ix and grl.iix fields

### `grl.pivot(x)`
Inverts the structure of nested GRangesList.
- **Input**: GRangesList object
- **Use case**: Reorganizing grouped ranges

### `grl.eval(grl, expr, condition=NULL)`
Evaluates expressions on each GRanges element.
- **Input**: GRangesList and expression to evaluate
- **Similar to**: `lapply()` with expression evaluation

### `grl.expand(grl, width)` / `grl.shrink(grl, width)`
Expands or shrinks ranges within GRangesList.
- **Input**: GRangesList and width adjustment
- **Similar to**: `resize()` but preserves list structure

### `grl.start(grl, ...)` / `grl.end(grl, ...)`
Gets start or end positions from GRangesList.
- **Input**: GRangesList object
- **Similar to**: `gr.start()`/`gr.end()` for lists

### `grl.in(grl, windows, ...)`
Tests GRangesList overlap with windows.
- **Input**: GRangesList and GRanges windows
- **Similar to**: `gr.in()` for GRangesList

## Utility Functions

### `hg_seqlengths(genome=NULL, chr=TRUE, include.junk=FALSE)`
Returns standard human genome chromosome lengths.
- **Input**: Genome version (e.g., "hg19", "hg38")
- **Output**: Named numeric vector of lengths

### `gr.fix(gr, genome=NULL)` / `gr.fixseq(x, genome=NULL)`
Standardizes seqlevels and seqlengths to genome.
- **Input**: GRanges and genome specification
- **Use case**: Ensuring compatibility between objects

### `gr.chr(x)` / `gr.nochr(x)`
Adds or removes "chr" prefix from seqlevels.
- **Input**: GRanges object
- **Use case**: Converting between UCSC/Ensembl styles

### `gr.string(gr, ...)`
Converts GRanges to UCSC coordinate strings.
- **Input**: GRanges object
- **Output**: Character vector like "chr1:1000-2000"

### `gr.sub(gr, pattern, replacement)`
Applies regex substitution to seqlevels.
- **Input**: GRanges, pattern, and replacement
- **Similar to**: `gsub()` for chromosome names

## Advanced Analysis

### `gr.dice(x)`
Splits ranges into width-1 pieces.
- **Input**: GRanges object
- **Warning**: Can create very large objects

### `gr.dist(x, y, ...)`
Calculates pairwise distances between ranges.
- **Input**: Two GRanges objects
- **Output**: Distance matrix or vector

### `gr.duplicated(x, ...)`
Finds duplicate ranges with flexible matching.
- **Input**: GRanges object
- **Similar to**: `duplicated()` with genomic awareness

### `gr.flatten(x)`
Lays ranges end-to-end on virtual chromosome.
- **Input**: GRanges object
- **Use case**: Linearizing genomic coordinates

### `gr.collapse(x, ...)`
Merges adjacent/nearby ranges.
- **Input**: GRanges object
- **Similar to**: `reduce()` with distance threshold

## Operator Shortcuts

### Position Operators
- `%(% ` - Left/5' side of intervals (strand-aware)
- `%)%` - Right/3' side of intervals (strand-aware)

### Overlap Operators
- `%&%` - Strand-agnostic intersection check
- `%&&%` - Strand-specific intersection check
- `%^%` - Boolean overlap test
- `%^^%` - Strand-specific boolean overlap

### Value Aggregation Operators
- `%O%` - Fraction of query width overlapping
- `%OO%` - Strand-specific fraction overlap
- `%o%` - Number of bases overlapping
- `%oo%` - Strand-specific base overlap
- `%N%` - Count of overlapping ranges
- `%NN%` - Strand-specific overlap count

### Set Operations
- `%-%` - Set difference (shortcut for gr.setdiff)
- `%+%` - Shift ranges by specified amount
- `%*%` - Natural join on metadata
- `%**%` - Strand-specific natural join

### Query Operators
- `%Q%` - Query by metadata expression
- `%QQ%` - Query GRangesList by metadata
- `%$%` - Aggregate metadata across territories
- `%$$%` - Strand-specific aggregation

## Common Input Patterns

1. **Most functions accept**:
   - GRanges objects as primary input
   - Optional strand awareness via `ignore.strand` parameter
   - Metadata column specifications via `by` parameter

2. **GRangesList functions** (grl.*):
   - Parallel operations on list elements
   - Often return modified GRangesList

3. **Conversion functions**:
   - Flexible column name recognition
   - Preserve metadata during conversion

4. **Operator shortcuts**:
   - Left-hand side is query/subject
   - Right-hand side is reference/database
   - Double operators (%%%) are strand-specific