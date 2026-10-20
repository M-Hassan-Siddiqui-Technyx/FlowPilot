// Polyfills first: ES modules evaluate in import order, and react-dom (via testing-library) reads them on load.
import './polyfills'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
