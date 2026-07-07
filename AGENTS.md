# Reelplay — Memória da Sessão

## Projeto
App full-stack para sortear filmes aleatórios da TMDB.
- **Frontend:** Vite + React 19 + TypeScript (porta 5173)
- **Backend:** Node.js + Fastify 5 + Prisma ORM + PostgreSQL Neon (porta 3333)

## O que foi feito (07/07/2026)

### Layout
- Filtros centralizados, collapsíveis com botão "Filtros ▼" (chevron animado)
- MovieCard vertical com poster solto (link próprio pro TMDB) e bloco de info separado
- Poster reduzido, sem container de fundo (flutuante com sombra)
- Fundo da página: radial-gradient (spotlight no centro)
- Bloco de info com efeito vidro gelo (backdrop-filter, semi-transparente)
- Navbar fixa no topo (64px), fundo semi-transparente com backdrop-filter
- Header compacto (home vazia) também fixo, mesmo estilo da navbar
- Logo grande centralizado na home sem filme (2.8rem)
- Botão voltar com ícone ArrowLeft, sem borda, sempre ocupa espaço (visibility: hidden)
- Botão "Sortear filme" entre conteúdo e filtros
- Gradiente no botão com brilho (animação 4s ease-in-out)

### Navegação
- User menu: username vira botão, ao clicar abre dropdown com Watchlist + Sair
- Mini menu estilizado com dropdown, fecha ao clicar fora
- Botão "Entrar" estilizado com fundo semi-transparente

### Watchlist
- Grid 5 colunas com posters em prateleira
- 15 filmes por página com paginação (botões numerados + setas)
- Botão remover (lixeira) sempre visível no canto superior do poster
- Nome do filme abaixo do poster
- Overlay com nota do TMDB aparece no hover dentro do poster (fade)

### Login
- Página estilizada com vidro gelo (glassmorphism)
- Logo Reelplay no topo, input semi-transparente, botão "Entrar" estilizado
- Toast de notificação in-site (slide down, 3s) substitui alert()

### Correções
- Dropdown do Select abre pra cima se não houver espaço abaixo
- Animação do Select sem translateY (só opacity) pra não conflitar com posicionamento
- overflow: hidden no wrapper de filtros pra evitar vazamento visual

### Ícones (lucide-react)
- Clapperboard, Bookmark, User, Dices, Calendar, Star, ThumbsUp, ExternalLink, Plus, Trash2, ChevronDown, ArrowLeft, LogOut, Check, AlertCircle, ChevronLeft, ChevronRight

### Cores padrão
- Texto dourado (#f5c518) para links/acções (Ler mais, Ver no TMDB, nota)
- Fundo escuro com gradiente
- Botões e inputs semi-transparentes

### Backend
- Rotas: /random, /auth/login, /health, /history, /watchlist
- JWT com 30 dias de expiração, username como identificador
- TMDB API para buscar filmes com filtros (gênero, ano, nota)

## Pendentes
- [ ] i18n (PT/EN)
- [ ] Mover JWT_SECRET para .env sem fallback
- [ ] Validar inputs (zod)
- [ ] Rate limiting
- [x] Tratar 401 no frontend
- [ ] Senha com bcrypt ou Clerk
- [ ] Testes automatizados
- [ ] Poster com efeito tilt/parallax ao passar o mouse (vanilla-tilt ou similar)
