# Ícones das lanes

Coloque aqui os SVGs das 5 roles. **Os arquivos atuais são placeholders** — basta
substituir o conteúdo de cada um pelo seu ícone, mantendo os nomes:

| Arquivo   | Lane            |
| --------- | --------------- |
| `top.svg` | Top             |
| `jungle.svg` | Jungle          |
| `mid.svg` | Mid             |
| `adcarry.svg` | ADC (BOT)       |
| `support.svg` | Suporte         |

## Como salvar o SVG

- Use `fill="currentColor"` (ou `stroke="currentColor"`) nos paths — assim o ícone
  herda a cor da badge automaticamente (dourado na sua line, vermelho no adversário).
  Os ícones são renderizados via CSS `mask`, então a cor do arquivo é ignorada de
  qualquer forma; o que importa é a **forma** (paths preenchidos).
- Prefira um `viewBox` quadrado (ex.: `0 0 24 24`) pra alinhar bonito no quadrado.
- Não precisa registrar nada: o `RoleBadge` importa os 5 por nome.
