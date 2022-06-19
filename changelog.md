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
- `ThemeToggle` component.
- `UserProvider` context provider.
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
