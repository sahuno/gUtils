/**
 * Data conversion tools for gUtils MCP server
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RBridge } from '../utils/rbridge';
export declare function createDataConversionTools(rBridge: RBridge): Tool[];
export declare function handleDataConversionTool(toolName: string, args: any, rBridge: RBridge): Promise<any>;
//# sourceMappingURL=data-conversion.d.ts.map