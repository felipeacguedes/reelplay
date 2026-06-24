import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import './index.css'
import App from './App.tsx'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string
console.log('env completo:', import.meta.env)
console.log('publishableKey:', publishableKey)

if (!publishableKey) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY não definida no .env')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)