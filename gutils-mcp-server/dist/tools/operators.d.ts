/**
 * Operator shortcut tools for gUtils MCP server
 * These are named function versions of the gUtils operator shortcuts
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RBridge } from '../utils/rbridge';
export declare function createOperatorTools(rBridge: RBridge): Tool[];
export declare function handleOperatorTool(toolName: string, args: any, rBridge: RBridge): Promise<any>;
//# sourceMappingURL=operators.d.ts.map