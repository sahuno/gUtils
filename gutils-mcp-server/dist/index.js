#!/usr/bin/env node
"use strict";
/**
 * gUtils MCP Server - Main entry point
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const rbridge_1 = require("./utils/rbridge");
const data_conversion_1 = require("./tools/data-conversion");
const range_manipulation_1 = require("./tools/range-manipulation");
const overlap_operations_1 = require("./tools/overlap-operations");
const grangeslist_operations_1 = require("./tools/grangeslist-operations");
const aggregation_1 = require("./tools/aggregation");
const operators_1 = require("./tools/operators");
const utilities_1 = require("./tools/utilities");
const winston_1 = __importDefault(require("winston"));
// Configure logging
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.File({
            filename: 'gutils-mcp-error.log',
            level: 'error'
        }),
        new winston_1.default.transports.File({
            filename: 'gutils-mcp.log'
        })
    ]
});
// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
class GUtilsMCPServer {
    server;
    rBridge;
    tools;
    constructor() {
        this.server = new index_js_1.Server({
            name: 'gutils-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.rBridge = new rbridge_1.RBridge();
        this.tools = new Map();
        this.setupHandlers();
        this.registerTools();
    }
    registerTools() {
        // Register all tool categories
        const allTools = [
            ...(0, data_conversion_1.createDataConversionTools)(this.rBridge),
            ...(0, range_manipulation_1.createRangeManipulationTools)(this.rBridge),
            ...(0, overlap_operations_1.createOverlapOperationTools)(this.rBridge),
            ...(0, grangeslist_operations_1.createGRangesListTools)(this.rBridge),
            ...(0, aggregation_1.createAggregationTools)(this.rBridge),
            ...(0, operators_1.createOperatorTools)(this.rBridge),
            ...(0, utilities_1.createUtilityTools)(this.rBridge)
        ];
        allTools.forEach(tool => {
            this.tools.set(tool.name, tool);
        });
        logger.info(`Registered ${this.tools.size} gUtils tools`);
    }
    setupHandlers() {
        // List available tools
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            return {
                tools: Array.from(this.tools.values())
            };
        });
        // Handle tool calls
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            if (!this.tools.has(name)) {
                throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Tool ${name} not found`);
            }
            try {
                logger.info(`Executing tool: ${name}`, { args });
                let result;
                const category = name.split('_')[1]; // Extract category from tool name
                switch (category) {
                    case 'gr2dt':
                    case 'dt2gr':
                    case 'parse':
                    case 'seg2gr':
                    case 'si2gr':
                        result = await (0, data_conversion_1.handleDataConversionTool)(name, args, this.rBridge);
                        break;
                    case 'gr':
                        // Check the specific operation
                        const operation = name.split('_')[2];
                        if (['start', 'end', 'mid', 'flipstrand', 'stripstrand', 'trim',
                            'pairflip', 'noval', 'tile', 'rand', 'sample'].includes(operation)) {
                            result = await (0, range_manipulation_1.handleRangeManipulationTool)(name, args, this.rBridge);
                        }
                        else if (['findoverlaps', 'in', 'match', 'reduce', 'disjoin',
                            'setdiff', 'simplify', 'collapse', 'overlaps'].includes(operation)) {
                            result = await (0, overlap_operations_1.handleOverlapOperationTool)(name, args, this.rBridge);
                        }
                        else if (['val', 'sum', 'quantile', 'breaks'].includes(operation)) {
                            result = await (0, aggregation_1.handleAggregationTool)(name, args, this.rBridge);
                        }
                        else if (['dist', 'duplicated', 'flatten', 'dice', 'fix',
                            'fixseq', 'chr', 'nochr', 'sub'].includes(operation)) {
                            result = await (0, utilities_1.handleUtilityTool)(name, args, this.rBridge);
                        }
                        break;
                    case 'grl':
                        result = await (0, grangeslist_operations_1.handleGRangesListTool)(name, args, this.rBridge);
                        break;
                    case 'op':
                        result = await (0, operators_1.handleOperatorTool)(name, args, this.rBridge);
                        break;
                    case 'grbind':
                    case 'rrbind':
                    case 'hg':
                        result = await (0, utilities_1.handleUtilityTool)(name, args, this.rBridge);
                        break;
                    default:
                        throw new Error(`Unknown tool category: ${category}`);
                }
                logger.info(`Tool ${name} completed successfully`);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            }
            catch (error) {
                logger.error(`Error executing tool ${name}:`, error);
                throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, `Failed to execute ${name}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    async start() {
        try {
            logger.info('Starting gUtils MCP server...');
            // Initialize R bridge
            await this.rBridge.initialize();
            logger.info('R bridge initialized successfully');
            // Start server transport
            const transport = new stdio_js_1.StdioServerTransport();
            await this.server.connect(transport);
            logger.info('gUtils MCP server started successfully');
            // Handle shutdown gracefully
            process.on('SIGINT', async () => {
                logger.info('Shutting down gUtils MCP server...');
                await this.rBridge.close();
                process.exit(0);
            });
        }
        catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}
// Start the server
const server = new GUtilsMCPServer();
server.start().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map