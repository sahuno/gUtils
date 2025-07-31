/**
 * R Bridge for executing gUtils functions
 */
import { GenomicRange, GRangesList, DataTable } from '../types/genomic';
export interface RExecutionResult {
    success: boolean;
    data?: any;
    error?: string;
    type?: string;
}
export declare class RBridge {
    private rProcess;
    private initialized;
    private tempDir;
    constructor();
    initialize(): Promise<void>;
    executeRCommand(command: string): Promise<RExecutionResult>;
    formatRObject(obj: any): string;
    private formatGRanges;
    private formatGRangesList;
    parseROutput(result: RExecutionResult): GenomicRange[] | GRangesList[] | DataTable | any;
    private parseGRanges;
    private parseGRangesList;
    private parseDataTable;
    close(): Promise<void>;
}
//# sourceMappingURL=rbridge.d.ts.map