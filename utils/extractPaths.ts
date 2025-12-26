/**
 * Extract paths from JSON objects (supports nested objects and arrays)
 */

export function extractPaths(
  obj: any,
  prefix = "",
  result: string[] = []
): string[] {
  if (typeof obj !== "object" || obj === null) {
    if (prefix) result.push(prefix);
    return result;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    if (prefix) result.push(prefix);
    
    // Process first item to show structure
    if (obj.length > 0) {
      const firstItem = obj[0];
      if (typeof firstItem === "object" && firstItem !== null) {
        extractPaths(firstItem, `${prefix}[0]`, result);
      } else {
        result.push(`${prefix}[0]`);
      }
    }
    return result;
  }

  // Handle objects
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      result.push(path);
    } else if (Array.isArray(value)) {
      result.push(path);
      if (value.length > 0) {
        const firstItem = value[0];
        if (typeof firstItem === "object" && firstItem !== null && !Array.isArray(firstItem)) {
          extractPaths(firstItem, `${path}[0]`, result);
        } else {
          result.push(`${path}[0]`);
        }
      }
    } else if (typeof value === "object") {
      extractPaths(value, path, result);
    } else {
      result.push(path);
    }
  }

  return result;
}
