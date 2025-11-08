# Contributing to Pizza Pantry

Thank you for your interest in contributing to Pizza Pantry! This document provides guidelines and best practices for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## Development Setup

1. Fork the repository
2. Clone your fork
3. Follow the [SETUP.md](./SETUP.md) instructions
4. Create a new branch for your feature

```bash
git checkout -b feature/your-feature-name
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types - use proper typing
- Export types and interfaces when reusable

### Code Style

- Follow the existing code style
- Run `npm run lint` before committing
- Use Prettier for formatting (configured)

### Component Structure

```typescript
// 1. Imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
}

// 3. Component
export function MyComponent({ title }: MyComponentProps) {
  // 4. State
  const [count, setCount] = useState(0);

  // 5. Handlers
  const handleClick = () => {
    setCount(count + 1);
  };

  // 6. Render
  return <div>{title}</div>;
}
```

### API Routes

- Always validate input with Zod
- Check authentication on protected routes
- Return proper HTTP status codes
- Handle errors gracefully

```typescript
export async function POST(request: NextRequest) {
  // 1. Auth check
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse and validate
  const body = await request.json();
  const validated = schema.safeParse(body);
  
  if (!validated.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validated.error.issues },
      { status: 400 }
    );
  }

  // 3. Business logic
  // ...

  // 4. Return response
  return NextResponse.json(data);
}
```

## Commit Messages

Follow conventional commits format:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(inventory): add bulk delete functionality
fix(api): prevent negative quantity adjustments
docs(readme): update setup instructions
```

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update the README.md with details of changes
5. Request review from maintainers

### PR Checklist

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing

## Testing

While tests are not currently implemented, when adding them:

- Write unit tests for utilities and helpers
- Write integration tests for API routes
- Write component tests for UI components
- Aim for >80% code coverage

## Feature Requests

1. Check existing issues first
2. Create a new issue with:
   - Clear description
   - Use cases
   - Proposed solution
   - Mockups (if UI change)

## Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

## Questions?

Open an issue with the `question` label.
