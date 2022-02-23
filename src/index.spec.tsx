// sample test, mainly to see if it succeeds without any moduleNameMapper settings (it does)

import * as React from 'react';
import { CustomMarkdown } from './index';

it('works', () => {
  expect(() => <CustomMarkdown />).not.toThrow();
});
