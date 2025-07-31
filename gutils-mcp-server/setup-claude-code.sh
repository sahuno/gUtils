#!/bin/bash

# Setup script for configuring gUtils MCP server with Claude Code

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GUTILS_DIR="$(dirname "$SCRIPT_DIR")"

echo "gUtils MCP Server - Claude Code Setup"
echo "====================================="
echo ""

# Function to add server using Claude Code CLI
add_mcp_server() {
    local scope=$1
    echo "Adding gUtils MCP server to Claude Code ($scope scope)..."
    
    # Check if claude command exists
    if ! command -v claude &> /dev/null; then
        echo "Error: Claude Code CLI not found. Please make sure Claude Code is installed and in your PATH."
        echo ""
        echo "Alternative: You can manually add the configuration from the .mcp.json file"
        return 1
    fi
    
    # Add the server based on scope
    case $scope in
        "local")
            claude mcp add gutils node "$SCRIPT_DIR/dist/index.js" -s local -e LOG_LEVEL=info
            ;;
        "user")
            claude mcp add gutils node "$SCRIPT_DIR/dist/index.js" -s user -e LOG_LEVEL=info
            ;;
        "project")
            echo "Project scope is configured via .mcp.json file in the project root"
            ;;
    esac
}

# Display instructions
echo "This script will help you configure the gUtils MCP server for Claude Code."
echo ""
echo "Configuration Options:"
echo "1. Project scope - Share with team (via .mcp.json)"
echo "2. Local scope - Private to current project"
echo "3. User scope - Available across all projects"
echo "4. Manual setup instructions"
echo ""

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo ""
        echo "Project configuration has been created at: $GUTILS_DIR/.mcp.json"
        echo "This file will be used automatically when you open the gUtils project in Claude Code."
        echo ""
        echo "Team members will need to approve the server when they first open the project."
        ;;
    2)
        add_mcp_server "local"
        ;;
    3)
        add_mcp_server "user"
        ;;
    4)
        echo ""
        echo "Manual Setup Instructions:"
        echo "=========================="
        echo ""
        echo "1. Using Claude Code CLI:"
        echo "   claude mcp add gutils node \"$SCRIPT_DIR/dist/index.js\" -s user -e LOG_LEVEL=info"
        echo ""
        echo "2. Using configuration file:"
        echo "   - Project scope: Copy .mcp.json to your project root"
        echo "   - The configuration is already at: $GUTILS_DIR/.mcp.json"
        echo ""
        echo "3. Server details:"
        echo "   - Name: gutils"
        echo "   - Command: node"
        echo "   - Args: $SCRIPT_DIR/dist/index.js"
        echo "   - Environment: LOG_LEVEL=info"
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "Testing the server..."
echo ""

# Check if server can start
if [ -f "$SCRIPT_DIR/dist/index.js" ]; then
    echo "✓ Server executable found"
else
    echo "✗ Server not built. Run 'npm run build' in $SCRIPT_DIR"
    exit 1
fi

# Check if R is available
if command -v R &> /dev/null; then
    echo "✓ R is installed"
else
    echo "✗ R not found in PATH"
fi

# Check if gUtils is installed
if R -e "if('gUtils' %in% rownames(installed.packages())) cat('✓ gUtils R package is installed\n') else cat('✗ gUtils R package not installed\n')" --vanilla --quiet 2>/dev/null | grep -q "✓"; then
    echo "✓ gUtils R package is installed"
else
    echo "✗ gUtils R package not installed"
    echo "  Install with: R -e \"devtools::install_github('mskilab/gUtils')\""
fi

echo ""
echo "Setup complete! Next steps:"
echo "1. Restart Claude Code if it's running"
echo "2. The gUtils MCP server will be available in your Claude Code sessions"
echo "3. You can verify by running: claude mcp list"
echo ""
echo "Note: The server will start automatically when Claude Code needs it."