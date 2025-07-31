#!/usr/bin/env node

/**
 * gUtils MCP Server - Main entry point
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { RBridge } from './utils/rbridge';
import { createDataConversionTools, handleDataConversionTool } from './tools/data-conversion';
import { createRangeManipulationTools, handleRangeManipulationTool } from './tools/range-manipulation';
import { createOverlapOperationTools, handleOverlapOperationTool } from './tools/overlap-operations';
import { createGRangesListTools, handleGRangesListTool } from './tools/grangeslist-operations';
import { createAggregationTools, handleAggregationTool } from './tools/aggregation';
import { createOperatorTools, handleOperatorTool } from './tools/operators';
import { createUtilityTools, handleUtilityTool } from './tools/utilities';
import winston from 'winston';

// Configure logging
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'gutils-mcp-error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'gutils-mcp.log' 
    })
  ]
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

class GUtilsMCPServer {
  private server: Server;
  private rBridge: RBridge;
  private tools: Map<string, Tool>;

  constructor() {
    this.server = new Server(
      {
        name: 'gutils-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.rBridge = new RBridge();
    this.tools = new Map();
    
    this.setupHandlers();
    this.registerTools();
  }

  private registerTools() {
    // Register all tool categories
    const allTools = [
      ...createDataConversionTools(this.rBridge),
      ...createRangeManipulationTools(this.rBridge),
      ...createOverlapOperationTools(this.rBridge),
      ...createGRangesListTools(this.rBridge),
      ...createAggregationTools(this.rBridge),
      ...createOperatorTools(this.rBridge),
      ...createUtilityTools(this.rBridge)
    ];

    allTools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    logger.info(`Registered ${this.tools.size} gUtils tools`);
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: Array.from(this.tools.values())
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      if (!this.tools.has(name)) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Tool ${name} not found`
        );
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
            result = await handleDataConversionTool(name, args, this.rBridge);
            break;
            
          case 'gr':
            // Check the specific operation
            const operation = name.split('_')[2];
            if (['start', 'end', 'mid', 'flipstrand', 'stripstrand', 'trim', 
                 'pairflip', 'noval', 'tile', 'rand', 'sample'].includes(operation)) {
              result = await handleRangeManipulationTool(name, args, this.rBridge);
            } else if (['findoverlaps', 'in', 'match', 'reduce', 'disjoin', 
                        'setdiff', 'simplify', 'collapse', 'overlaps'].includes(operation)) {
              result = await handleOverlapOperationTool(name, args, this.rBridge);
            } else if (['val', 'sum', 'quantile', 'breaks'].includes(operation)) {
              result = await handleAggregationTool(name, args, this.rBridge);
            } else if (['dist', 'duplicated', 'flatten', 'dice', 'fix', 
                        'fixseq', 'chr', 'nochr', 'sub'].includes(operation)) {
              result = await handleUtilityTool(name, args, this.rBridge);
            }
            break;
            
          case 'grl':
            result = await handleGRangesListTool(name, args, this.rBridge);
            break;
            
          case 'op':
            result = await handleOperatorTool(name, args, this.rBridge);
            break;
            
          case 'grbind':
          case 'rrbind':
          case 'hg':
            result = await handleUtilityTool(name, args, this.rBridge);
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
      } catch (error) {
        logger.error(`Error executing tool ${name}:`, error);
        
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to execute ${name}: ${error instanceof Error ? error.message : String(error)}`
        );
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
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      logger.info('gUtils MCP server started successfully');
      
      // Handle shutdown gracefully
      process.on('SIGINT', async () => {
        logger.info('Shutting down gUtils MCP server...');
        await this.rBridge.close();
        process.exit(0);
      });
      
    } catch (error) {
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