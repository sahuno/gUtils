/**
 * Aggregation and annotation tools for gUtils MCP server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RBridge } from '../utils/rbridge';

export function createAggregationTools(rBridge: RBridge): Tool[] {
  return [
    {
      name: 'gutils_gr_val',
      description: 'Annotate ranges with aggregated values from overlapping target ranges',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'array',
            description: 'Query ranges to annotate',
            items: {
              type: 'object',
              properties: {
                seqnames: { type: 'string' },
                start: { type: 'number' },
                end: { type: 'number' },
                strand: { type: 'string' }
              },
              required: ['seqnames', 'start', 'end']
            }
          },
          target: {
            type: 'array',
            description: 'Target ranges with values',
            items: {
              type: 'object',
              properties: {
                seqnames: { type: 'string' },
                start: { type: 'number' },
                end: { type: 'number' },
                strand: { type: 'string' },
                metadata: { type: 'object' }
              },
              required: ['seqnames', 'start', 'end']
            }
          },
          val: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ],
            description: 'Column(s) to aggregate from target'
          },
          by: {
            type: 'string',
            description: 'Grouping column'
          },
          FUN: {
            type: 'string',
            description: 'Aggregation function (sum, mean, median, min, max)',
            default: 'sum'
          },
          na_rm: {
            type: 'boolean',
            description: 'Remove NA values',
            default: true
          },
          weighted: {
            type: 'boolean',
            description: 'Use weighted aggregation by overlap width',
            default: false
          },
          mean: {
            type: 'boolean',
            description: 'Return mean instead of sum for numeric values',
            default: false
          },
          ignore_strand: {
            type: 'boolean',
            description: 'Ignore strand when finding overlaps',
            default: true
          }
        },
        required: ['query', 'target']
      }
    },

    {
      name: 'gutils_gr_sum',
      description: 'Aggregate values across GRanges',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Ranges with values to aggregate',
            items: {
              type: 'object',
              properties: {
                seqnames: { type: 'string' },
                start: { type: 'number' },
                end: { type: 'number' },
                strand: { type: 'string' },
                metadata: { type: 'object' }
              },
              required: ['seqnames', 'start', 'end']
            }
          },
          val: {
            type: 'string',
            description: 'Column to sum'
          },
          by: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ],
            description: 'Grouping columns'
          },
          na_rm: {
            type: 'boolean',
            description: 'Remove NA values',
            default: true
          }
        },
        required: ['ranges', 'val']
      }
    },

    {
      name: 'gutils_gr_quantile',
      description: 'Compute quantiles of values in GRanges',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Ranges with values',
            items: {
              type: 'object',
              properties: {
                seqnames: { type: 'string' },
                start: { type: 'number' },
                end: { type: 'number' },
                strand: { type: 'string' },
                metadata: { type: 'object' }
              },
              required: ['seqnames', 'start', 'end']
            }
          },
          val: {
            type: 'string',
            description: 'Column to compute quantiles for'
          },
          probs: {
            type: 'array',
            description: 'Quantile probabilities',
            items: { type: 'number' },
            default: [0, 0.25, 0.5, 0.75, 1]
          },
          na_rm: {
            type: 'boolean',
            description: 'Remove NA values',
            default: true
          }
        },
        required: ['ranges', 'val']
      }
    },

    {
      name: 'gutils_gr_breaks',
      description: 'Create break points from GRanges for histogram-like operations',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Input ranges',
            items: {
              type: 'object',
              properties: {
                seqnames: { type: 'string' },
                start: { type: 'number' },
                end: { type: 'number' },
                strand: { type: 'string' }
              },
              required: ['seqnames', 'start', 'end']
            }
          },
          n: {
            type: 'number',
            description: 'Number of breaks'
          },
          by: {
            type: 'string',
            description: 'Column to compute breaks for'
          }
        },
        required: ['ranges']
      }
    }
  ];
}

export async function handleAggregationTool(
  toolName: string,
  args: any,
  rBridge: RBridge
): Promise<any> {
  await rBridge.initialize();

  switch (toolName) {
    case 'gutils_gr_val': {
      const queryGR = rBridge.formatRObject({ type: 'GRanges', data: args.query });
      const targetGR = rBridge.formatRObject({ type: 'GRanges', data: args.target });
      
      let cmd = `gr.val(query = ${queryGR}, target = ${targetGR}`;
      
      if (args.val) {
        if (Array.isArray(args.val)) {
          const valStr = args.val.map((v: string) => `"${v}"`).join(', ');
          cmd += `, val = c(${valStr})`;
        } else {
          cmd += `, val = "${args.val}"`;
        }
      }
      
      if (args.by) cmd += `, by = "${args.by}"`;
      if (args.FUN) cmd += `, FUN = ${args.FUN}`;
      if (args.na_rm !== undefined) cmd += `, na.rm = ${args.na_rm ? 'TRUE' : 'FALSE'}`;
      if (args.weighted !== undefined) cmd += `, weighted = ${args.weighted ? 'TRUE' : 'FALSE'}`;
      if (args.mean !== undefined) cmd += `, mean = ${args.mean ? 'TRUE' : 'FALSE'}`;
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_sum': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      let cmd = `gr.sum(${grObject}, val = "${args.val}"`;
      
      if (args.by) {
        if (Array.isArray(args.by)) {
          const byStr = args.by.map((b: string) => `"${b}"`).join(', ');
          cmd += `, by = c(${byStr})`;
        } else {
          cmd += `, by = "${args.by}"`;
        }
      }
      
      if (args.na_rm !== undefined) cmd += `, na.rm = ${args.na_rm ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_quantile': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      let cmd = `gr.quantile(${grObject}, val = "${args.val}"`;
      
      if (args.probs) {
        const probsStr = args.probs.join(', ');
        cmd += `, probs = c(${probsStr})`;
      }
      
      if (args.na_rm !== undefined) cmd += `, na.rm = ${args.na_rm ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_breaks': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      let cmd = `gr.breaks(${grObject}`;
      
      if (args.n !== undefined) cmd += `, n = ${args.n}`;
      if (args.by) cmd += `, by = "${args.by}"`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}