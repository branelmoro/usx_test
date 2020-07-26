const expect = require("chai").expect;
const OHLC = require("../../src/finite-state-machine/ohlc_bar");

describe("OHLC Candle tests", function() {

	it("create new bar candle and sets all params to zero", function() {
		const bar = new OHLC();
		const data = bar.getData();
		const expectedOutput = { o: 0, h: 0, l: 0, c: 0, volume: 0 };
		expect(data).to.deep.equal(expectedOutput);
	});

	describe("OHLC Action tests", function() {

		const bar = new OHLC();

		it("adjust bar with new trade with higher price than previour high, adds volume", function() {
			bar.addNewTrade({ P:3, Q:3});
			let data = bar.getData();
			let expectedOutput = { o: 3, h: 3, l: 3, c: 0, volume: 3 };
			expect(data).to.deep.equal(expectedOutput);


			bar.addNewTrade({ P:5, Q:4});
			data = bar.getData();
			expectedOutput = { o: 3, h: 5, l: 3, c: 0, volume: 7 };
			expect(data).to.deep.equal(expectedOutput);
		});

		it("adjust bar with new trade with lower price than previour low", function() {
			bar.addNewTrade({ P:2, Q:1});
			let data = bar.getData();
			let expectedOutput = { o: 3, h: 5, l: 2, c: 0, volume: 8 };
			expect(data).to.deep.equal(expectedOutput);
		});

		it("closes trade price with last trade price", function() {
			bar.close();
			const data = bar.getData();
			let expectedOutput = { o: 3, h: 5, l: 2, c: 2, volume: 8 };
			expect(data).to.deep.equal(expectedOutput);
		});

		it("starts new candle with opening price as last close price and sets volume to zero", function() {
			bar.startNew();
			const data = bar.getData();
			const expectedOutput = { o: 2, h: 2, l: 2, c: 0, volume: 0 };
			expect(data).to.deep.equal(expectedOutput);
		});

	});

});