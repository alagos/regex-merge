# Multi Merge

Github Action for multiple branches merging

## Inputs

### `accessToken`

**Required** Github token. Usually secrets.GITHUB_TOKEN.

### `headBranch`

**Required** Branch to merge.

### `branchRegex`

Regex pattern for all branches to be updated.

## Example usage

```yaml
uses: visfleet/multimerge@v1
with:
  accessToken: ${{ secrets.GITHUB_TOKEN }}
  headBranch: master
  branchRegex: '^release\/.+'
```