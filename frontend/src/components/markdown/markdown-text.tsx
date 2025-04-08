"use client";

import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";
import { CheckIcon, CopyIcon } from "lucide-react";
import { FC, memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "./markdown-styles.css";
import { TooltipIconButton } from "./tooltip-icon-button";
import { SyntaxHighlighter } from "./syntax-highlighter";

interface CodeHeaderProps {
  language?: string;
  code: string;
}

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-t-lg bg-zinc-900 px-4 py-2 text-md font-semibold text-white">
      <span className="lowercase [&>span]:text-sm">{language}</span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

const defaultComponents: any = {
  // Headings remain unchanged
  h1: ({ className, ...props }: { className?: string }) => (
    <h1
      className={cn(
        "mb-6 scroll-m-20 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl last:mb-0",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: { className?: string }) => (
    <h2
      className={cn(
        "mb-5 mt-10 scroll-m-20 text-3xl font-semibold tracking-tight md:text-4xl first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: { className?: string }) => (
    <h3
      className={cn(
        "mb-4 mt-8 scroll-m-20 text-2xl font-semibold tracking-tight md:text-3xl first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: { className?: string }) => (
    <h4
      className={cn(
        "mb-3 mt-6 scroll-m-20 text-xl font-medium tracking-tight md:text-xl first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: { className?: string }) => (
    <h5
      className={cn(
        "my-3 text-lg font-medium md:text-xl first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: { className?: string }) => (
    <h6
      className={cn(
        "my-2 text-md font-medium md:text-lg first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),

  // Adjusted text components
  p: ({ className, ...props }: { className?: string }) => (
    <p
      className={cn(
        "my-5 leading-relaxed text-sm/6 sm:text-[16px]/6 lg:text-[16px]/7 first:mt-0 last:mb-0",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: { className?: string }) => (
    <a
      className={cn(
        "text-primary font-medium underline underline-offset-4 hover:text-primary/80 text-sm/6 sm:text-[16px]/6 lg:text-[16px]/7",
        className
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: { className?: string }) => (
    <blockquote
      className={cn(
        "border-l-2 border-primary/20 pl-4 italic text-sm/6 sm:text-[16px]/6 lg:text-[16px]/7 md:pl-6",
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: { className?: string }) => (
    <ul
      className={cn(
        "my-4 ml-6 text-sm/6 sm:text-[16px]/6 lg:text-[16px]/7 list-disc [&>li]:mt-2",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: { className?: string }) => (
    <ol
      className={cn(
        "my-4 ml-6 text-sm/6 sm:text-[16px]/6 lg:text-[16px]/7 list-decimal [&>li]:mt-2",
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }: { className?: string }) => (
    <div className="overflow-x-auto">
      <table
        className={cn(
          "my-4 w-full border-separate border-spacing-0 text-sm/6 sm:text-[16px]/6 lg:text-[16px]/7",
          className
        )}
        {...props}
      />
    </div>
  ),
  th: ({ className, ...props }: { className?: string }) => (
    <th
      className={cn(
        "bg-muted px-4 py-2 text-left font-bold text-sm/6 sm:text-[16px]/6 lg:text-[16px]/7 first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: { className?: string }) => (
    <td
      className={cn(
        "border-b border-l px-4 py-2 text-left text-sm/6 sm:text-[16px]/6 lg:text-[16px]/7 last:border-r [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: { className?: string }) => (
    <div className="my-4 overflow-hidden rounded-lg bg-[#0d1117]">
      <pre
        className={cn(
          "overflow-x-auto p-4 leading-relaxed text-sm/6 sm:text-[16px]/6 lg:text-[16px]/7",
          className
        )}
        {...props}
      />
    </div>
  ),
  code: ({
    className,
    children,
    ...props
  }: {
    className?: string;
    children: any;
  }) => {
    const match = /language-(\w+)/.exec(className || "");

    if (match) {
      const language = match[1];
      const code = String(children).replace(/\n$/, "");

      return (
        <>
          <CodeHeader language={language} code={code} />
          <SyntaxHighlighter language={language} className={className}>
            {code}
          </SyntaxHighlighter>
        </>
      );
    }

    return (
      <code
        className={cn(
          "rounded bg-muted px-1.5 py-0.5 font-mono text-sm/6 sm:text-[16px]/6 lg:text-[16px]/7",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  // Other components remain unchanged
  hr: ({ className, ...props }: { className?: string }) => (
    <hr className={cn("my-6 border-t border-border", className)} {...props} />
  ),
  tr: ({ className, ...props }: { className?: string }) => (
    <tr
      className={cn(
        "m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
        className
      )}
      {...props}
    />
  ),
  sup: ({ className, ...props }: { className?: string }) => (
    <sup
      className={cn("[&>a]:text-sm [&>a]:no-underline", className)}
      {...props}
    />
  ),
};

interface MarkdownTextProps {
  children: string;
  className?: string;
}

const MarkdownTextImpl: FC<MarkdownTextProps> = ({ children, className }) => {
  return (
    <div className={cn("prose-responsive", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={defaultComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export const MarkdownText = memo(MarkdownTextImpl);
