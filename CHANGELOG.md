# Release Notes

## v3.0.0 (2021-05-03)

### Changed

- The first parameter of `getRender` is the template content instead of the path of a file with the template content.

- The second parameter of `render` is the template content instead of the path of a file with the content.

### Removed

- `cache` and `extension` options for the constructor.

- `cache` functionality.

- `setExtension`, `getExtension`, `setOptions`, `exists`, `getEncoding`, `getBase`, `setBase`, `setEncoding` and `mapResponse` functions.

## v2.0.0 (2020-07-11)

### Added

- Support for custom syntax/rules.

### Changed

- The `require` and `extends` tags work relative to the base directory variable.

## v1.3.0 (2020-06-17)

### Added

- Support for spreads with required views.

## v1.2.1 (2020-05-16)

### Fixed

- bug related to the `set` method.

## v1.2.0 (2020-05-02)

### Added

- Reusable code blocks.

## v1.1.2 (2020-04-30)

### Fixed

- Limitations related to imported views.

## v1.1.1 (2020-04-12)

### Fixed

- Bug related to parent block tags not working on the same line.

## v1.0.0 (2020-03-10)

- Initial release.
