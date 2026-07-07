# Reelplay — Memória da Sessão

## Projeto
App full-stack para sortear filmes aleatórios da TMDB.
- **Frontend:** Vite + React 19 + TypeScript (porta 5173)
- **Backend:** Node.js + Fastify 5 + Prisma ORM + PostgreSQL Neon (porta 3333)

## O que foi feito (07/07/2026)

### Layout
- Filtros centralizados, collapsíveis com botão "Filtros ▼" (chevron animado)
- MovieCard vertical (capa grande em cima, info abaixo, separador entre eles)
- Card reduzido de 520px → 420px
- Navbar com logo à esquerda, watchlist + auth à direita (só aparece com filme ou em outras páginas)
- Header compacto (só login/watchlist) no canto superior direito quando sem filme
- Logo centralizado grande (2.8rem, Clapperboard size 40) na home sem filme
- Tagline removida
- Botão "Sortear filme" entre o conteúdo (logo/card) e os filtros
- Gradiente preto e branco no botão com brilho (box-shadow branco)

### Ícones (lucide-react)
- Clapperboard (logo, placeholders)
- Bookmark (watchlist)
- User (username)
- Dices (sortear)
- Calendar (ano), Star (rating), ThumbsUp (votos)
- ExternalLink (TMDB), Plus (watchlist), Trash2 (remover)
- ChevronDown (toggle filtros)

### Dropdown customizado (Select.tsx)
- Trigger estilizado com chevron animado
- Menu position: fixed com coordenadas via getBoundingClientRect
- Scrollbar estilizada (6px, #444)
- Suporte a renderValue e renderOption para customização
- Rating filter usa Star icon (fill dourado quando selecionado)

### Animações
- Filtros expandem com max-height + opacity (0.35s)
- Dropdown fadeIn + translateY (0.15s)
- Loading do botão: gradiente animado com vermelho → amarelo → azul → verde (2s loop)

### Reset
- Clicar no logo da navbar reseta o estado (homeKey incrementa, força remount do HomePage)

### Backend
- Rotas: /random, /auth/login, /health, /history, /watchlist
- JWT com 30 dias de expiração, username como identificador
- TMDB API para buscar filmes com filtros (gênero, ano, nota)

## Pendentes
- [ ] i18n (PT/EN)
- [ ] Mover JWT_SECRET para .env sem fallback
- [ ] Validar inputs (zod)
- [ ] Rate limiting
- [ ] Tratar 401 no frontend
- [ ] Senha com bcrypt ou Clerk
- [ ] Testes automatizados
- [ ] Poster com efeito tilt/parallax ao passar o mouse (usar vanilla-tilt ou similar)
