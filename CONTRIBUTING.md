# Contributing to n8n Chat Svelte

Thank you for your interest in contributing! 🎉

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/n8n-io/n8n-chat-svelte.git
   cd n8n-chat-svelte
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to http://localhost:5173 to see the demo app.

## Project Structure

```
src/
├── lib/                          # Library source code
│   ├── chat-headless/           # Headless components
│   │   ├── components/          # Svelte components
│   │   ├── stores/              # State management (Svelte 5 runes)
│   │   ├── types/               # TypeScript types
│   │   ├── api/                 # API utilities
│   │   └── utils/               # Helper functions
│   ├── chat-styled/             # Styled components
│   │   └── components/          # AIChat component
│   └── index.ts                 # Main exports
└── routes/                       # Demo application
    └── +page.svelte             # Demo page with examples
```

## Development Workflow

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Use TypeScript for type safety
   - Use Svelte 5 runes (`$state`, `$derived`) for reactivity
   - Add comments for complex logic

3. **Test your changes**
   ```bash
   npm run check        # Type checking
   npm run lint         # Linting
   npm test             # Run tests
   ```

4. **Format your code**
   ```bash
   npm run format
   ```

### Code Style

- **Svelte 5**: Use runes (`$state`, `$derived`) instead of stores
- **TypeScript**: All new code should be fully typed
- **Formatting**: We use Prettier - run `npm run format`
- **Linting**: We use ESLint - run `npm run lint`

### Component Guidelines

#### For Headless Components
- Keep components unstyled and flexible
- Use Svelte 5 snippets for customization
- Provide sensible defaults
- Document all snippet parameters

#### For Styled Components
- Maintain consistent design system
- Use CSS variables for theming
- Ensure accessibility (ARIA labels, keyboard nav)
- Support both light and dark themes

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add file upload support to HeadlessInput
fix: resolve session loading issue
docs: update README with i18n examples
style: format code with Prettier
refactor: simplify message rendering logic
test: add tests for chat store
chore: update dependencies
```

## Pull Request Process

1. **Update documentation**
   - Update README.md if you add features
   - Add TypeScript types for new APIs
   - Update CHAT_README.md for detailed changes

2. **Test thoroughly**
   - Test in both demo modes (styled and headless)
   - Check TypeScript compilation
   - Verify no console errors

3. **Submit PR**
   - Write a clear description of changes
   - Reference any related issues
   - Add screenshots for UI changes

4. **Review process**
   - Maintainers will review your PR
   - Address any feedback
   - Once approved, we'll merge!

## Building for Production

```bash
# Build the library
npm run build

# Check package before publishing
npm run prepack
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:unit

# Type checking
npm run check
```

## Adding New Features

### Adding a New Component

1. Create the component in the appropriate directory
2. Export it from the index files
3. Add TypeScript types
4. Document usage in README
5. Add example to demo page

### Adding i18n Support

1. Add keys to `I18nMessages` interface in `types/options.ts`
2. Update `getI18nMessages` in `utils/i18n.ts`
3. Add examples to demo page
4. Document in README

### Adding Tests

We use Vitest for testing:

```typescript
import { describe, it, expect } from 'vitest';

describe('YourFeature', () => {
  it('should work correctly', () => {
    // Your test
    expect(true).toBe(true);
  });
});
```

## Questions?

- 📖 Check the [README](README.md)
- 💬 Open a [Discussion](https://github.com/n8n-io/n8n-chat-svelte/discussions)
- 🐛 Found a bug? [Open an issue](https://github.com/n8n-io/n8n-chat-svelte/issues)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (Sustainable Use License).

---

Thank you for making n8n Chat Svelte better! ❤️
