# 4.3.0
### Added
- The `IconInput` component.
- The `TablerIcon` component.
- The `validateFormThrow` function.

### Changed
- Switched tooling to `pnpm`.
- Moved some dependencies to `peerDependencies`.

### Removed
- Moved many of the utility methods into their own package, `@encode42/node-extras`.
  - `leadingSlash`
  - `safeJSON`
  - `validateForm`
  - `variableName`

# 4.2.2
### Changed
- Updated all dependencies.

# 4.2.1
### Changed
- `Anchor` now falls back to a regular Mantine `Anchor` if an external link is detected.

# 4.1.3
### Removed
- The `getEnv` function.

### Changed
- All `process.env` argument defaults have been removed.
  - This is due to an issue with dotenv packing with the client.
  - This affects `Auth`, `Theme`, and `storageBuilder`.

# 4.1.1
### Added
- The `validateFormOptions#fullReturn` option.

# 4.1.0
### Added
- The `options` argument to `validateForm`.
- The `validateFormOptions` interface.

# 4.0.1
### Changed
- Updated all dependencies.

# 4.0.0
### Added
- The `AuthProps#storage` option.
  - Affects the `Auth` constructor.
- The `logoutOptions` interface.
- The `Context` interface.
  - The `action` of a registered provider now includes a `context` object.
- The `Auth#getProvider` method.
- The `options` argument to `Auth#logout`.
- The `safeJSON` function.
- The `storageBuilder.database` function.
- The `ThemeProps#storage` option.
- The `ThemeProps#onChange` option.
  - Called when a request's theme is set.
- The `ThemeProps#onGet` option.
  - Called when a request's theme is requested.
- The `validateForm` function.
- The `variableName` function.
- The `DisplayName` Zod object.
- The `Status` Zod object.
- The `Bio` Zod object.

### Changed
- Improved documentation.
- The `BrandIcons` interface is now exported.
- The `userUser` context generic no longer extends `GenericUser`.
- Renamed the `Auth#sessionStorage` field to `Auth#storage`.
- `Auth#logout` is now manually handled, rather than handled by `remix-auth`.
  - Renamed the `sessionStorage` argument to `storage` in `authBuilder`.
- `storageBuilder` is now an object that holds two functions.
  - `cookie` will build a cookie-based session.
  - `database` will build a database-based session.
- Renamed the `Theme#sessionStorage` field to `Theme#storage`.

### Removed
- The `AuthProps#secret` option.
  - Affects the `Auth` constructor.
- The `getAccountOptions` interface.
- The `Action` interface.
- The `Response` interface.
- The `GenericUser` interface.

# 3.0.1
### Changed
- No longer depends on packages provided by mantine-extras.

# 3.0.0
### Changed
- Updated to mantine-extras 4.0.0.

# 2.2.1
### Fixed
- Incorrect usage of children in `LoginWrapper`.

# 2.2.0
### Added
- The `LoginWrapper` component.
- The `Login#brandIcons` variable.

### Removed
- The `AvatarMenu` component.
- The `AvatarMenuWrapper` component.

# 2.1.2
### Fixed
- Made `AvatarMenuWrapperProps#to` optional.

# 2.1.1
### Fixed
- Bumped `@encode42/mantine-extras` version.

# 2.1.0
### Fixed
- `Anchor` without `to` will no longer throw an error.
- `ErrorPage` throwing an error.

### Added
- The `AvatarMenu` component.
- The `AvatarMenuWrapper` component.
- The `Login` component.

### Removed
- The `ThemeToggle` component. Moved to `@encode42/mantine-extras`.

# 2.0.0
### Changed
- `API#EndpointCallback` type generic defaults to `unknown`.
- Renamed `API#getFormat`'s `withName` argument to `withURL`.
- Renamed `API#format`'s `withName` argument to `withURL`.
- Changed the `Auth#logoutRoute` field to `readonly`.
- `Auth`'s `storageBuilder` cookie is now named `_auth`.
- `Auth#register`'s return value now properly defaults `name` to `provider`.
- `authBuilder`'s `sessionKey` is now named `_auth`.
- `storageBuilder`'s `secret` argument is now optional.

### Added
- The `ThemeToggle` component.
- The `UserProvider` context provider.
- Documentation for `API#getFormat`.
- Documentation for `Auth#fromProps`.
- `Auth#registerProps`'s `verify` property accepts type generic.
- `Auth#LoaderProcess` function type.
- Type to `Auth#logout`'s `request` argument.
- The `Auth#loader` function.
- The `GenericUser` interface.
- The `name` property to `storageBuilderProps`.
- The `name` argument to `storageBuilder`. Defaults to `_session`.
- The `Theme` class.
- The `validation` zodfile.

### Removed
- `Auth#registerProps`'s `User` generic.

# 1.1.0
### Changed
- Use `ynpx` instead of `npx`.

### Added
- The `Auth#from` static function.

# 1.0.0
This is the first officially-supported version of `remix-extras`.
