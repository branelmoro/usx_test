const chai = require("chai");
const sinon = require("sinon");
chai.use(require("sinon-chai"));
const expect = chai.expect;

const FSM = require("../../src/finite-state-machine/fsm");

describe("Finite-State-Machine Tests", function() {

	it("should add trade to all available intervals", function() {
		const addStockTrade = sinon.spy();
		const tradeData = { sdada: "23e13" };
		const fsm = new FSM({});
		fsm.intervalHandlers = {
			10: {
				addStockTrade: addStockTrade
			},
			20: {
				addStockTrade: addStockTrade
			},
			30: {
				addStockTrade: addStockTrade
			}
		}
		fsm.processTrade(tradeData);

		sinon.assert.callCount(addStockTrade, 3);
		expect(addStockTrade.callCount).to.equal(3);
		expect(addStockTrade).to.have.callCount(3);

		sinon.assert.calledWith(addStockTrade, tradeData);
		expect(addStockTrade.calledWith(tradeData)).to.be.ok;
		expect(addStockTrade).to.have.been.calledWith(tradeData);

		sinon.assert.alwaysCalledWith(addStockTrade, tradeData);
		expect(addStockTrade.alwaysCalledWith(tradeData)).to.be.ok;
		expect(addStockTrade).to.always.have.been.calledWith(tradeData);
		
	});
});
