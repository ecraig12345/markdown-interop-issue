If a library enables `esModuleInterop` and uses ES default imports (`import React from 'react'`) for a package such as React which uses an older style of exports (`export = React`), it can have a cascading effect which forces all of the library's consumers to either enable `esModuleInterop` or `skipLibCheck`.

`markdown-to-jsx` version 7 has this issue.

## Repro

(This is already set up in this repo, just clone and `yarn && yarn build`)

Add dependencies: `markdown-to-jsx@7 typescript @types/react react`
(typescript and react versions don't matter)

Ensure these options are set to false (or unset since they default to false) in `tsconfig.json` `compilerOptions`:
```json
"esModuleInterop": false,
"allowSyntheticDefaultImports": false,
"skipLibCheck": false
```

Make a basic file (`src/index.tsx`):
```tsx
import * as React from 'react';
import Markdown from 'markdown-to-jsx';

export const MyComponent = () => <Markdown>hello</Markdown>;
```

Attempt to compile and observe errors:
```
$ tsc -b
node_modules/markdown-to-jsx/dist/index.d.ts:6:8 - error TS1259: Module '"/<path>/markdown-interop-issue/node_modules/@types/react/index"' can only be default-imported using the 'allowSyntheticDefaultImports' flag

6 import React from 'react';
         ~~~~~

  node_modules/@types/react/index.d.ts:65:1
    65 export = React;
       ~~~~~~~~~~~~~~~
    This module is declared with using 'export =', and can only be used with a default import when using the 'allowSyntheticDefaultImports' flag.
```

Enabling `allowSyntheticDefaultImports` or `esModuleInterop` works around this, but that's not a workable solution if the consumer is another library that wants to avoid forcing the same option on its consumers as well (especially if `markdown-to-jsx`'s types are used in exported APIs, but it could also happen if authors start using synthetic default imports of React within the library).

Enabling `skipLibCheck` silences the error, but this loses some (small) degree of type safety and may not be desirable in all projects, and it has the same issue of forcing the option on consumers if any of `markdown-to-jsx`'s types are used in exported APIs.

The actual component which motivated this issue is a wrapper of `markdown-to-jsx` which exposes `overrides` in its props. You can see code using `markdown-to-jsx` 6 and its `@types` here: [types](https://github.com/microsoft/fluentui/blob/2170ed575f77bc6852cfe5a2fe4974c7f9a64a9e/packages/react-docsite-components/src/components/Markdown/Markdown.types.ts#L18), [component](https://github.com/microsoft/fluentui/blob/2170ed575f77bc6852cfe5a2fe4974c7f9a64a9e/packages/react-docsite-components/src/components/Markdown/Markdown.tsx#L36).