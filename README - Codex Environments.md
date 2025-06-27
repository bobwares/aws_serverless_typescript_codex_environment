ChatGPT Codex lets you spin up a disposable, cloud-hosted workspace—called an *environment*—that is automatically pre-cloned with a GitHub repository you choose.
Inside that sandbox, Codex can read and edit files, run build commands, execute tests, and commit results without ever touching your local machine. 

Each Codex task you launch (“Write unit tests”, “Fix the failing build”, etc.) runs in its own fresh copy of that environment and cannot see the public Internet.

---

### 1. Prerequisites

| Requirement                                                                                | Reason                                                                                    |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| ChatGPT **Pro, Enterprise, or Team** subscription                                          | Codex is still a research preview for these tiers. ([theverge.com][2])                    |
| GitHub account with **admin rights** to at least one repository                            | You must authorize the ChatGPT GitHub Connector during onboarding. ([help.openai.com][3]) |
| (Enterprise only) Workspace owner must toggle **Manage-Workspace → Settings → Codex → ON** | Enables the Codex UI for everyone in the org. ([help.openai.com][3])                      |

---

### 2. One-time GitHub connector setup

1. In ChatGPT’s left sidebar, click **Codex → Get Started**.
2. Select **Connect to GitHub**.

    * Authorize the *ChatGPT GitHub Connector* OAuth application.
    * Choose the installation target (typically your organization).
    * Grant access to the repositories you want Codex to work on. ([help.openai.com][3])
3. Wait a few seconds—Codex now sees the repo list that you permitted.

---

### 3. Create a new Codex environment

1. In your browser go to https://chatgpt.com/codex/settings/environments. 
2. click **Create Environment**.
3. enter the following information for the new environment.

#### 1. Basic

The **Basic** section defines repository-level metadata and workspace settings:

* **GitHub organization:** Select a GitHub Account that you have connected to CodeX.
* **Repository**: Select one private or public GitHub repository to work with. The selected GitHub repository is cloned into `/workspace/<your-project-name>`.
* **Name**: Enter a name for the environment.
* **Description**: Enter a description of the environment.

#### 2. Code Execution

This section governs how your code runs inside the Codex environment:

* **Container Image**: [`openai/codex-universal`](https://github.com/openai/codex-universal) — Ubuntu 24.04-based container with pre-installed language runtimes. Universal is the only selection. Click on Pre-installed packages to select versions of packages.

  Universal Container image pre-installed packages:

   * Python 3.12
   * Node.js 20
   * Ruby 3.4.4
   * Rust 1.87.0
   * Go 1.23.8
   * Bun 1.2.14
   * Java 21
   * Swift 6.1

* **Environment Variables:** Add key and value for each environment variable you want to add to the container's environment.

* **Secrets:** Add key and value for each secret you want to add to the container's environment.

* **Setup script:** The setup script is run at the start of every task, after the repo is cloned. Network access is always enabled for this step.

* **Agent internet access:** By default internet access is disabled after the setup script is executed. The Codex container will only be able to use the dependencies installed in the Universal Container image and the packages installed by the setup script. You can override this by turning internet access on so that your tasks can access the internet.

* **Domain allow list:** Select "none", "Common dependencies", or "All (unrestricted)".

   1. **Additional allowed domains:** Enter domains, separated by commas.
   2. **Allowed HTTP Methods:** Select "All Methods" or "GET, HEAD, and OPTIONS".

* **Terminal Window**: An interactive terminal is connected to the container.

### Setup script

This script installs node dependencies, installs and inits terraform, and installs TFLint.  Copy this into the **Setup script** textarea in the Code execution section.

```bash
#!/usr/bin/env bash
set -euo pipefail

# Ensure custom bin directory is first in PATH
export PATH="$HOME/bin:$PATH"

###############################################################################
# Node.js dependencies                                                       ###
###############################################################################
echo "Installing Node.js dependencies (npm install)"
npm install --no-audit --fund=false

###############################################################################
# Terraform                                                                  ###
###############################################################################
if ! command -v terraform >/dev/null 2>&1; then
  T_VERSION="1.8.5"
  TMP_DIR=$(mktemp -d)
  echo "Installing Terraform ${T_VERSION}"
  curl -fsSL -o "$TMP_DIR/terraform.zip" \
       "https://releases.hashicorp.com/terraform/${T_VERSION}/terraform_${T_VERSION}_linux_amd64.zip"
  unzip -q "$TMP_DIR/terraform.zip" -d "$TMP_DIR"
  mkdir -p "$HOME/bin"
  install -m 0755 "$TMP_DIR/terraform" "$HOME/bin/terraform"
  rm -rf "$TMP_DIR"
fi

###############################################################################
# TFLint (Terraform linter)                                                  ###
###############################################################################
if ! command -v tflint >/dev/null 2>&1; then
  TFLINT_VERSION="v0.58.0"   # latest as of May 24 2025
  OS="$(uname | tr '[:upper:]' '[:lower:]')"
  ARCH="$(uname -m)"
  case "$ARCH" in
    x86_64) ARCH="amd64" ;;
    aarch64|arm64) ARCH="arm64" ;;
    *) echo "Unsupported architecture: $ARCH" && exit 1 ;;
  esac

  TMP_DIR=$(mktemp -d)
  echo "Installing TFLint ${TFLINT_VERSION}"
  curl -fsSL -o "$TMP_DIR/tflint.zip" \
       "https://github.com/terraform-linters/tflint/releases/download/${TFLINT_VERSION}/tflint_${OS}_${ARCH}.zip"
  unzip -q "$TMP_DIR/tflint.zip" -d "$TMP_DIR"
  mkdir -p "$HOME/bin"
  install -m 0755 "$TMP_DIR/tflint" "$HOME/bin/tflint"
  rm -rf "$TMP_DIR"
fi

###############################################################################
# Terraform project initialization                                           ###
###############################################################################
if [ -d "iac" ]; then
  echo "Running terraform init in $(pwd)/iac"
  (
    cd iac
    terraform init -input=false
  )
else
  echo "Directory iac not found; skipping terraform init."
fi

echo "Setup complete."

```