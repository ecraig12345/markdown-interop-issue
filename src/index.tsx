import * as React from 'react';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';

export interface CustomMarkdownProps {
  options?: MarkdownToJSX.Options;
  name?: string;
}

export const CustomMarkdown: React.FunctionComponent<CustomMarkdownProps> = props => (
  <Markdown options={props.options}>hello {props.name}</Markdown>
);
