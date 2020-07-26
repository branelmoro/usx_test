const chai = require("chai");
const sinon = require("sinon");
chai.use(require("sinon-chai"));
const expect = chai.expect;

const TradeHandler = require("../../src/finite-state-machine/tradeHandler");

describe("TradeHandler Tests", function() {

	it("adds new trade in interval bar of stock and publish bar data", function() {
		const stub = sinon.stub(TradeHandler.prototype, "setChangeBarTimer").callsFake(() => {});

		const trade = {
			"sym":"XZECXXBT",
			"P":0.01947,
			"Q":0.1,
			"TS2":1538409725339216503
		};

		const interval = 15;
		const publish = sinon.spy();

		const handler = new TradeHandler(interval, { publish: publish });
		handler.addStockTrade(trade);

		expect(publish).to.have.been.calledOnce;

		expect(publish).to.have.been.calledWith("XZECXXBT", interval, { bar_num: 1, c: 0, event: "ohlc_notify", h: 0.01947, l: 0.01947, o: 0.01947, symbol: "XZECXXBT", volume: 0.1 });

		stub.restore();

	});

	describe("Interval change Tests", function() {

		it("set timer to create new candle bars in all stocks after every interval", function() {
			const spy = sinon.spy(TradeHandler.prototype, 'changeInterval');
			const clock = sinon.useFakeTimers();

			const interval = 1;
			const handler = new TradeHandler(interval, {});

			clock.tick(interval * 1000);
			expect(spy).to.have.been.calledOnce;

			spy.restore();
			clock.restore();
		});

		it("creates new candle bars in all stocks and increaments bar count", function() {
			const spy = sinon.spy(TradeHandler.prototype, 'setChangeBarTimer');
			const clock = sinon.useFakeTimers();

			const trade = {
				"sym":"XZECXXBT",
				"P":0.01947,
				"Q":0.1,
				"TS2":1538409725339216503
			};
			const interval = 1;
			const publish = sinon.spy();
			const handler = new TradeHandler(interval, { publish: publish });
			handler.addStockTrade(trade);

			expect(publish).to.have.been.calledWith("XZECXXBT", interval, { bar_num: 1, c: 0, event: "ohlc_notify", h: 0.01947, l: 0.01947, o: 0.01947, symbol: "XZECXXBT", volume: 0.1 });

			handler.changeInterval();
			expect(spy).to.have.been.calledTwice;
			expect(handler.bar_num).to.be.equal(2);
			expect(publish).to.have.been.calledTwice;

			expect(publish).to.have.been.calledWith("XZECXXBT", interval, { bar_num: 1, c: 0.01947, event: "ohlc_notify", h: 0.01947, l: 0.01947, o: 0.01947, symbol: "XZECXXBT", volume: 0.1 });

			spy.restore();
			clock.restore();
		});

	});

});