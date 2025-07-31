"use strict";
/**
 * Operator shortcut tools for gUtils MCP server
 * These are named function versions of the gUtils operator shortcuts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOperatorTools = createOperatorTools;
exports.handleOperatorTool = handleOperatorTool;
function createOperatorTools(rBridge) {
    return [
        // Position operators
        {
            name: 'gutils_op_left_side',
            description: 'Get left/5\' side of intervals (strand-aware) - equivalent to %(%',
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
                    width: {
                        type: 'number',
                        description: 'Width of output',
                        default: 1
                    }
                },
                required: ['ranges']
            }
        },
        {
            name: 'gutils_op_right_side',
            description: 'Get right/3\' side of intervals (strand-aware) - equivalent to %)%',
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
                    width: {
                        type: 'number',
                        description: 'Width of output',
                        default: 1
                    }
                },
                required: ['ranges']
            }
        },
        // Overlap test operators
        {
            name: 'gutils_op_intersect_agnostic',
            description: 'Strand-agnostic intersection check - equivalent to %&%',
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
                    }
                },
                required: ['query', 'subject']
            }
        },
        {
            name: 'gutils_op_intersect_specific',
            description: 'Strand-specific intersection check - equivalent to %&&%',
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
                    }
                },
                required: ['query', 'subject']
            }
        },
        // Value aggregation operators
        {
            name: 'gutils_op_fraction_overlap',
            description: 'Fraction of query width overlapping - equivalent to %O%',
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
                    }
                },
                required: ['query', 'subject']
            }
        },
        {
            name: 'gutils_op_base_overlap',
            description: 'Number of bases overlapping - equivalent to %o%',
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
                    }
                },
                required: ['query', 'subject']
            }
        },
        {
            name: 'gutils_op_count_overlaps',
            description: 'Count of overlapping ranges - equivalent to %N%',
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
                    }
                },
                required: ['query', 'subject']
            }
        },
        // Set operations
        {
            name: 'gutils_op_set_difference',
            description: 'Set difference - equivalent to %-%',
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
                    }
                },
                required: ['x', 'y']
            }
        },
        {
            name: 'gutils_op_shift',
            description: 'Shift ranges by amount - equivalent to %+%',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Ranges to shift',
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
                    shift: {
                        type: 'number',
                        description: 'Amount to shift (positive or negative)'
                    }
                },
                required: ['ranges', 'shift']
            }
        },
        // Query operators
        {
            name: 'gutils_op_query_metadata',
            description: 'Query by metadata expression - equivalent to %Q%',
            inputSchema: {
                type: 'object',
                properties: {
                    ranges: {
                        type: 'array',
                        description: 'Ranges to query',
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
                    expression: {
                        type: 'string',
                        description: 'R expression to evaluate on metadata'
                    }
                },
                required: ['ranges', 'expression']
            }
        },
        {
            name: 'gutils_op_aggregate_metadata',
            description: 'Aggregate metadata across territories - equivalent to %$%',
            inputSchema: {
                type: 'object',
                properties: {
                    territories: {
                        type: 'array',
                        description: 'Territory ranges',
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
                    data: {
                        type: 'array',
                        description: 'Data ranges with metadata',
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
                    column: {
                        type: 'string',
                        description: 'Metadata column to aggregate'
                    },
                    fun: {
                        type: 'string',
                        description: 'Aggregation function',
                        default: 'sum'
                    }
                },
                required: ['territories', 'data', 'column']
            }
        }
    ];
}
async function handleOperatorTool(toolName, args, rBridge) {
    await rBridge.initialize();
    switch (toolName) {
        case 'gutils_op_left_side': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            const cmd = `${grObject} %(% ${args.width || 1}`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_op_right_side': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            const cmd = `${grObject} %)% ${args.width || 1}`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_op_intersect_agnostic': {
            const queryGR = rBridge.formatRObject({ type: 'GRanges', data: args.query });
            const subjectGR = rBridge.formatRObject({ type: 'GRanges', data: args.subject });
            const cmd = `${queryGR} %&% ${subjectGR}`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_op_intersect_specific': {
            const queryGR = rBridge.formatRObject({ type: 'GRanges', data: args.query });
            const subjectGR = rBridge.formatRObject({ type: 'GRanges', data: args.subject });
            const cmd = `${queryGR} %&&% ${subjectGR}`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_op_fraction_overlap': {
            const queryGR = rBridge.formatRObject({ type: 'GRanges', data: args.query });
            const subjectGR = rBridge.formatRObject({ type: 'GRanges', data: args.subject });
            const cmd = `${queryGR} %O% ${subjectGR}`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_op_base_overlap': {
            const queryGR = rBridge.formatRObject({ type: 'GRanges', data: args.query });
            const subjectGR = rBridge.formatRObject({ type: 'GRanges', data: args.subject });
            const cmd = `${queryGR} %o% ${subjectGR}`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_op_count_overlaps': {
            const queryGR = rBridge.formatRObject({ type: 'GRanges', data: args.query });
            const subjectGR = rBridge.formatRObject({ type: 'GRanges', data: args.subject });
            const cmd = `${queryGR} %N% ${subjectGR}`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_op_set_difference': {
            const xGR = rBridge.formatRObject({ type: 'GRanges', data: args.x });
            const yGR = rBridge.formatRObject({ type: 'GRanges', data: args.y });
            const cmd = `${xGR} %-% ${yGR}`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_op_shift': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            const cmd = `${grObject} %+% ${args.shift}`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_op_query_metadata': {
            const grObject = rBridge.formatRObject({ type: 'GRanges', data: args.ranges });
            const cmd = `${grObject} %Q% (${args.expression})`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        case 'gutils_op_aggregate_metadata': {
            const territoriesGR = rBridge.formatRObject({ type: 'GRanges', data: args.territories });
            const dataGR = rBridge.formatRObject({ type: 'GRanges', data: args.data });
            const cmd = `${territoriesGR} %$% list(data = ${dataGR}, column = "${args.column}", fun = ${args.fun || 'sum'})`;
            const result = await rBridge.executeRCommand(cmd);
            return rBridge.parseROutput(result);
        }
        default:
            throw new Error(`Unknown tool: ${toolName}`);
    }
}
//# sourceMappingURL=operators.js.map