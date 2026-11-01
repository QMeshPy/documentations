'use client';

import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page';

/**
 * COPY MD / OPEN IN, in the title row, as plain mono-caps controls
 * (Better Auth's page header).
 */
export function PageActions({ markdownUrl, githubUrl }: { markdownUrl: string; githubUrl: string }) {
  return (
    <div className="qm-actions">
      <MarkdownCopyButton markdownUrl={markdownUrl} className="qm-action">
        Copy MD
      </MarkdownCopyButton>
      <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} className="qm-action">
        Open in
      </ViewOptionsPopover>
    </div>
  );
}
