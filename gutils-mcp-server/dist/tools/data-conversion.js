"use strict";
/**
 * Data conversion tools for gUtils MCP server
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataConversionTools = createDataConversionTools;
exports.handleDataConversionTool = handleDataConversionTool;
function createDataConversionTools(rBridge) {
    return [
        {
            name: 'gutils_gr2dt',
            description: 'Convert GRanges to data.table with genomic columns and metadata',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Array of genomic ranges',
                        items: {
                            type: 'object',
                            properties: {
                                seqnames: { type: 'string' },
                                start: { type: 'number' },
                                end: { type: 'number' },
                                strand: { type: 'string', enum: ['+', '-', '*'] },
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
            name: 'gutils_dt2gr',
            description: 'Convert data.table/data.frame to GRanges object',
            inputSchema: {
                type: 'object',
                properties: {
                    data: {
                        type: 'object',
                        description: 'Data table with genomic columns',
                        properties: {
                            seqnames: { type: 'array', items: { type: 'string' } },
                            start: { type: 'array', items: { type: 'number' } },
                            end: { type: 'array', items: { type: 'number' } },
                            strand: { type: 'array', items: { type: 'string' } }
                        },
                        required: ['seqnames', 'start', 'end']
                    },
                    seqlengths: {
                        type: 'object',
                        description: 'Optional chromosome lengths',
                        additionalProperties: { type: 'number' }
                    },
                    genome: {
                        type: 'string',
                        description: 'Optional genome version (e.g., hg19, hg38)'
                    }
                },
                required: ['data']
            }
        },
        {
            name: 'gutils_parse_gr',
            description: 'Parse UCSC/IGV-style genomic coordinates (chr:start-end) into GRanges',
            inputSchema: {
                type: 'object',
                properties: {
                    coordinates: {
                        type: 'array',
                        description: 'Array of coordinate strings (e.g., ["chr1:1000-2000", "chr2:5000-6000:+"])',
                        items: { type: 'string' }
                    },
                    genome: {
                        type: 'string',
                        description: 'Optional genome version for validation'
                    }
                },
                required: ['coordinates']
            }
        },
        {
            name: 'gutils_parse_grl',
            description: 'Parse semicolon-separated coordinate strings into GRangesList',
            inputSchema: {
                type: 'object',
                properties: {
                    coordinates: {
                        type: 'array',
                        description: 'Array of semicolon-separated coordinate strings',
                        items: { type: 'string' }
                    },
                    genome: {
                        type: 'string',
                        description: 'Optional genome version'
                    }
                },
                required: ['coordinates']
            }
        },
        {
            name: 'gutils_seg2gr',
            description: 'Convert segment-style data.frame to GRanges',
            inputSchema: {
                type: 'object',
                properties: {
                    segments: {
                        type: 'object',
                        description: 'Segment data with flexible column naming',
                        additionalProperties: { type: 'array' }
                    }
                },
                required: ['segments']
            }
        },
        {
            name: 'gutils_si2gr',
            description: 'Create GRanges covering entire chromosomes from Seqinfo',
            inputSchema: {
                type: 'object',
                properties: {
                    genome: {
                        type: 'string',
                        description: 'Genome version (e.g., hg19, hg38)',
                        enum: ['hg19', 'hg38', 'mm10', 'mm39']
                    },
                    chromosomes: {
                        type: 'array',
                        description: 'Optional subset of chromosomes',
                        items: { type: 'string' }
                    }
                },
                required: ['genome']
            }
        },
        {
            name: 'gutils_gr_string',
            description: 'Convert GRanges to UCSC coordinate strings',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Array of genomic ranges',
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
                    add_strand: {
                        type: 'boolean',
                        description: 'Include strand in output string',
                        default: false
                    }
                },
                required: ['ranges']
            }
        }
    ];
}
async function handleDataConversionTool(toolName, args, rBridge) {
    await rBridge.initialize();
    switch (toolName) {
        case 'gutils_gr2dt': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            const result = await rBridge.executeRCommand(`gr2dt(${grObject})`);
            return rBridge.parseROutput(result);
        }
        case 'gutils_dt2gr': {
            const dtCmd = rBridge.formatRObject(args.data);
            let cmd = `dt2gr(${dtCmd}`;
            if (args.seqlengths) {
                const seqlengthsCmd = Object.entries(args.seqlengths)
                    .map(([chr, len]) => `"${chr}" = ${len}`)
                    .join(', ');
                cmd += `, seqlengths = c(${seqlengthsCmd})`;
            }
            if (args.genome) {
                cmd += `, genome = "${args.genome}"`;
            }
            cmd += ')';
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_parse_gr': {
            const coordsStr = args.coordinates.map((c) => `"${c}"`).join(', ');
            let cmd = `parse.gr(c(${coordsStr})`;
            if (args.genome) {
                cmd += `, genome = "${args.genome}"`;
            }
            cmd += ')';
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_parse_grl': {
            const coordsStr = args.coordinates.map((c) => `"${c}"`).join(', ');
            let cmd = `parse.grl(c(${coordsStr})`;
            if (args.genome) {
                cmd += `, genome = "${args.genome}"`;
            }
            cmd += ')';
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_seg2gr': {
            const segCmd = rBridge.formatRObject(args.segments);
            const result = await rBridge.executeRCommand(`seg2gr(${segCmd})`);
            return rBridge.parseROutput(result);
        }
        case 'gutils_si2gr': {
            let cmd = `si2gr(BSgenome.Hsapiens.UCSC.${args.genome}::BSgenome.Hsapiens.UCSC.${args.genome}`;
            if (args.chromosomes) {
                const chrStr = args.chromosomes.map((c) => `"${c}"`).join(', ');
                cmd = `
          genome_obj <- BSgenome.Hsapiens.UCSC.${args.genome}::BSgenome.Hsapiens.UCSC.${args.genome}
          seqinfo_subset <- seqinfo(genome_obj)[c(${chrStr})]
          si2gr(seqinfo_subset)
        `;
            }
            else {
                cmd += ')';
            }
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_gr_string': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            let cmd = `gr.string(${grObject}`;
            if (args.add_strand) {
                cmd += ', add.strand = TRUE';
            }
            cmd += ')';
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        default:
            throw new Error(`Unknown tool: ${toolName}`);
    }
}
//# sourceMappingURL=data-conversion.js.map