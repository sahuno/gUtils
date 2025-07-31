"use strict";
/**
 * R Bridge for executing gUtils functions
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RBridge = void 0;
const child_process_1 = require("child_process");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class RBridge {
    rProcess = null;
    initialized = false;
    tempDir;
    constructor() {
        this.tempDir = path.join(process.cwd(), '.rbridge-temp');
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }
    async initialize() {
        if (this.initialized)
            return;
        try {
            // Test R availability
            await this.executeRCommand('R.version.string');
            // Load gUtils or use mock mode
            const loadResult = await this.executeRCommand(`
        if (!require("gUtils", quietly = TRUE)) {
          # Try to load mock functions for testing
          if (file.exists("mock_gutils.RData")) {
            load("mock_gutils.RData")
            warning("Running in mock mode - limited functionality")
          } else {
            stop("gUtils package not found. Please install it first or run setup-r-env.R")
          }
        }
        "gUtils environment ready"
      `);
            if (loadResult.success) {
                this.initialized = true;
            }
            else {
                throw new Error(loadResult.error || 'Failed to load gUtils');
            }
        }
        catch (error) {
            throw new Error(`Failed to initialize R bridge: ${error}`);
        }
    }
    async executeRCommand(command) {
        return new Promise((resolve) => {
            const tempFile = path.join(this.tempDir, `${(0, uuid_1.v4)()}.R`);
            const outputFile = path.join(this.tempDir, `${(0, uuid_1.v4)()}.json`);
            // Wrap command to capture output as JSON
            const wrappedCommand = `
        if (!require("jsonlite", quietly = TRUE)) {
          stop("jsonlite package is required. Please install it with: install.packages('jsonlite')")
        }
        
        tryCatch({
          result <- ${command}
          
          # Convert result to JSON-friendly format
          if (inherits(result, "GRanges")) {
            output <- list(
              type = "GRanges",
              data = list(
                seqnames = as.character(seqnames(result)),
                start = start(result),
                end = end(result),
                strand = as.character(strand(result)),
                metadata = if (ncol(mcols(result)) > 0) as.list(mcols(result)) else list()
              )
            )
          } else if (inherits(result, "GRangesList")) {
            output <- list(
              type = "GRangesList",
              data = lapply(names(result), function(name) {
                gr <- result[[name]]
                list(
                  id = name,
                  ranges = list(
                    seqnames = as.character(seqnames(gr)),
                    start = start(gr),
                    end = end(gr),
                    strand = as.character(strand(gr)),
                    metadata = if (ncol(mcols(gr)) > 0) as.list(mcols(gr)) else list()
                  )
                )
              })
            )
          } else if (is.data.frame(result) || inherits(result, "data.table")) {
            output <- list(
              type = "DataTable",
              data = as.list(result)
            )
          } else {
            output <- list(
              type = "generic",
              data = result
            )
          }
          
          jsonlite::write_json(list(success = TRUE, result = output), "${outputFile}")
        }, error = function(e) {
          jsonlite::write_json(list(success = FALSE, error = as.character(e$message)), "${outputFile}")
        })
      `;
            fs.writeFileSync(tempFile, wrappedCommand);
            const rProcess = (0, child_process_1.spawn)('Rscript', ['--vanilla', tempFile]);
            rProcess.on('close', (code) => {
                try {
                    if (fs.existsSync(outputFile)) {
                        const output = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
                        // Clean up temp files
                        fs.unlinkSync(tempFile);
                        fs.unlinkSync(outputFile);
                        if (output.success) {
                            resolve({
                                success: true,
                                data: output.result.data,
                                type: output.result.type
                            });
                        }
                        else {
                            resolve({
                                success: false,
                                error: output.error
                            });
                        }
                    }
                    else {
                        resolve({
                            success: false,
                            error: `R process exited with code ${code}`
                        });
                    }
                }
                catch (error) {
                    resolve({
                        success: false,
                        error: `Failed to parse R output: ${error}`
                    });
                }
            });
            rProcess.on('error', (error) => {
                resolve({
                    success: false,
                    error: `R process error: ${error.message}`
                });
            });
        });
    }
    // Convert TypeScript objects to R commands
    formatRObject(obj) {
        if (obj === null || obj === undefined) {
            return 'NULL';
        }
        if (typeof obj === 'boolean') {
            return obj ? 'TRUE' : 'FALSE';
        }
        if (typeof obj === 'number') {
            return obj.toString();
        }
        if (typeof obj === 'string') {
            return `"${obj.replace(/"/g, '\\"')}"`;
        }
        if (Array.isArray(obj)) {
            return `c(${obj.map(item => this.formatRObject(item)).join(', ')})`;
        }
        if (obj.type === 'GRanges' && obj.data) {
            return this.formatGRanges(obj.data);
        }
        if (obj.type === 'GRangesList' && obj.data) {
            return this.formatGRangesList(obj.data);
        }
        // Generic object
        const entries = Object.entries(obj)
            .map(([key, value]) => `${key} = ${this.formatRObject(value)}`)
            .join(', ');
        return `list(${entries})`;
    }
    formatGRanges(ranges) {
        if (ranges.length === 0) {
            return 'GRanges()';
        }
        const seqnames = ranges.map(r => `"${r.seqnames}"`).join(', ');
        const starts = ranges.map(r => r.start).join(', ');
        const ends = ranges.map(r => r.end).join(', ');
        const strands = ranges.map(r => `"${r.strand || '*'}"`).join(', ');
        let cmd = `GRanges(
      seqnames = c(${seqnames}),
      ranges = IRanges(start = c(${starts}), end = c(${ends})),
      strand = c(${strands})`;
        // Add metadata if present
        if (ranges[0]?.metadata && Object.keys(ranges[0].metadata).length > 0) {
            const metadataCols = Object.keys(ranges[0].metadata);
            const metadataStr = metadataCols.map(col => {
                const values = ranges.map(r => this.formatRObject(r.metadata?.[col])).join(', ');
                return `${col} = c(${values})`;
            }).join(', ');
            cmd += `,\n      ${metadataStr}`;
        }
        cmd += ')';
        return cmd;
    }
    formatGRangesList(data) {
        const elements = data.map(item => {
            const gr = this.formatGRanges(item.ranges);
            return `"${item.id}" = ${gr}`;
        }).join(',\n  ');
        return `GRangesList(\n  ${elements}\n)`;
    }
    // Parse R output back to TypeScript objects
    parseROutput(result) {
        if (!result.success || !result.data) {
            throw new Error(result.error || 'R execution failed');
        }
        switch (result.type) {
            case 'GRanges':
                return this.parseGRanges(result.data);
            case 'GRangesList':
                return this.parseGRangesList(result.data);
            case 'DataTable':
                return this.parseDataTable(result.data);
            default:
                return result.data;
        }
    }
    parseGRanges(data) {
        const { seqnames, start, end, strand, metadata } = data;
        const ranges = [];
        for (let i = 0; i < seqnames.length; i++) {
            const range = {
                seqnames: seqnames[i],
                start: start[i],
                end: end[i],
                strand: strand[i],
                width: end[i] - start[i] + 1
            };
            if (metadata && Object.keys(metadata).length > 0) {
                range.metadata = {};
                for (const key of Object.keys(metadata)) {
                    range.metadata[key] = metadata[key][i];
                }
            }
            ranges.push(range);
        }
        return ranges;
    }
    parseGRangesList(data) {
        return data.map(item => ({
            id: item.id,
            ranges: this.parseGRanges(item.ranges),
            metadata: item.metadata
        }));
    }
    parseDataTable(data) {
        const columns = data;
        const nrows = columns[Object.keys(columns)[0]]?.length || 0;
        return { columns, nrows };
    }
    async close() {
        if (this.rProcess) {
            this.rProcess.kill();
            this.rProcess = null;
        }
        this.initialized = false;
        // Clean up temp directory
        if (fs.existsSync(this.tempDir)) {
            fs.rmSync(this.tempDir, { recursive: true });
        }
    }
}
exports.RBridge = RBridge;
//# sourceMappingURL=rbridge.js.map