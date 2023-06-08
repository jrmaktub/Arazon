// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const { items } = require("../src/items.json")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  //setup accounts
  const [deployer] = await ethers.getSigners()

  //deploy Arazon contract
  const Arazon = await hre.ethers.getContractFactory("Arazon")
  const arazon = await Arazon.deploy()
  await arazon.deployed()

  console.log(`Deployed Arazon Contract at: ${arazon.address}\n`)

  //list items...
  for (let i= 0; i < items.length; i++){
    const transaction = await arazon.connect(deployer).list(
      
    )
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
