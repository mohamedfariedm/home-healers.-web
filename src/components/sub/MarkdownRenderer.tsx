import React, { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Card, CardContent } from "@/components/ui/card";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

// Types
interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  const components: Partial<Components> = {
    // Headers
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-center mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
    ),

    // Paragraphs and text
    p: ({ children }) => (
      <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>
    ),

    // Images
    img: ({ src, alt }) => (
      <div className="my-4 flex justify-center">
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto rounded-lg shadow-md"
        />
      </div>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <Card className="my-6 bg-gray-800/50">
        <CardContent className="p-4">
          <blockquote className="border-l-4 border-gray-600 pl-4">
            {children}
          </blockquote>
        </CardContent>
      </Card>
    ),

    // Links
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-blue-400 hover:text-blue-300 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Code blocks
    code: ({ children, className }) => {
      const isInline = !className;
      return isInline ? (
        <code className="bg-gray-800 rounded px-1 py-0.5">{children}</code>
      ) : (
        <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
          <code className={className}>{children}</code>
        </pre>
      );
    },

    // Emphasis
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,

    // Horizontal rule
    hr: () => <hr className="my-8 border-gray-700" />,
  };

  return (
    <div
      className={cn(
        "w-full mt-16 md:mt-24 mb-8 md:mb-12",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}  components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
