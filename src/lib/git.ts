import { execSync } from "child_process";

export function getLocalGitBranches(): string[] {
  try {
    const output = execSync("git branch --format='%(refname:short)' 2>/dev/null", {
      encoding: "utf8",
      timeout: 5000,
    });

    return output
      .split("\n")
      .map((branch) => branch.trim().replace(/^['"]|['"]$/g, ""))
      .filter((branch) => branch.length > 0);
  } catch {
    return [];
  }
}
