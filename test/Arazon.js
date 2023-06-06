const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Arazon", () => {

  let arazon
  let deployer
  let buyer

  beforeEach(async ()=>{
    //setup Accounts
    [deployer,buyer] = await ethers.getSigners()
    // console.log(deployer.address,buyer.address) 

    //deploy contract
    const Arazon = await ethers.getContractFactory('Arazon')
    arazon = await Arazon.deploy()


  })

  describe("Deployment", ()=>{

    it("Sets the owner", async ()=>{
      expect(await arazon.owner()).to.equal(deployer.address)
    })


  })



})
