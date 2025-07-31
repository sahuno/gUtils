/**
 * GRangesList operation tools for gUtils MCP server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RBridge } from '../utils/rbridge';

export function createGRangesListTools(rBridge: RBridge): Tool[] {
  return [
    {
      name: 'gutils_grl_reduce',
      description: 'Reduce GRanges within each GRangesList element',
      inputSchema: {
        type: 'object',
        properties: {
          grl: {
            type: 'array',
            description: 'GRangesList to reduce',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          },
          pad: {
            type: 'number',
            description: 'Padding to add before reducing',
            default: 0
          },
          clip: {
            type: 'boolean',
            description: 'Clip to sequence bounds',
            default: false
          }
        },
        required: ['grl']
      }
    },

    {
      name: 'gutils_grl_string',
      description: 'Create UCSC-style string representation of GRangesList',
      inputSchema: {
        type: 'object',
        properties: {
          grl: {
            type: 'array',
            description: 'GRangesList to convert',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          },
          sep: {
            type: 'string',
            description: 'Separator between ranges',
            default: ';'
          }
        },
        required: ['grl']
      }
    },

    {
      name: 'gutils_grl_unlist',
      description: 'Unlist GRangesList with tracking of origin',
      inputSchema: {
        type: 'object',
        properties: {
          grl: {
            type: 'array',
            description: 'GRangesList to unlist',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          },
          keep_names: {
            type: 'boolean',
            description: 'Keep list element names',
            default: true
          }
        },
        required: ['grl']
      }
    },

    {
      name: 'gutils_grl_pivot',
      description: 'Invert the structure of nested GRangesList',
      inputSchema: {
        type: 'object',
        properties: {
          grl: {
            type: 'array',
            description: 'GRangesList to pivot',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          }
        },
        required: ['grl']
      }
    },

    {
      name: 'gutils_grl_eval',
      description: 'Evaluate expressions on each GRanges element',
      inputSchema: {
        type: 'object',
        properties: {
          grl: {
            type: 'array',
            description: 'GRangesList to evaluate on',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          },
          expr: {
            type: 'string',
            description: 'R expression to evaluate on each element'
          },
          condition: {
            type: 'string',
            description: 'Optional condition to filter elements'
          }
        },
        required: ['grl', 'expr']
      }
    },

    {
      name: 'gutils_grl_expand',
      description: 'Expand ranges within GRangesList',
      inputSchema: {
        type: 'object',
        properties: {
          grl: {
            type: 'array',
            description: 'GRangesList to expand',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          },
          width: {
            type: 'number',
            description: 'Amount to expand by'
          }
        },
        required: ['grl', 'width']
      }
    },

    {
      name: 'gutils_grl_shrink',
      description: 'Shrink ranges within GRangesList',
      inputSchema: {
        type: 'object',
        properties: {
          grl: {
            type: 'array',
            description: 'GRangesList to shrink',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          },
          width: {
            type: 'number',
            description: 'Amount to shrink by'
          }
        },
        required: ['grl', 'width']
      }
    },

    {
      name: 'gutils_grl_start',
      description: 'Get start positions from GRangesList',
      inputSchema: {
        type: 'object',
        properties: {
          grl: {
            type: 'array',
            description: 'GRangesList',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          },
          width: {
            type: 'number',
            description: 'Width of output ranges',
            default: 1
          },
          ignore_strand: {
            type: 'boolean',
            description: 'Ignore strand',
            default: true
          }
        },
        required: ['grl']
      }
    },

    {
      name: 'gutils_grl_end',
      description: 'Get end positions from GRangesList',
      inputSchema: {
        type: 'object',
        properties: {
          grl: {
            type: 'array',
            description: 'GRangesList',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          },
          width: {
            type: 'number',
            description: 'Width of output ranges',
            default: 1
          },
          ignore_strand: {
            type: 'boolean',
            description: 'Ignore strand',
            default: true
          }
        },
        required: ['grl']
      }
    },

    {
      name: 'gutils_grl_in',
      description: 'Test GRangesList overlap with windows',
      inputSchema: {
        type: 'object',
        properties: {
          grl: {
            type: 'array',
            description: 'GRangesList to test',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          },
          windows: {
            type: 'array',
            description: 'Windows to test against',
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
          ignore_strand: {
            type: 'boolean',
            description: 'Ignore strand when testing',
            default: true
          }
        },
        required: ['grl', 'windows']
      }
    },

    {
      name: 'gutils_grl_bind',
      description: 'Concatenate GRangesList objects',
      inputSchema: {
        type: 'object',
        properties: {
          lists: {
            type: 'array',
            description: 'Array of GRangesList objects to bind',
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  ranges: { type: 'array' }
                }
              }
            }
          }
        },
        required: ['lists']
      }
    }
  ];
}

export async function handleGRangesListTool(
  toolName: string,
  args: any,
  rBridge: RBridge
): Promise<any> {
  await rBridge.initialize();

  switch (toolName) {
    case 'gutils_grl_reduce': {
      const grlObject = rBridge.formatRObject({ type: 'GRangesList', data: args.grl });
      let cmd = `grl.reduce(${grlObject}`;
      
      if (args.pad !== undefined) cmd += `, pad = ${args.pad}`;
      if (args.clip !== undefined) cmd += `, clip = ${args.clip ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_grl_string': {
      const grlObject = rBridge.formatRObject({ type: 'GRangesList', data: args.grl });
      let cmd = `grl.string(${grlObject}`;
      
      if (args.sep) cmd += `, sep = "${args.sep}"`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_grl_unlist': {
      const grlObject = rBridge.formatRObject({ type: 'GRangesList', data: args.grl });
      let cmd = `grl.unlist(${grlObject}`;
      
      if (args.keep_names !== undefined) cmd += `, keep.names = ${args.keep_names ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_grl_pivot': {
      const grlObject = rBridge.formatRObject({ type: 'GRangesList', data: args.grl });
      const result = await rBridge.executeRCommand(`grl.pivot(${grlObject})`);
      return rBridge.parseROutput(result);
    }

    case 'gutils_grl_eval': {
      const grlObject = rBridge.formatRObject({ type: 'GRangesList', data: args.grl });
      let cmd = `grl.eval(${grlObject}, expr = expression(${args.expr})`;
      
      if (args.condition) cmd += `, condition = expression(${args.condition})`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_grl_expand': {
      const grlObject = rBridge.formatRObject({ type: 'GRangesList', data: args.grl });
      const cmd = `grl.expand(${grlObject}, width = ${args.width})`;
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_grl_shrink': {
      const grlObject = rBridge.formatRObject({ type: 'GRangesList', data: args.grl });
      const cmd = `grl.shrink(${grlObject}, width = ${args.width})`;
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_grl_start': {
      const grlObject = rBridge.formatRObject({ type: 'GRangesList', data: args.grl });
      let cmd = `grl.start(${grlObject}`;
      
      if (args.width !== undefined) cmd += `, width = ${args.width}`;
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_grl_end': {
      const grlObject = rBridge.formatRObject({ type: 'GRangesList', data: args.grl });
      let cmd = `grl.end(${grlObject}`;
      
      if (args.width !== undefined) cmd += `, width = ${args.width}`;
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_grl_in': {
      const grlObject = rBridge.formatRObject({ type: 'GRangesList', data: args.grl });
      const windowsGR = rBridge.formatRObject({ type: 'GRanges', data: args.windows });
      
      let cmd = `grl.in(${grlObject}, windows = ${windowsGR}`;
      
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_grl_bind': {
      const grlObjects = args.lists.map((grl: any) => 
        rBridge.formatRObject({ type: 'GRangesList', data: grl })
      ).join(', ');
      
      const cmd = `grl.bind(${grlObjects})`;
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}