/**
 * Demo script showing how to use gUtils MCP server
 * This demonstrates various genomic operations
 */

// Example 1: Parse genomic coordinates
const parseCoordinatesExample = {
  tool: "gutils_parse_gr",
  arguments: {
    coordinates: [
      "chr1:1000-2000",
      "chr2:5000-6000:+",
      "chrX:100000-200000:-"
    ],
    genome: "hg19"
  }
};

// Example 2: Find overlaps between two sets of ranges
const findOverlapsExample = {
  tool: "gutils_gr_findoverlaps",
  arguments: {
    query: [
      { seqnames: "chr1", start: 1000, end: 2000, strand: "*" },
      { seqnames: "chr1", start: 3000, end: 4000, strand: "*" },
      { seqnames: "chr2", start: 5000, end: 6000, strand: "*" }
    ],
    subject: [
      { seqnames: "chr1", start: 1500, end: 2500, strand: "*" },
      { seqnames: "chr1", start: 3500, end: 4500, strand: "*" },
      { seqnames: "chr3", start: 1000, end: 2000, strand: "*" }
    ],
    ignore_strand: true,
    type: "any",
    select: "all"
  }
};

// Example 3: Reduce overlapping ranges
const reduceRangesExample = {
  tool: "gutils_gr_reduce",
  arguments: {
    ranges: [
      { seqnames: "chr1", start: 1000, end: 2000, strand: "+", metadata: { score: 10 } },
      { seqnames: "chr1", start: 1500, end: 2500, strand: "+", metadata: { score: 20 } },
      { seqnames: "chr1", start: 3000, end: 4000, strand: "+", metadata: { score: 15 } },
      { seqnames: "chr2", start: 1000, end: 2000, strand: "-", metadata: { score: 5 } }
    ],
    ignore_strand: true
  }
};

// Example 4: Tile ranges into smaller segments
const tileRangesExample = {
  tool: "gutils_gr_tile",
  arguments: {
    ranges: [
      { seqnames: "chr1", start: 1000, end: 5000, strand: "*" },
      { seqnames: "chr2", start: 10000, end: 15000, strand: "*" }
    ],
    width: 1000
  }
};

// Example 5: Annotate ranges with values from overlapping features
const annotateRangesExample = {
  tool: "gutils_gr_val",
  arguments: {
    query: [
      { seqnames: "chr1", start: 1000, end: 2000, strand: "*" },
      { seqnames: "chr1", start: 3000, end: 4000, strand: "*" }
    ],
    target: [
      { seqnames: "chr1", start: 500, end: 1500, strand: "*", metadata: { score: 10, type: "promoter" } },
      { seqnames: "chr1", start: 1800, end: 2200, strand: "*", metadata: { score: 20, type: "enhancer" } },
      { seqnames: "chr1", start: 3500, end: 4500, strand: "*", metadata: { score: 15, type: "promoter" } }
    ],
    val: ["score", "type"],
    FUN: "sum",
    weighted: true,
    ignore_strand: true
  }
};

// Example 6: Convert GRanges to data table format
const toDataTableExample = {
  tool: "gutils_gr2dt",
  arguments: {
    ranges: [
      { seqnames: "chr1", start: 1000, end: 2000, strand: "+", metadata: { gene: "GENE1", score: 100 } },
      { seqnames: "chr2", start: 5000, end: 6000, strand: "-", metadata: { gene: "GENE2", score: 200 } }
    ]
  }
};

// Example 7: Using operator shortcuts
const fractionOverlapExample = {
  tool: "gutils_op_fraction_overlap",
  arguments: {
    query: [
      { seqnames: "chr1", start: 1000, end: 2000, strand: "*" },
      { seqnames: "chr1", start: 3000, end: 5000, strand: "*" }
    ],
    subject: [
      { seqnames: "chr1", start: 1500, end: 2500, strand: "*" },
      { seqnames: "chr1", start: 4000, end: 6000, strand: "*" }
    ]
  }
};

// Example 8: Working with GRangesList
const grangesListExample = {
  tool: "gutils_grl_reduce",
  arguments: {
    grl: [
      {
        id: "gene1",
        ranges: [
          { seqnames: "chr1", start: 1000, end: 2000, strand: "+" },
          { seqnames: "chr1", start: 1500, end: 2500, strand: "+" }
        ]
      },
      {
        id: "gene2",
        ranges: [
          { seqnames: "chr2", start: 5000, end: 6000, strand: "-" },
          { seqnames: "chr2", start: 5500, end: 7000, strand: "-" }
        ]
      }
    ],
    pad: 0
  }
};

// Export examples for use in other scripts
module.exports = {
  parseCoordinatesExample,
  findOverlapsExample,
  reduceRangesExample,
  tileRangesExample,
  annotateRangesExample,
  toDataTableExample,
  fractionOverlapExample,
  grangesListExample
};

// If running directly, print examples
if (require.main === module) {
  console.log("gUtils MCP Server Examples\n");
  
  Object.entries(module.exports).forEach(([name, example]) => {
    console.log(`\n${name}:`);
    console.log(JSON.stringify(example, null, 2));
  });
}