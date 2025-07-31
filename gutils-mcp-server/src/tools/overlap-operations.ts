/**
 * Overlap and set operation tools for gUtils MCP server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RBridge } from '../utils/rbridge';

export function createOverlapOperationTools(rBridge: RBridge): Tool[] {
  return [
    {
      name: 'gutils_gr_findoverlaps',
      description: 'Find overlapping ranges between query and subject with advanced options',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'array',
            description: 'Query ranges',
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
          subject: {
            type: 'array',
            description: 'Subject ranges',
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
          maxgap: {
            type: 'number',
            description: 'Maximum gap between ranges to consider overlapping',
            default: -1
          },
          minoverlap: {
            type: 'number',
            description: 'Minimum overlap required',
            default: 1
          },
          type: {
            type: 'string',
            enum: ['any', 'start', 'end', 'within', 'equal'],
            description: 'Type of overlap to detect',
            default: 'any'
          },
          select: {
            type: 'string',
            enum: ['all', 'first', 'last', 'arbitrary'],
            description: 'Which overlaps to return',
            default: 'all'
          },
          ignore_strand: {
            type: 'boolean',
            description: 'Ignore strand when finding overlaps',
            default: false
          }
        },
        required: ['query', 'subject']
      }
    },

    {
      name: 'gutils_gr_in',
      description: 'Test which query ranges overlap any subject ranges',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'array',
            description: 'Query ranges',
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
          subject: {
            type: 'array',
            description: 'Subject ranges',
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
            description: 'Ignore strand when testing overlap',
            default: true
          }
        },
        required: ['query', 'subject']
      }
    },

    {
      name: 'gutils_gr_match',
      description: 'Find exact matching ranges between two GRanges',
      inputSchema: {
        type: 'object',
        properties: {
          x: {
            type: 'array',
            description: 'First set of ranges',
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
          table: {
            type: 'array',
            description: 'Second set of ranges to match against',
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
            description: 'Ignore strand when matching',
            default: false
          }
        },
        required: ['x', 'table']
      }
    },

    {
      name: 'gutils_gr_reduce',
      description: 'Reduce overlapping ranges to minimal non-overlapping set',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Ranges to reduce',
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
          by: {
            type: 'array',
            description: 'Metadata columns to group by before reducing',
            items: { type: 'string' }
          },
          ignore_strand: {
            type: 'boolean',
            description: 'Ignore strand when reducing',
            default: true
          },
          pad: {
            type: 'number',
            description: 'Padding to add before reducing',
            default: 0
          }
        },
        required: ['ranges']
      }
    },

    {
      name: 'gutils_gr_disjoin',
      description: 'Break ranges at all overlap boundaries',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Ranges to disjoin',
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
            description: 'Ignore strand when disjoining',
            default: true
          }
        },
        required: ['ranges']
      }
    },

    {
      name: 'gutils_gr_setdiff',
      description: 'Remove portions of x that overlap y',
      inputSchema: {
        type: 'object',
        properties: {
          x: {
            type: 'array',
            description: 'Ranges to subtract from',
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
          y: {
            type: 'array',
            description: 'Ranges to subtract',
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
            description: 'Ignore strand when computing difference',
            default: true
          }
        },
        required: ['x', 'y']
      }
    },

    {
      name: 'gutils_gr_simplify',
      description: 'Reduce to minimal non-redundant footprint',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Ranges to simplify',
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
          }
        },
        required: ['ranges']
      }
    },

    {
      name: 'gutils_gr_collapse',
      description: 'Merge adjacent or nearby ranges',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Ranges to collapse',
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
          maxgap: {
            type: 'number',
            description: 'Maximum gap to merge across',
            default: 0
          },
          ignore_strand: {
            type: 'boolean',
            description: 'Ignore strand when collapsing',
            default: true
          }
        },
        required: ['ranges']
      }
    },

    {
      name: 'gutils_gr_overlaps',
      description: 'Test overlap between rearrangement junctions (GRangesList)',
      inputSchema: {
        type: 'object',
        properties: {
          ra1: {
            type: 'array',
            description: 'First set of rearrangements (GRangesList)',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          },
          ra2: {
            type: 'array',
            description: 'Second set of rearrangements (GRangesList)',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                ranges: { type: 'array' }
              }
            }
          },
          thresh: {
            type: 'number',
            description: 'Overlap threshold',
            default: 1
          }
        },
        required: ['ra1', 'ra2']
      }
    }
  ];
}

export async function handleOverlapOperationTool(
  toolName: string,
  args: any,
  rBridge: RBridge
): Promise<any> {
  await rBridge.initialize();

  switch (toolName) {
    case 'gutils_gr_findoverlaps': {
      const queryGR = rBridge.formatRObject({ type: 'GRanges', data: args.query });
      const subjectGR = rBridge.formatRObject({ type: 'GRanges', data: args.subject });
      
      let cmd = `gr.findoverlaps(query = ${queryGR}, subject = ${subjectGR}`;
      
      if (args.maxgap !== undefined) cmd += `, maxgap = ${args.maxgap}`;
      if (args.minoverlap !== undefined) cmd += `, minoverlap = ${args.minoverlap}`;
      if (args.type) cmd += `, type = "${args.type}"`;
      if (args.select) cmd += `, select = "${args.select}"`;
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_in': {
      const queryGR = rBridge.formatRObject({ type: 'GRanges', data: args.query });
      const subjectGR = rBridge.formatRObject({ type: 'GRanges', data: args.subject });
      
      let cmd = `gr.in(query = ${queryGR}, subject = ${subjectGR}`;
      
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_match': {
      const xGR = rBridge.formatRObject({ type: 'GRanges', data: args.x });
      const tableGR = rBridge.formatRObject({ type: 'GRanges', data: args.table });
      
      let cmd = `gr.match(x = ${xGR}, table = ${tableGR}`;
      
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_reduce': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      let cmd = `gr.reduce(${grObject}`;
      
      if (args.by && args.by.length > 0) {
        const byStr = args.by.map((col: string) => `"${col}"`).join(', ');
        cmd += `, by = c(${byStr})`;
      }
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      if (args.pad !== undefined) cmd += `, pad = ${args.pad}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_disjoin': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      let cmd = `gr.disjoin(${grObject}`;
      
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_setdiff': {
      const xGR = rBridge.formatRObject({ type: 'GRanges', data: args.x });
      const yGR = rBridge.formatRObject({ type: 'GRanges', data: args.y });
      
      let cmd = `gr.setdiff(x = ${xGR}, y = ${yGR}`;
      
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_simplify': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      const result = await rBridge.executeRCommand(`gr.simplify(${grObject})`);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_collapse': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      let cmd = `gr.collapse(${grObject}`;
      
      if (args.maxgap !== undefined) cmd += `, maxgap = ${args.maxgap}`;
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_overlaps': {
      const ra1GRL = rBridge.formatRObject({ type: 'GRangesList', data: args.ra1 });
      const ra2GRL = rBridge.formatRObject({ type: 'GRangesList', data: args.ra2 });
      
      let cmd = `gr.overlaps(ra1 = ${ra1GRL}, ra2 = ${ra2GRL}`;
      
      if (args.thresh !== undefined) cmd += `, thresh = ${args.thresh}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}