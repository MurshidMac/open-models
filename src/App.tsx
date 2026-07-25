import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { getOpenModels, type ModelCatalogItem } from './lib/models'

const API_URL = 'https://models.dev/api.json'
const MODELS_URL = 'https://models.dev/models.json'

function App() {
  const [models, setModels] = useState<ModelCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [providerFilter, setProviderFilter] = useState('all')

  useEffect(() => {
    let isMounted = true

    async function loadModels() {
      try {
        const [apiResponse, modelsResponse] = await Promise.all([
          fetch(API_URL),
          fetch(MODELS_URL),
        ])

        if (!apiResponse.ok || !modelsResponse.ok) {
          throw new Error('Unable to fetch model catalog from models.dev.')
        }

        const [apiData, modelsData] = await Promise.all([
          apiResponse.json(),
          modelsResponse.json(),
        ])

        if (!isMounted) return

        const parsed = getOpenModels(apiData, modelsData)
        setModels(parsed)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'An unknown error occurred.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadModels()

    return () => {
      isMounted = false
    }
  }, [])

  const providers = useMemo(
    () => ['all', ...new Set(models.map((model) => model.provider))].sort(),
    [models],
  )

  const filteredModels = useMemo(() => {
    const term = search.trim().toLowerCase()

    return models.filter((model) => {
      const matchesProvider = providerFilter === 'all' || model.provider === providerFilter
      const matchesSearch =
        !term ||
        model.name.toLowerCase().includes(term) ||
        model.providerName.toLowerCase().includes(term) ||
        model.description.toLowerCase().includes(term)

      return matchesProvider && matchesSearch
    })
  }, [models, providerFilter, search])

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Open model catalog</p>
          <h1>Browse open-weight models from the community endpoints</h1>
          <p className="hero-copy">
            This view combines the providers list from the Models.dev API with the public models catalog,
            making it easy to discover accessible open-weight models.
          </p>
        </div>
        <div className="hero-metrics">
          <div>
            <strong>{models.length}</strong>
            <span>models</span>
          </div>
          <div>
            <strong>{providers.length - 1}</strong>
            <span>providers</span>
          </div>
        </div>
      </section>

      <section className="toolbar">
        <label className="search-field">
          <span>Search</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find a model or provider"
          />
        </label>

        <label className="select-field">
          <span>Provider</span>
          <select value={providerFilter} onChange={(event) => setProviderFilter(event.target.value)}>
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {provider === 'all' ? 'All providers' : provider}
              </option>
            ))}
          </select>
        </label>
      </section>

      {loading && <p className="status">Loading models…</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && (
        <section className="model-grid">
          {filteredModels.map((model) => (
            <article key={model.id} className="model-card">
              <div className="card-top">
                <div>
                  <p className="provider">{model.providerName}</p>
                  <h2>{model.name}</h2>
                </div>
                <span className="badge">Open weights</span>
              </div>

              <p className="description">{model.description || 'No description provided.'}</p>

              <div className="meta-list">
                {model.releaseDate && <span>Released {model.releaseDate}</span>}
                {model.knowledge && <span>Knowledge {model.knowledge}</span>}
                {model.contextWindow && <span>Context {model.contextWindow.toLocaleString()}</span>}
                {model.outputWindow && <span>Output {model.outputWindow.toLocaleString()}</span>}
              </div>

              {model.modalities.length > 0 && (
                <div className="chip-row">
                  {Array.from(new Set(model.modalities))
                    .slice(0, 4)
                    .map((modality) => (
                      <span key={modality} className="chip">
                        {modality}
                      </span>
                    ))}
                </div>
              )}

              <div className="card-actions">
                {model.docUrl && (
                  <a href={model.docUrl} target="_blank" rel="noreferrer">
                    Provider docs
                  </a>
                )}
                {model.weights.length > 0 && (
                  <a href={model.weights[0].url} target="_blank" rel="noreferrer">
                    Weight link
                  </a>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default App
