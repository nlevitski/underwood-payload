const potFamilyOrder = new Map([
  ['P', 0],
  ['C', 1],
])

type ParsedPotCode = {
  familyOrder: number
  size: number
}

function parsePotCode(code: string): ParsedPotCode | null {
  const match = code
    .trim()
    .toUpperCase()
    .match(/^([A-Z]+)\s*(\d+(?:[.,]\d+)?)$/)

  if (!match) {
    return null
  }

  const family = match[1]
  const size = Number(match[2]?.replace(',', '.'))

  if (!family || Number.isNaN(size)) {
    return null
  }

  return {
    familyOrder: potFamilyOrder.get(family) ?? Number.MAX_SAFE_INTEGER,
    size,
  }
}

export function comparePotCodes(left: string, right: string) {
  const leftCode = left.trim().toUpperCase()
  const rightCode = right.trim().toUpperCase()
  const leftValue = parsePotCode(leftCode)
  const rightValue = parsePotCode(rightCode)

  if (leftValue && rightValue) {
    return (
      leftValue.familyOrder - rightValue.familyOrder ||
      leftValue.size - rightValue.size ||
      leftCode.localeCompare(rightCode, 'ru', { numeric: true })
    )
  }

  if (leftValue) {
    return -1
  }

  if (rightValue) {
    return 1
  }

  return leftCode.localeCompare(rightCode, 'ru', { numeric: true })
}

export function getSizeLowerBound(label: string) {
  const firstNumber = label.match(/\d+(?:[.,]\d+)?/)?.[0]

  if (!firstNumber) {
    return Number.MAX_SAFE_INTEGER
  }

  const lowerBound = Number(firstNumber.replace(',', '.'))

  return Number.isNaN(lowerBound) ? Number.MAX_SAFE_INTEGER : lowerBound
}
