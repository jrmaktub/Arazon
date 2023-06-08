const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

//global constants for listing item
const ID = 1
const NAME = 'Shoes'
const CATEGORY = "Clothing"
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
const COST = tokens(1)
const RATING = 4
const STOCK = 5


describe("Arazon", () => {

  let arazon
  let deployer, buyer

  beforeEach(async () => {
    //setup Accounts
    [deployer, buyer] = await ethers.getSigners()

    //deploy contract
    const Arazon = await ethers.getContractFactory('Arazon')
    arazon = await Arazon.deploy()

  })

  describe("Deployment", () => {

    it("Sets the owner", async () => {
      expect(await arazon.owner()).to.equal(deployer.address)
    })

  })

  describe("Listing", () => {
    let transaction

    beforeEach(async () => {
      //List an item
      transaction = await arazon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

    })

    it("Returns item attributes", async () => {
      const item = await arazon.items(1)

      expect(item.id).to.equal(ID)
      expect(item.name).to.equal(NAME)
      expect(item.category).to.equal(CATEGORY)
      expect(item.image).to.equal(IMAGE)
      expect(item.cost).to.equal(COST)
      expect(item.rating).to.equal(RATING)
      expect(item.stock).to.equal(STOCK)
    })

    it("Emits List event", () => {
      expect(transaction).to.emit(arazon, "List")
    })

  })

  //buy an item
  //ID is the required argument, curly braces are function-metadata. Cost is the value being sent
  describe("Buying", () => {
    let transaction

    beforeEach(async () => {
      // List a item
      transaction = await arazon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      // Buy a item
      transaction = await arazon.connect(buyer).buy(ID, { value: COST })
      await transaction.wait()
    })

    it("Updates buyer's order count", async () => {
      const result = await arazon.OrderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("Adds the order", async () => {
      const order = await arazon.orders(buyer.address, 1)

      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(NAME)
    })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(arazon.address)
      expect(result).to.equal(COST)
    })

    it("Emits Buy Event", () => {
      expect(transaction).to.emit(arazon, "Buy")
    })

  })

  describe("Withdrawing", () => {
    let balanceBefore

    beforeEach(async () => {
      // List a item
      let transaction = await arazon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      // Buy a item
      transaction = await arazon.connect(buyer).buy(ID, { value: COST })
      await transaction.wait()

      // Get Deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      // Withdraw
      transaction = await arazon.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await ethers.provider.getBalance(arazon.address)
      expect(result).to.equal(0)
    })
  })

  // transaction = await arazon.connect(buyer).buy(ID, { value: COST })





})
