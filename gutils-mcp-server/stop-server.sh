#!/bin/bash

# gUtils MCP Server Stop Script
# This script stops the running gUtils MCP server

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if PID file exists
if [ -f "gutils-mcp-server.pid" ]; then
    PID=$(cat gutils-mcp-server.pid)
    
    # Check if process is running
    if ps -p $PID > /dev/null 2>&1; then
        echo "Stopping gUtils MCP server (PID: $PID)..."
        kill $PID
        
        # Wait for process to stop
        sleep 2
        
        # Check if it's still running
        if ps -p $PID > /dev/null 2>&1; then
            echo "Server didn't stop gracefully. Forcing termination..."
            kill -9 $PID
        fi
        
        echo "Server stopped successfully"
        rm -f gutils-mcp-server.pid
    else
        echo "Server process (PID: $PID) is not running"
        rm -f gutils-mcp-server.pid
    fi
else
    # Try to find the process without PID file
    PIDS=$(pgrep -f "node dist/index.js")
    
    if [ -n "$PIDS" ]; then
        echo "Found gUtils MCP server process(es): $PIDS"
        echo "Stopping..."
        pkill -f "node dist/index.js"
        sleep 2
        
        # Check if any are still running
        if pgrep -f "node dist/index.js" > /dev/null; then
            echo "Some processes didn't stop gracefully. Forcing termination..."
            pkill -9 -f "node dist/index.js"
        fi
        
        echo "Server stopped successfully"
    else
        echo "No gUtils MCP server process found"
    fi
fi