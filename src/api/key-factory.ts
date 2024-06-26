export const shapeKeys = {
  all: ['shapes'] as const,
  detail: (id: string) => [...shapeKeys.all, id] as const,
}

