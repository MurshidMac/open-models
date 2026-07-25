export type ModelCatalogItem = {
  id: string
  provider: string
  providerName: string
  modelId: string
  name: string
  description: string
  openWeights: boolean
  releaseDate: string
  knowledge: string
  contextWindow: number | null
  outputWindow: number | null
  modalities: string[]
  weights: Array<{ label: string; url: string }>
  docUrl: string
}

type ProviderApiEntry = {
  id?: string
  name?: string
  doc?: string
  models?: Record<string, ApiModelEntry>
}

type ApiModelEntry = {
  id?: string
  name?: string
  description?: string
  family?: string
  attachment?: boolean
  reasoning?: boolean
  tool_call?: boolean
  structured_output?: boolean
  temperature?: boolean
  knowledge?: string
  release_date?: string
  last_updated?: string
  modalitites?: {
    input?: string[]
    output?: string[]
  }
  open_weights?: boolean
  limit?: {
    context?: number
    output?: number
  }
  cost?: {
    input?: number
    output?: number
    cache_read?: number
    cache_write?: number
  }
}

type CatalogModelEntry = {
  id?: string
  name?: string
  description?: string
  family?: string
  attachment?: boolean
  reasoning?: boolean
  tool_call?: boolean
  structured_output?: boolean
  temperature?: boolean
  knowledge?: string
  release_date?: string
  last_updated?: string
  modalities?: {
    input?: string[]
    output?: string[]
  }
  open_weights?: boolean
  limit?: {
    context?: number
    output?: number
  }
  weights?: Array<{ label?: string; url?: string }>
}

export function getOpenModels(
  apiData: Record<string, ProviderApiEntry> | null | undefined,
  modelsData: Record<string, CatalogModelEntry> | null | undefined,
): ModelCatalogItem[] {
  const providers = apiData ?? {}
  const catalog = modelsData ?? {}

  return Object.entries(catalog)
    .map(([key, model]) => {
      const [provider, modelId] = key.split('/')
      const providerEntry = providers[provider]
      const modelName = model.name ?? model.id ?? modelId ?? key
      const isOpenWeights = Boolean(model.open_weights || model.weights?.length)

      if (!isOpenWeights) {
        return null
      }

      const weights = (model.weights ?? [])
        .filter((entry) => entry.label && entry.url)
        .map((entry) => ({ label: entry.label ?? 'Link', url: entry.url ?? '' }))

      return {
        id: key,
        provider,
        providerName: providerEntry?.name ?? provider,
        modelId: model.id ?? modelId ?? key,
        name: modelName,
        description: model.description ?? providerEntry?.models?.[modelId ?? '']?.description ?? '',
        openWeights: true,
        releaseDate: model.release_date ?? '',
        knowledge: model.knowledge ?? '',
        contextWindow: model.limit?.context ?? null,
        outputWindow: model.limit?.output ?? null,
        modalities: [...(model.modalities?.input ?? []), ...(model.modalities?.output ?? [])],
        weights,
        docUrl: providerEntry?.doc ?? '',
      }
    })
    .filter((entry): entry is ModelCatalogItem => Boolean(entry))
    .sort((left, right) => left.provider.localeCompare(right.provider))
}
