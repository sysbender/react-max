const { execSync } = require("child_process");
const { basename } = require("path");
//const rimraf1 = require("rimraf");
const { rimraf, rimrafSync, native, nativeSync } = require("rimraf");
const fs = require("fs");

function isValidString(str) {
  if (!str) return false;
  if (str.length < 5) return false;
  // Regular expression to check if the string only contains letters, numbers, dashes, and underscores
  const validRegex = /^[a-zA-Z0-9-_]+$/;

  // Test the string against the regular expression and return the result
  return validRegex.test(str);
}

async function cloneAndCheckoutBranches(githubRepoUrl) {
  const repoName = basename(githubRepoUrl, ".git");

  try {
    // Clone the repository
    execSync(`git clone ${githubRepoUrl}`);
    process.chdir(repoName);

    // Fetch branches
    execSync("git fetch");

    // Get list of branches
    const branchesOutput = execSync("git branch -r").toString();
    const branches = branchesOutput
      .split("\n")
      .map((branch) => branch.trim())
      .filter((branch) => branch !== "");

    // Checkout each branch and clone into folder
    for (const branch of branches) {
      const branchName = branch.split("/")[1];
      if (isValidString(branchName)) {
        console.log(`Checking out branch: ${branchName}`);
        execSync(`git checkout ${branchName}`);

        // Clone into a folder with the branch name
        const branchPath = `../${branchName}`;
        //execSync(`git clone . ../${branchName}`);
        execSync(`git clone . ${branchPath}`);
        //
        rimrafSync(`${branchPath}/.git`);
      }
    }

    // Remove .git folders
    // console.log("deleting .git");
    // await new Promise((resolve, reject) => {
    //   rimraf1(".git", (err) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Usage
const githubRepoUrl = "https://github.com/academind/react-complete-guide-code";
cloneAndCheckoutBranches(githubRepoUrl);
