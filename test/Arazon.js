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
    console.log(deployer,buyer) 
    //deploy contract
    const Arazon = await ethers.getContractFactory('Arazon')
    arazon = await Arazon.deploy()


  })

  describe("Deployment", ()=>{

    it('has a name', async ()=>{

      const name = await arazon.name()
      expect(name).to.equal("Arazon")
    })

  })



})
