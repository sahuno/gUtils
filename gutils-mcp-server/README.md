# gUtils MCP Server

An MCP (Model Context Protocol) server that exposes the full functionality of the gUtils R package for genomic analysis to AI agents and LLMs.

## Overview

This MCP server provides a comprehensive interface to all gUtils functions, enabling AI agents to perform sophisticated genomic analyses including:

- Data conversion between genomic formats
- Range manipulation and position operations
- Overlap detection and set operations
- GRangesList operations
- Value aggregation and annotation
- All operator shortcuts as named functions
- Utility functions for genome standardization

## Prerequisites

- Node.js 18+
- R 4.0+ with gUtils package installed
- Required R packages: gUtils, GenomicRanges, IRanges, data.table, jsonlite
- For genome operations: BSgenome packages (e.g., BSgenome.Hsapiens.UCSC.hg19)

## Installation

1. Install dependencies:
```bash
cd gutils-mcp-server
npm install
```

2. Build the server:
```bash
npm run build
```

3. Ensure gUtils is installed in R:
```r
# If not already installed
devtools::install_github("mskilab/gUtils")
```

## Starting and Stopping the Server

### Quick Start

The easiest way to manage the server is using the provided scripts:

```bash
# Start in foreground (see output directly)
./start-server.sh

# Start in background/daemon mode
./start-server.sh -d

# Start with debug logging
./start-server.sh -d -l debug

# Stop the server
./stop-server.sh
```

### Manual Start Methods

1. **Using npm (foreground)**:
```bash
npm start
```

2. **Development mode with auto-reload**:
```bash
npm run dev
```

3. **Background with logging**:
```bash
nohup npm start > logs/server.log 2>&1 &
```

### Server Management

- **Check if running**: `pgrep -f "node dist/index.js"`
- **View logs**: `tail -f logs/gutils-mcp-server-*.log`
- **Stop manually**: `pkill -f "node dist/index.js"`

## Using with Claude

### Important: Server Must Be Running

**The gUtils MCP server must be running BEFORE you can use gUtils functions in Claude.** When you reference gUtils tools in your Claude conversation, Claude communicates with the running server to execute R functions.

