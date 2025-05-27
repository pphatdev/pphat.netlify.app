#!/usr/bin/env node

import { performance } from 'perf_hooks';

const startTime = performance.now();
export * from './test-structured-data';
export * from './test-seo-config';
const endTime = performance.now();

const executionTime = endTime - startTime;
console.log(`\n✨ Total execution time: ${executionTime.toFixed(2)} ms`);
console.log('✨ SEO and Structured Data Tests Started!');
