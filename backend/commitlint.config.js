/**
 * Commitlint: Conventional Commits (GIT_WORKFLOW.md).
 * Formato: tipo(alcance): descripción
 * Tipos: feat, fix, docs, chore.
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "chore", "build", "ci", "refactor", "style", "test"],
    ],
    "scope-empty": [0],
    "header-max-length": [2, "always", 100],
    "subject-case": [0],
  },
};
