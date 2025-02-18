import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRender = ({ children }) => {
  const content = typeof children === 'string' ? children : '';
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

export default MarkdownRender;
