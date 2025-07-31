/**
 * Aggregation and annotation tools for gUtils MCP server
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RBridge } from '../utils/rbridge';
export declare function createAggregationTools(rBridge: RBridge): Tool[];
export declare function handleAggregationTool(toolName: string, args: any, rBridge: RBridge): Promise<any>;
//# sourceMappingURL=aggregation.d.ts.map