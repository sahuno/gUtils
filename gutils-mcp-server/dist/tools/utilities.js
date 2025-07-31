"use strict";
/**
 * Utility tools for gUtils MCP server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUtilityTools = createUtilityTools;
exports.handleUtilityTool = handleUtilityTool;
function createUtilityTools(rBridge) {
    return [
        {
            name: 'gutils_hg_seqlengths',
            description: 'Get standard human genome chromosome lengths',
            inputSchema: {
                type: 'object',
                properties: {
                    genome: {
                        type: 'string',
                        description: 'Genome version',
                        enum: ['hg19', 'hg38'],
                        default: 'hg19'
                    },
                    chr: {
                        type: 'boolean',
                        description: 'Include chr prefix',
                        default: true
                    },
                    include_junk: {
                        type: 'boolean',
                        description: 'Include non-standard chromosomes',
                        default: false
                    }
                }
            }
        },
        {
            name: 'gutils_gr_fix',
            description: 'Standardize seqlevels and seqlengths to genome',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Ranges to fix',
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
                    genome: {
                        type: 'string',
                        description: 'Genome to standardize to',
                        enum: ['hg19', 'hg38', 'mm10', 'mm39']
                    }
                },
                required: ['ranges']
            }
        },
        {
            name: 'gutils_gr_fixseq',
            description: 'Fix sequence information for GRanges',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Ranges to fix',
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
                    genome: {
                        type: 'string',
                        description: 'Genome version',
                        enum: ['hg19', 'hg38', 'mm10', 'mm39']
                    }
                },
                required: ['ranges']
            }
        },
        {
            name: 'gutils_gr_chr',
            description: 'Add chr prefix to seqlevels',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Ranges to modify',
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
            name: 'gutils_gr_nochr',
            description: 'Remove chr prefix from seqlevels',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Ranges to modify',
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
            name: 'gutils_gr_sub',
            description: 'Apply regex substitution to seqlevels',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Ranges to modify',
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
                    pattern: {
                        type: 'string',
                        description: 'Regex pattern to match'
                    },
                    replacement: {
                        type: 'string',
                        description: 'Replacement string'
                    }
                },
                required: ['ranges', 'pattern', 'replacement']
            }
        },
        {
            name: 'gutils_gr_dice',
            description: 'Split ranges into width-1 pieces (WARNING: can create very large objects)',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Ranges to dice',
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
            name: 'gutils_gr_dist',
            description: 'Calculate pairwise distances between ranges',
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
                    y: {
                        type: 'array',
                        description: 'Second set of ranges',
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
                        description: 'Ignore strand when calculating distance',
                        default: true
                    }
                },
                required: ['x', 'y']
            }
        },
        {
            name: 'gutils_gr_duplicated',
            description: 'Find duplicate ranges with flexible matching',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Ranges to check for duplicates',
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
                        description: 'Metadata columns to include in duplicate check',
                        items: { type: 'string' }
                    },
                    ignore_strand: {
                        type: 'boolean',
                        description: 'Ignore strand when checking duplicates',
                        default: false
                    }
                },
                required: ['ranges']
            }
        },
        {
            name: 'gutils_gr_flatten',
            description: 'Lay ranges end-to-end on virtual chromosome',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Ranges to flatten',
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
            name: 'gutils_grbind',
            description: 'Concatenate GRanges objects robustly',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges_list: {
                        type: 'array',
                        description: 'List of GRanges to concatenate',
                        items: {
                            type: 'array',
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
                    }
                },
                required: ['ranges_list']
            }
        },
        {
            name: 'gutils_rrbind',
            description: 'Improved row binding for data.frames/data.tables',
            inputSchema: {
                type: 'object',
                properties: {
                    tables: {
                        type: 'array',
                        description: 'List of tables to bind',
                        items: {
                            type: 'object',
                            additionalProperties: { type: 'array' }
                        }
                    },
                    fill: {
                        type: 'boolean',
                        description: 'Fill missing columns with NA',
                        default: true
                    }
                },
                required: ['tables']
            }
        }
    ];
}
async function handleUtilityTool(toolName, args, rBridge) {
    await rBridge.initialize();
    switch (toolName) {
        case 'gutils_hg_seqlengths': {
            let cmd = 'hg_seqlengths(';
            if (args.genome)
                cmd += `genome = "${args.genome}"`;
            if (args.chr !== undefined)
                cmd += `, chr = ${args.chr ? 'TRUE' : 'FALSE'}`;
            if (args.include_junk !== undefined)
                cmd += `, include.junk = ${args.include_junk ? 'TRUE' : 'FALSE'}`;
            cmd += ')';
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_gr_fix': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            let cmd = `gr.fix(${grObject}`;
            if (args.genome)
                cmd += `, genome = "${args.genome}"`;
            cmd += ')';
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_gr_fixseq': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            let cmd = `gr.fixseq(${grObject}`;
            if (args.genome)
                cmd += `, genome = "${args.genome}"`;
            cmd += ')';
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_gr_chr': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            const result = await rBridge.executeRCommand(`gr.chr(${grObject})`);
            return rBridge.parseROutput(result);
        }
        case 'gutils_gr_nochr': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            const result = await rBridge.executeRCommand(`gr.nochr(${grObject})`);
            return rBridge.parseROutput(result);
        }
        case 'gutils_gr_sub': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            const cmd = `gr.sub(${grObject}, pattern = "${args.pattern}", replacement = "${args.replacement}")`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_gr_dice': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            const result = await rBridge.executeRCommand(`gr.dice(${grObject})`);
            return rBridge.parseROutput(result);
        }
        case 'gutils_gr_dist': {
            const xGR = rBridge.formatRObject({ type: 'GRanges', data: args.x });
            const yGR = rBridge.formatRObject({ type: 'GRanges', data: args.y });
            let cmd = `gr.dist(x = ${xGR}, y = ${yGR}`;
            if (args.ignore_strand !== undefined)
                cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
            cmd += ')';
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_gr_duplicated': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            let cmd = `gr.duplicated(${grObject}`;
            if (args.by && args.by.length > 0) {
                const byStr = args.by.map((col) => `"${col}"`).join(', ');
                cmd += `, by = c(${byStr})`;
            }
            if (args.ignore_strand !== undefined)
                cmd += `, ignore.strand = ${args.ignore_strand ? 'TRUE' : 'FALSE'}`;
            cmd += ')';
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_gr_flatten': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            const result = await rBridge.executeRCommand(`gr.flatten(${grObject})`);
            return rBridge.parseROutput(result);
        }
        case 'gutils_grbind': {
            const grObjects = args.ranges_list.map((gr) => rBridge.formatRObject({ type: 'GRanges', data: gr })).join(', ');
            const cmd = `grbind(${grObjects})`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_rrbind': {
            const tableObjects = args.tables.map((table) => rBridge.formatRObject(table)).join(', ');
            let cmd = `rrbind(list(${tableObjects})`;
            if (args.fill !== undefined)
                cmd += `, fill = ${args.fill ? 'TRUE' : 'FALSE'}`;
            cmd += ')';
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        default:
            throw new Error(`Unknown tool: ${toolName}`);
    }
}
//# sourceMappingURL=utilities.js.map