import type { ReactNode } from "react";
import { Children, isValidElement } from "react";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function FolderIcon(): ReactNode {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[var(--ink-soft)]"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FileIcon(): ReactNode {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[var(--ink-soft)]"
    >
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  JSX children API:  <FileTree.Folder>  /  <FileTree.File>           */
/* ------------------------------------------------------------------ */

interface FolderProps {
  name: string;
  defaultOpen?: boolean;
  children?: ReactNode;
}

function Folder({ name, children }: FolderProps): ReactNode {
  return (
    <div>
      <div className="flex items-center gap-2 py-0.5">
        <FolderIcon />
        <span className="text-sm text-[var(--ink-soft)]">{name}</span>
      </div>
      {children && <div className="pl-5">{children}</div>}
    </div>
  );
}

interface FileProps {
  name: string;
  highlight?: boolean;
}

function File({ name, highlight }: FileProps): ReactNode {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <FileIcon />
      <span
        className={`text-sm ${
          highlight
            ? "font-medium text-[var(--accent)]"
            : "text-[var(--ink-soft)]"
        }`}
      >
        {name}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  data-prop API (original)                                           */
/* ------------------------------------------------------------------ */

interface FileTreeNode {
  name: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
  highlight?: boolean;
}

function TreeNode({
  node,
  depth,
}: {
  node: FileTreeNode;
  depth: number;
}): ReactNode {
  const paddingLeft = depth * 20;
  return (
    <>
      <div className="flex items-center gap-2 py-0.5" style={{ paddingLeft }}>
        {node.type === "directory" ? <FolderIcon /> : <FileIcon />}
        <span
          className={`text-sm ${
            node.highlight
              ? "font-medium text-[var(--accent)]"
              : "text-[var(--ink-soft)]"
          }`}
        >
          {node.name}
        </span>
      </div>
      {node.children?.map((child) => (
        <TreeNode key={child.name} node={child} depth={depth + 1} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export — supports both APIs                                   */
/* ------------------------------------------------------------------ */

interface FileTreePropsData {
  data: FileTreeNode[];
  children?: never;
}

interface FileTreePropsChildren {
  data?: never;
  children: ReactNode;
}

type FileTreeProps = FileTreePropsData | FileTreePropsChildren;

function FileTreeRoot({ data, children }: FileTreeProps): ReactNode {
  const hasJsxChildren =
    children != null &&
    Children.toArray(children).some((c) => isValidElement(c));

  return (
    <div className="my-6 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 font-mono">
      {hasJsxChildren
        ? children
        : data?.map((node) => (
            <TreeNode key={node.name} node={node} depth={0} />
          ))}
    </div>
  );
}

export const FileTree = Object.assign(FileTreeRoot, { Folder, File });
