/**
 * Range position and manipulation tools for gUtils MCP server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RBridge } from '../utils/rbridge';

export function createRangeManipulationTools(rBridge: RBridge): Tool[] {
  return [
    {
      name: 'gutils_gr_start',
      description: 'Extract start positions as width-n GRanges',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Input genomic ranges',
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
          width: {
            type: 'number',
            description: 'Width of output ranges',
            default: 1
          },
          force: {
            type: 'boolean',
            description: 'Force operation even if it extends beyond seqlengths',
            default: false
          },
          ignore_strand: {
            type: 'boolean',
            description: 'Ignore strand when determining start',
            default: true
          },
          clip: {
            type: 'boolean',
            description: 'Clip to sequence bounds',
            default: true
          }
        },
        required: ['ranges']
      }
    },

    {
      name: 'gutils_gr_end',
      description: 'Extract end positions as width-n GRanges',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Input genomic ranges',
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
          width: {
            type: 'number',
            description: 'Width of output ranges',
            default: 1
          },
          force: {
            type: 'boolean',
            description: 'Force operation even if it extends beyond seqlengths',
            default: false
          },
          ignore_strand: {
            type: 'boolean',
            description: 'Ignore strand when determining end',
            default: true
          },
          clip: {
            type: 'boolean',
            description: 'Clip to sequence bounds',
            default: true
          }
        },
        required: ['ranges']
      }
    },

    {
      name: 'gutils_gr_mid',
      description: 'Get midpoints of ranges as width-1 GRanges',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Input genomic ranges',
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
      name: 'gutils_gr_flipstrand',
      description: 'Flip strand orientation (+ to -, - to +)',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Input genomic ranges',
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
      name: 'gutils_gr_stripstrand',
      description: 'Remove strand information (set to *)',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Input genomic ranges',
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
      name: 'gutils_gr_trim',
      description: 'Trim GRanges relative to local coordinates',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Input genomic ranges',
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
          start: {
            type: 'number',
            description: 'Local start position for trimming'
          },
          end: {
            type: 'number',
            description: 'Local end position for trimming'
          }
        },
        required: ['ranges']
      }
    },

    {
      name: 'gutils_gr_pairflip',
      description: 'Create pairs of ranges with original and flipped strands',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Input genomic ranges',
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
      name: 'gutils_gr_noval',
      description: 'Remove all metadata columns from GRanges',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Input genomic ranges',
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
          }
        },
        required: ['ranges']
      }
    },

    {
      name: 'gutils_gr_tile',
      description: 'Tile intervals into segments of specified width',
      inputSchema: {
        type: 'object',
        properties: {
          ranges: {
            type: 'array',
            description: 'Input genomic ranges to tile',
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
          width: {
            type: 'number',
            description: 'Maximum width of each tile',
            default: 1000
          },
          stranded: {
            type: 'boolean',
            description: 'Preserve strand information in tiles',
            default: false
          }
        },
        required: ['ranges']
      }
    },

    {
      name: 'gutils_gr_rand',
      description: 'Generate random non-overlapping GRanges',
      inputSchema: {
        type: 'object',
        properties: {
          n: {
            type: 'number',
            description: 'Number of random ranges to generate'
          },
          width: {
            oneOf: [
              { type: 'number' },
              { type: 'array', items: { type: 'number' } }
            ],
            description: 'Width(s) of ranges'
          },
          genome: {
            type: 'string',
            description: 'Genome version (e.g., hg19, hg38)',
            enum: ['hg19', 'hg38', 'mm10', 'mm39']
          }
        },
        required: ['n', 'width', 'genome']
      }
    },

    {
      name: 'gutils_gr_sample',
      description: 'Randomly sample intervals within a territory',
      inputSchema: {
        type: 'object',
        properties: {
          territory: {
            type: 'array',
            description: 'Territory to sample from',
            items: {
              type: 'object',
              properties: {
                seqnames: { type: 'string' },
                start: { type: 'number' },
                end: { type: 'number' }
              },
              required: ['seqnames', 'start', 'end']
            }
          },
          n: {
            type: 'number',
            description: 'Number of samples to take'
          },
          replace: {
            type: 'boolean',
            description: 'Sample with replacement',
            default: false
          }
        },
        required: ['territory', 'n']
      }
    }
  ];
}

export async function handleRangeManipulationTool(
  toolName: string,
  args: any,
  rBridge: RBridge
): Promise<any> {
  await rBridge.initialize();

  switch (toolName) {
    case 'gutils_gr_start': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      let cmd = `gr.start(${grObject}`;
      
      if (args.width !== undefined) cmd += `, width = ${args.width}`;
      if (args.force !== undefined) cmd += `, force = ${args.force ? 'TRUE' : 'FALSE'}`;
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      if (args.clip !== undefined) cmd += `, clip = ${args.clip ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_end': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      let cmd = `gr.end(${grObject}`;
      
      if (args.width !== undefined) cmd += `, width = ${args.width}`;
      if (args.force !== undefined) cmd += `, force = ${args.force ? 'TRUE' : 'FALSE'}`;
      if (args.ignore_strand !== undefined) cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
      if (args.clip !== undefined) cmd += `, clip = ${args.clip ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_mid': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      const result = await rBridge.executeRCommand(`gr.mid(${grObject})`);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_flipstrand': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      const result = await rBridge.executeRCommand(`gr.flipstrand(${grObject})`);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_stripstrand': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      const result = await rBridge.executeRCommand(`gr.stripstrand(${grObject})`);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_trim': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      let cmd = `gr.trim(${grObject}`;
      
      if (args.start !== undefined) cmd += `, start = ${args.start}`;
      if (args.end !== undefined) cmd += `, end = ${args.end}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_pairflip': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      const result = await rBridge.executeRCommand(`gr.pairflip(${grObject})`);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_noval': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      const result = await rBridge.executeRCommand(`gr.noval(${grObject})`);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_tile': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
      let cmd = `gr.tile(${grObject}`;
      
      if (args.width !== undefined) cmd += `, width = ${args.width}`;
      if (args.stranded !== undefined) cmd += `, stranded = ${args.stranded ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_rand': {
      const widthStr = Array.isArray(args.width) 
        ? `c(${args.width.join(', ')})`
        : args.width;
      
      const cmd = `gr.rand(N = ${args.n}, width = ${widthStr}, genome = BSgenome.Hsapiens.UCSC.${args.genome}::BSgenome.Hsapiens.UCSC.${args.genome})`;
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    case 'gutils_gr_sample': {
      const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.territory });
      let cmd = `gr.sample(${grObject}, N = ${args.n}`;
      
      if (args.replace !== undefined) cmd += `, replace = ${args.replace ? 'TRUE' : 'FALSE'}`;
      
      cmd += ')';
      const result = await rBridge.executeRCommand(cmd);
      return rBridge.parseROutput(result);
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}