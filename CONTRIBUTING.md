# Contributing to Arshiya's Portfolio

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## Code Standards

- **Formatting**: Uses Prettier and ESLint
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Comments**: Only for complex logic, keep code self-documenting
- **Performance**: Optimize renders, lazy load heavy components

## Commit Guidelines

- Use conventional commits: `type: description`
  - `feat:` new feature
  - `fix:` bug fix
  - `refactor:` code refactoring
  - `perf:` performance improvement
  - `docs:` documentation
  - `security:` security improvements

## Security

- Run `npm audit` before submitting PRs
- Don't commit `.env` or sensitive data
- Report security issues to shafizadearshiya@gmail.com

## Testing

- Test across multiple browsers and devices
- Ensure mobile responsiveness
- Verify 3D model fallback works on unsupported devices

## Pull Requests

1. Create a feature branch: `git checkout -b feature/description`
2. Make your changes and commit following guidelines
3. Push to your fork and create a pull request
4. Provide clear description of changes
5. Link any related issues

## Performance Checklist

- [ ] Lighthouse score ≥ 90
- [ ] No console warnings/errors
- [ ] Bundle size optimized
- [ ] Images optimized (lazy loading where applicable)
- [ ] 3D models tested on multiple devices

Thank you for contributing!
