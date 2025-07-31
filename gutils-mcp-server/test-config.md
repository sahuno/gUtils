# Testing gUtils MCP Server in Claude Code

## Setup Instructions

1. **Add to your Claude Desktop configuration** (`~/.config/claude/config.json` on Linux/Mac or `%APPDATA%\Claude\config.json` on Windows):

```json
{
  "mcpServers": {
    "gutils": {
      "command": "node",
      "args": ["/home/sahuno/apps/gUtils/gutils-mcp-server/dist/index.js"],
      "env": {
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

2. **Restart Claude Desktop** to load the new configuration.

3. **Test the server** by asking Claude to use gUtils tools. Here are some example queries:

## Example Test Queries

### 1. Parse Genomic Coordinates
"Use the gutils MCP server to parse these genomic coordinates: chr1:1000-2000, chr2:5000-6000:+"

### 2. Find Overlaps
"Use gutils to find overlaps between these ranges:
- Query: chr1:1000-2000, chr1:3000-4000
- Subject: chr1:1500-2500, chr1:3500-4500"

### 3. Reduce Overlapping Ranges
"Use gutils to reduce these overlapping ranges to a minimal set: chr1:1000-2000, chr1:1500-2500, chr1:3000-4000"

### 4. Tile a Large Range
"Use gutils to tile the range chr1:1000-10000 into 1000bp segments"

### 5. Convert to Data Table
"Use gutils to convert these genomic ranges to a data table format:
- chr1:1000-2000 strand:+ gene:GENE1 score:100
- chr2:5000-6000 strand:- gene:GENE2 score:200"

## Debugging

Check the logs at:
- `/home/sahuno/apps/gUtils/gutils-mcp-server/gutils-mcp.log`
- `/home/sahuno/apps/gUtils/gutils-mcp-server/gutils-mcp-error.log`

## Direct Testing (without Claude)

You can also test the server directly:

```bash
cd /home/sahuno/apps/gUtils/gutils-mcp-server
node dist/index.js
```

Then send JSON-RPC requests to test individual tools.