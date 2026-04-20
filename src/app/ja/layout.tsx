import type { ReactNode } from "react";

export default function JaLayout({ children }: { children: ReactNode }): ReactNode {
  return <div lang="ja">{children}</div>;
}
