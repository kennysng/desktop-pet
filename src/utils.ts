export function cleanObj(obj: any) {
  if (Array.isArray(obj)) {
    obj.length = 0;
  } else if (typeof obj === 'object') {
    for (const key of Object.getOwnPropertyNames(obj)) delete obj[key];
  }
}
