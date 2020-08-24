const core = require("@actions/core");
const github = require("@actions/github");
var requestError = require("@octokit/request-error");

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const accessToken = core.getInput("accessToken");
const octokit = github.getOctokit(accessToken);
const headBranch = core.getInput("headBranch");
let branchRegex = core.getInput("branchRegex");
if (branchRegex) {
  branchRegex = new RegExp(branchRegex);
  console.log(`Filtering braches with regex: ${branchRegex}`);
}

async function run() {
  let keepCheckingBranches = true;
  let currentPage = 1;
  while (keepCheckingBranches) {
    const { data: branches } = await octokit.repos.listBranches({
      owner: owner,
      repo: repo,
      page: currentPage,
    });
    console.log(`${branches.length} branches on page ${currentPage}`);

    branches.forEach(({ name, ...br }) => {
      if (branchRegex) {
        if (name.match(branchRegex)) {
          mergeWithMaster(name);
        }
      } else {
        mergeWithMaster(name);
      }
    });
    if (branches.length == 0) {
      keepCheckingBranches = false;
    } else {
      currentPage += 1;
    }
  }
}

async function mergeWithMaster(branch) {
  if (branch == headBranch) {
    return;
  }
  try {
    const { status, ...response } = await octokit.repos.merge({
      owner: owner,
      repo: repo,
      base: branch,
      head: headBranch,
    });
    switch (status) {
      case 201:
        console.log(`Merging ${headBranch} to ${branch} successful`);
        break;
      case 204:
        console.log(`Nothing to merge from ${headBranch} to ${branch}`);
        break;
      default:
        console.warn(`Merging ${headBranch} to ${branch}:`, response);
        break;
    }
  } catch (error) {
    let msg = error;
    if (error instanceof requestError.RequestError) {
      msg = `[${error.status}] ${error.message}`
    }
    console.error(`Error merging ${headBranch} to ${branch}:`, msg);
  }
}

run();
