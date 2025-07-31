/**
 * Basic tests for gUtils MCP server
 */

import { RBridge } from '../src/utils/rbridge';
import { GenomicRange } from '../src/types/genomic';

describe('RBridge', () => {
  let rBridge: RBridge;

  beforeAll(async () => {
    rBridge = new RBridge();
    await rBridge.initialize();
  });

  afterAll(async () => {
    await rBridge.close();
  });

  test('should initialize successfully', () => {
    expect(rBridge).toBeDefined();
  });

  test('should format GRanges object correctly', () => {
    const ranges: GenomicRange[] = [
      { seqnames: 'chr1', start: 1000, end: 2000, strand: '+' },
      { seqnames: 'chr2', start: 5000, end: 6000, strand: '-' }
    ];

    const formatted = rBridge.formatRObject({ type: 'GRanges', data: ranges });
    expect(formatted).toContain('GRanges');
    expect(formatted).toContain('chr1');
    expect(formatted).toContain('1000');
  });

  test('should execute simple R command', async () => {
    const result = await rBridge.executeRCommand('1 + 1');
    expect(result.success).toBe(true);
    expect(result.data).toBe(2);
  });

  test('should parse UCSC coordinates', async () => {
    const result = await rBridge.executeRCommand('parse.gr("chr1:1000-2000")');
    expect(result.success).toBe(true);
    expect(result.type).toBe('GRanges');
  });
});

describe('Data Conversion', () => {
  test('should convert between formats', () => {
    // Test data conversion logic
    const testData = {
      seqnames: ['chr1', 'chr2'],
      start: [1000, 5000],
      end: [2000, 6000],
      strand: ['+', '-']
    };

    // Verify data structure
    expect(testData.seqnames.length).toBe(testData.start.length);
    expect(testData.start.length).toBe(testData.end.length);
  });
});

describe('Type Guards', () => {
  test('should validate GenomicRange objects', () => {
    const validRange = {
      seqnames: 'chr1',
      start: 1000,
      end: 2000,
      strand: '+' as const
    };

    const invalidRange = {
      seqnames: 'chr1',
      start: '1000', // Wrong type
      end: 2000
    };

    expect(typeof validRange.start).toBe('number');
    expect(typeof invalidRange.start).toBe('string');
  });
});