### Connecting from Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "gutils": {
      "command": "node",
      "args": ["/absolute/path/to/gutils-mcp-server/dist/index.js"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

**Note**: Replace `/absolute/path/to/` with your actual path.

### Usage in Claude

Once the server is running and configured, you can ask Claude to:

- Parse genomic coordinates: "Parse these coordinates: chr1:1000-2000, chr2:5000-6000"
- Find overlaps between genomic regions
- Convert between different genomic data formats
- Perform set operations on genomic intervals
- And much more using any gUtils function

### Example Claude Prompts

1. **Basic coordinate parsing**:
   ```
   "Use gUtils to parse these UCSC coordinates: chr1:1000-2000, chr2:5000-6000:+"
   ```

2. **Finding overlaps**:
   ```
   "Find overlaps between two sets of genomic regions using gUtils"
   ```

3. **Data conversion**:
   ```
   "Convert this genomic data table to GRanges format"
   ```

## Available Tools

### Data Conversion Tools
- `gutils_gr2dt` - Convert GRanges to data.table
- `gutils_dt2gr` - Convert data.table to GRanges
- `gutils_parse_gr` - Parse UCSC-style coordinates (chr1:1000-2000)
- `gutils_parse_grl` - Parse semicolon-separated coordinates
- `gutils_seg2gr` - Convert segment data to GRanges
- `gutils_si2gr` - Create chromosome-spanning GRanges
- `gutils_gr_string` - Convert GRanges to coordinate strings

### Range Manipulation Tools
- `gutils_gr_start` - Get start positions
- `gutils_gr_end` - Get end positions
- `gutils_gr_mid` - Get midpoints
- `gutils_gr_flipstrand` - Flip strand orientation
- `gutils_gr_stripstrand` - Remove strand information
- `gutils_gr_trim` - Trim ranges
- `gutils_gr_pairflip` - Create strand-flipped pairs
- `gutils_gr_noval` - Remove metadata
- `gutils_gr_tile` - Tile ranges into segments
- `gutils_gr_rand` - Generate random ranges
- `gutils_gr_sample` - Sample from territory

### Overlap Operations
- `gutils_gr_findoverlaps` - Find overlapping ranges
- `gutils_gr_in` - Test overlap membership
- `gutils_gr_match` - Find exact matches
- `gutils_gr_reduce` - Reduce to minimal set
- `gutils_gr_disjoin` - Break at overlap boundaries
- `gutils_gr_setdiff` - Compute set difference
- `gutils_gr_simplify` - Simplify to footprint
- `gutils_gr_collapse` - Merge nearby ranges
- `gutils_gr_overlaps` - Test rearrangement overlaps

### GRangesList Operations
- `gutils_grl_reduce` - Reduce within list elements
- `gutils_grl_string` - Convert to string representation
- `gutils_grl_unlist` - Unlist with tracking
- `gutils_grl_pivot` - Invert structure
- `gutils_grl_eval` - Evaluate expressions
- `gutils_grl_expand` - Expand ranges
- `gutils_grl_shrink` - Shrink ranges
- `gutils_grl_start` - Get start positions
- `gutils_grl_end` - Get end positions
- `gutils_grl_in` - Test overlap with windows
- `gutils_grl_bind` - Concatenate lists

### Aggregation Tools
- `gutils_gr_val` - Annotate with aggregated values
- `gutils_gr_sum` - Sum values across ranges
- `gutils_gr_quantile` - Compute quantiles
- `gutils_gr_breaks` - Create break points

### Operator Shortcuts (as named functions)
- `gutils_op_left_side` - Left/5' side (%(%）
- `gutils_op_right_side` - Right/3' side (%)%)
- `gutils_op_intersect_agnostic` - Strand-agnostic intersection (%&%)
- `gutils_op_intersect_specific` - Strand-specific intersection (%&&%)
- `gutils_op_fraction_overlap` - Fraction overlap (%O%)
- `gutils_op_base_overlap` - Base overlap (%o%)
- `gutils_op_count_overlaps` - Count overlaps (%N%)
- `gutils_op_set_difference` - Set difference (%-%)
- `gutils_op_shift` - Shift ranges (%+%)
- `gutils_op_query_metadata` - Query by metadata (%Q%)
- `gutils_op_aggregate_metadata` - Aggregate metadata (%$%)

### Utility Tools
- `gutils_hg_seqlengths` - Get chromosome lengths
- `gutils_gr_fix` - Standardize to genome
- `gutils_gr_fixseq` - Fix sequence information
- `gutils_gr_chr` - Add chr prefix
- `gutils_gr_nochr` - Remove chr prefix
- `gutils_gr_sub` - Regex substitution on seqlevels
- `gutils_gr_dice` - Split into width-1 pieces
- `gutils_gr_dist` - Calculate distances
- `gutils_gr_duplicated` - Find duplicates
- `gutils_gr_flatten` - Flatten to virtual chromosome
- `gutils_grbind` - Concatenate GRanges
- `gutils_rrbind` - Row bind tables

## Example Usage

### Parse genomic coordinates:
```json
{
  "tool": "gutils_parse_gr",
  "arguments": {
    "coordinates": ["chr1:1000-2000", "chr2:5000-6000:+"],
    "genome": "hg19"
  }
}
```

### Find overlaps:
```json
{
  "tool": "gutils_gr_findoverlaps",
  "arguments": {
    "query": [
      {"seqnames": "chr1", "start": 1000, "end": 2000, "strand": "*"}
    ],
    "subject": [
      {"seqnames": "chr1", "start": 1500, "end": 2500, "strand": "*"}
    ],
    "ignore_strand": true
  }
}
```

## Architecture

The server uses:
- TypeScript for type safety
- R-bridge for executing gUtils functions
- JSON for data exchange between TypeScript and R
- MCP SDK for protocol implementation

## Logging

Logs are written to:
- `gutils-mcp.log` - All logs
- `gutils-mcp-error.log` - Error logs only

Set log level with `LOG_LEVEL` environment variable (debug, info, warn, error).

## Development

Run tests:
```bash
npm test
```

Lint code:
```bash
npm run lint
```

## Troubleshooting

1. **R not found**: Ensure R is in your PATH
2. **gUtils not installed**: Install with `devtools::install_github("mskilab/gUtils")`
3. **Missing R packages**: Install required packages with `install.packages()`
4. **Permission errors**: Check file permissions for temp directory

## License

MIT