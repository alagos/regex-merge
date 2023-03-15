# Regex Merge

Github Action for multiple branches merging

## Inputs

### `accessToken`

**Required** Github token. Usually secrets.GITHUB_TOKEN.

### `headBranch`

**Required** Branch to merge.

### `branchRegex`

Regex pattern for all branches to be updated.

### `notifyConflicts`

Comments in related PR to branch, notifying about the merge conflict.

## Example usage

```yaml
permissions: write-all
runs-on: ubuntu-latest
steps:
  - name: Merge main to release/.+
    uses: alagos/regex-merge@v1.2
    with:
      accessToken: ${{ secrets.GITHUB_TOKEN }}
      headBranch: main
      branchRegex: '^(release|staging)\/.+'
```
