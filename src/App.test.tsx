import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows a loading state before data arrives', () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    render(<App />)

    expect(screen.getByText(/loading models/i)).toBeInTheDocument()
  })

  it('renders a catalog entry after the APIs load', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        zhipuai: {
          name: 'Zhipu AI',
          doc: 'https://example.com/docs',
          models: {},
        },
      }),
    })
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        'zhipuai/glm-5': {
          id: 'zhipuai/glm-5',
          name: 'GLM-5',
          description: 'A capable open model',
          open_weights: true,
          release_date: '2026-01-01',
          modalities: { input: ['text'], output: ['text'] },
          limit: { context: 128000, output: 32000 },
          weights: [{ label: 'Hugging Face', url: 'https://huggingface.co/example' }],
        },
      }),
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('GLM-5')).toBeInTheDocument()
    })

    expect(screen.getByText('A capable open model')).toBeInTheDocument()
    expect(screen.getByText(/zhipuai/i)).toBeInTheDocument()
  })

  it('shows an error message if the requests fail', async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('network down'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/network down/i)).toBeInTheDocument()
    })
  })
})
