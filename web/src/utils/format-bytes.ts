export function formatBytes(bytes: number): string {
  if (bytes < 0) {
    throw new Error('Size in bytes cannot be negative')
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let index = 0
  let result = bytes

  while (result >= 1024 && index < units.length - 1) {
    result /= 1024
    index++
  }

  return `${result.toFixed(2)} ${units[index]}`
}
