# Contributing to GatherUp

Thank you for your interest in contributing to GatherUp! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the project's coding standards

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test your changes
7. Commit your changes: `git commit -m "Description of changes"`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Open a Pull Request

## Development Workflow

### Setting Up Development Environment

```bash
# Install dependencies
pnpm install

# Start Supabase locally
cd supabase && supabase start

# Run all apps
pnpm dev
```

### Making Changes

1. **Code Style**: Follow the existing code style
   - Use TypeScript for all new code
   - Follow Prettier formatting (runs on save)
   - Use meaningful variable and function names

2. **Commits**: Write clear commit messages
   - Use present tense: "Add feature" not "Added feature"
   - Be descriptive but concise
   - Reference issues when applicable

3. **Testing**: Test your changes thoroughly
   - Test on both mobile and web platforms
   - Test authentication flows
   - Test real-time features
   - Check responsive design

### Project Structure

```
gatherup/
├── apps/
│   ├── mobile/          # React Native app
│   └── web/             # Next.js app
├── packages/
│   └── shared/          # Shared code
└── supabase/            # Database & migrations
```

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Changes are tested locally
- [ ] No console.log statements left in code
- [ ] TypeScript types are properly defined
- [ ] Documentation is updated if needed

### PR Description

Include:
- What changes were made
- Why these changes are necessary
- How to test the changes
- Screenshots (if UI changes)
- Related issues

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited

## Feature Requests

- Check if the feature already exists or is planned
- Open an issue with the "feature request" label
- Describe the feature and its use case
- Discuss implementation details

## Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (OS, browser, app version)

## Code Guidelines

### TypeScript

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // Implementation
}

// Avoid
function getUser(id) {
  // No types
}
```

### React Components

```typescript
// Good - Functional components with TypeScript
interface Props {
  title: string;
  onPress: () => void;
}

export function Button({ title, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
```

### API Calls

```typescript
// Good - Use shared API functions
import { getEvent } from '@gatherup/shared';

const { data } = useQuery({
  queryKey: ['event', id],
  queryFn: () => getEvent(id),
});

// Avoid - Direct Supabase calls in components
const supabase = getSupabase();
const { data } = await supabase.from('events').select();
```

## Areas for Contribution

### High Priority

- [ ] End-to-end tests
- [ ] Accessibility improvements
- [ ] Performance optimizations
- [ ] Documentation improvements

### Features

- [ ] Event categories and tags
- [ ] Event search and filters
- [ ] User profiles and settings
- [ ] Event invitations via email/SMS
- [ ] Calendar integration
- [ ] Map view for events

### Bug Fixes

Check the issues tab for known bugs.

## Questions?

- Open an issue with the "question" label
- Join our community discussions
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the project's license.

Thank you for contributing to GatherUp! 🎉
