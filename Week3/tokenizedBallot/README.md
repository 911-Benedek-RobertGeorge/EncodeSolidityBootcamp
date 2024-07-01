# Run scripts

## For hardhat scripts without arguments:

(remove --network argument for local)

```bash
npx hardhat run ./scripts/<Script.ts> --network sepolia
```

## For scripts with arguments:

### For pure Viem script:

```bash
npx ts-node --files ./scripts/<Script.ts> args1 args2...
```

### For hardhat : Adding hardhat network:

```bash
HARDHAT_NETWORK=sepolia npx ts-node --files ./scripts/<Script.ts> args1 args2...
```

for windows users if you are using poweshell you should use $env:HARDHAT_NETWORK="sepolia"
