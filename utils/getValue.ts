/**
 * Get value from object by path (supports dot notation and arrays)
 */

export function getValue(obj: any, path: string): any {
  if (!path || !obj) return undefined;

  // Split by dots and brackets
  const parts = path.split(/[\.\[\]]+/).filter(Boolean);
  
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    
    // Handle array indices
    const numPart = Number(part);
    if (!isNaN(numPart) && Array.isArray(current)) {
      current = current[numPart];
    } else {
      current = current[part];
    }
  }
  
  return current;
}
