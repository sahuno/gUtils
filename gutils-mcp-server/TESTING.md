# Testing gUtils MCP Server in Claude Code

## Quick Start (Without Full gUtils Installation)

Since gUtils requires additional setup, here's how to test the MCP server with basic functionality:

### 1. Configure Claude Desktop

Add this to your Claude configuration file:
- **Linux/Mac**: `~/.config/claude/config.json`
- **Windows**: `%APPDATA%\Claude\config.json`

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

### 2. Restart Claude Desktop

After adding the configuration, completely quit and restart Claude Desktop.

### 3. Test Basic Functionality

Once restarted, you can test the MCP server by asking Claude to:

1. **List available gUtils tools:**
   "What gUtils MCP tools are available?"

2. **Parse coordinates (mock mode):**
   "Use the gutils MCP server to parse the coordinate chr1:1000-2000"

3. **View tool schemas:**
   "Show me the input schema for the gutils_gr_findoverlaps tool"

## Full Installation (For Complete Functionality)

To use all gUtils features, you need to install the R package:

### Prerequisites

1. **Install R packages:**
```bash
R -e "install.packages(c('jsonlite', 'data.table'), repos='https://cran.r-project.org')"
```

2. **Install Bioconductor packages:**
```R
if (!require("BiocManager", quietly = TRUE))
    install.packages("BiocManager")
BiocManager::install(c("GenomicRanges", "IRanges", "BSgenome"))
```

3. **Install gUtils from the parent directory:**
```bash
cd /home/sahuno/apps/gUtils
R CMD INSTALL .
```

## Troubleshooting

### Check MCP Server Status

In Claude, ask: "Is the gutils MCP server connected?"

### View Logs

Check the log files:
```bash
tail -f /home/sahuno/apps/gUtils/gutils-mcp-server/gutils-mcp.log
tail -f /home/sahuno/apps/gUtils/gutils-mcp-server/gutils-mcp-error.log
```

### Test R Bridge Directly

```bash
cd /home/sahuno/apps/gUtils/gutils-mcp-server
node test-rbridge.js
```

### Common Issues

1. **"gUtils package not found"**: The package works in limited mock mode. Install gUtils for full functionality.

2. **"jsonlite package is required"**: Install with:
   ```bash
   R -e "install.packages('jsonlite', repos='https://cran.r-project.org')"
   ```

3. **Server not responding**: Check that the path in config.json is correct and the server is built.

## Example Queries for Testing

Once configured, try these in Claude:

1. "List all available gUtils MCP tools"
2. "Use gutils to parse the coordinate chr1:1000-2000"
3. "What genomic analysis tools does gUtils provide?"
4. "Show me how to find overlapping genomic ranges with gUtils"

The server will provide tool schemas and basic functionality even without the full gUtils package installed.