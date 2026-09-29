{
  description = "Blog dev shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/b6018f87da91d19d0ab4cf979885689b469cdd41";
    nixpkgs-unstable.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    nixpkgs-unstable,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      unstable = nixpkgs-unstable.legacyPackages.${system};
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          pre-commit
          nodejs
          pnpm_10
          unstable.wrangler
          go-task
          go
          playwright-driver.browsers
        ];

        PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
        PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";

        shellHook = ''
          for browser in \
            "$PLAYWRIGHT_BROWSERS_PATH"/chromium-*/chrome-linux/chrome \
            "$PLAYWRIGHT_BROWSERS_PATH"/chromium-*/chrome-linux64/chrome; do
            if [ -x "$browser" ]; then
              export PLAYWRIGHT_MCP_EXECUTABLE="$browser"
              break
            fi
          done
        '';
      };
    });
}
