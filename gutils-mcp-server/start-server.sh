#!/bin/bash

# gUtils MCP Server Startup Script
# This script starts the gUtils MCP server with proper error handling and logging

# Set the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Create logs directory if it doesn't exist
mkdir -p logs

# Set log file with timestamp
LOG_FILE="logs/gutils-mcp-server-$(date +%Y%m%d-%H%M%S).log"

# Function to display usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -d, --daemon     Run server in background (daemon mode)"
    echo "  -l, --log-level  Set log level (debug, info, warn, error) [default: info]"
    echo "  -h, --help       Display this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run in foreground"
    echo "  $0 -d                 # Run in background"
    echo "  $0 -d -l debug        # Run in background with debug logging"
}

# Parse command line arguments
DAEMON_MODE=false
LOG_LEVEL="info"

while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--daemon)
            DAEMON_MODE=true
            shift
            ;;
        -l|--log-level)
            LOG_LEVEL="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    exit 1
fi

# Check if R is installed
if ! command -v R &> /dev/null; then
    echo "Error: R is not installed or not in PATH"
    exit 1
fi

# Check if the server is already running
if pgrep -f "node dist/index.js" > /dev/null; then
    echo "Warning: gUtils MCP server appears to be already running"
    echo "To stop it, run: pkill -f 'node dist/index.js'"
    exit 1
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "Error: dist directory not found. Please run 'npm run build' first"
    exit 1
fi

# Export environment variables
export LOG_LEVEL=$LOG_LEVEL
export NODE_ENV=${NODE_ENV:-production}

# Start the server
if [ "$DAEMON_MODE" = true ]; then
    echo "Starting gUtils MCP server in daemon mode..."
    echo "Log file: $LOG_FILE"
    echo "PID will be saved to: gutils-mcp-server.pid"
    
    # Start in background and save PID
    nohup node dist/index.js > "$LOG_FILE" 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > gutils-mcp-server.pid
    
    # Wait a moment and check if the process is still running
    sleep 2
    if ps -p $SERVER_PID > /dev/null; then
        echo "gUtils MCP server started successfully (PID: $SERVER_PID)"
        echo "To stop the server, run: kill $SERVER_PID"
        echo "To view logs, run: tail -f $LOG_FILE"
    else
        echo "Error: Server failed to start. Check the log file: $LOG_FILE"
        exit 1
    fi
else
    echo "Starting gUtils MCP server in foreground mode..."
    echo "Press Ctrl+C to stop the server"
    echo "Log level: $LOG_LEVEL"
    node dist/index.js
fi