const expect = require("chai").expect;
const TradeFetcher = require("../src/tradeFetcher");

describe("Trade Fetcher Tests", function() {

	it("fetched new trade from file", function() {
		const fetcher = new TradeFetcher();
		let trade = fetcher.fetchNew();
		expect(trade).to.be.not.null;
		trade = fetcher.fetchNew();
		expect(trade).to.be.not.null;
		fetcher.close();
	});

	it("fetcher returns false once closed", function() {
		const fetcher = new TradeFetcher();
		fetcher.close();
		const trade = fetcher.fetchNew();
		expect(trade).to.be.false;
	});

});