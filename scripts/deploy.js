const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1. ArcadeToken deploy
  console.log("\n📦 Deploying ArcadeToken...");
  const ArcadeToken = await hre.ethers.getContractFactory("ArcadeToken");
  const arcadeToken = await ArcadeToken.deploy(deployer.address);
  await arcadeToken.waitForDeployment();
  const arcadeTokenAddress = await arcadeToken.getAddress();
  console.log("✅ ArcadeToken:", arcadeTokenAddress);

  // 2. Leaderboard deploy
  console.log("\n📦 Deploying Leaderboard...");
  const Leaderboard = await hre.ethers.getContractFactory("Leaderboard");
  const leaderboard = await Leaderboard.deploy(deployer.address);
  await leaderboard.waitForDeployment();
  const leaderboardAddress = await leaderboard.getAddress();
  console.log("✅ Leaderboard:", leaderboardAddress);

  // 3. Platform deploy
  console.log("\n📦 Deploying Platform...");
  const Platform = await hre.ethers.getContractFactory("Platform");
  const platform = await Platform.deploy(
    deployer.address,
    arcadeTokenAddress,
    leaderboardAddress
  );
  await platform.waitForDeployment();
  const platformAddress = await platform.getAddress();
  console.log("✅ Platform:", platformAddress);

  // 4. Roles setup
  console.log("\n⚙️ Setting up roles...");
  
  // Platform ko ArcadeToken ka PLATFORM_ROLE do
  const PLATFORM_ROLE = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes("PLATFORM_ROLE")
  );
  await arcadeToken.grantRole(PLATFORM_ROLE, platformAddress);
  console.log("✅ PLATFORM_ROLE granted to Platform");

  // Platform ko Leaderboard ka OPERATOR_ROLE do
  const OPERATOR_ROLE = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes("OPERATOR_ROLE")
  );
  await leaderboard.grantRole(OPERATOR_ROLE, platformAddress);
  console.log("✅ OPERATOR_ROLE granted to Platform");

  // 5. Contract addresses save karo
  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("================================");
  console.log("ArcadeToken:", arcadeTokenAddress);
  console.log("Leaderboard:", leaderboardAddress);
  console.log("Platform:   ", platformAddress);
  console.log("================================");
  console.log("\n📝 .env mein save karo:");
  console.log(`VITE_ARCADE_TOKEN_ADDRESS=${arcadeTokenAddress}`);
  console.log(`VITE_LEADERBOARD_ADDRESS=${leaderboardAddress}`);
  console.log(`VITE_PLATFORM_ADDRESS=${platformAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});