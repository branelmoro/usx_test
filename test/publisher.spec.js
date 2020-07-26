const expect = require("chai").expect;
const Publisher = require("../src/publisher");

describe("Publisher Tests", function() {

	it("initializes publisher module with given intervals", function() {
		const intervals = [15, 30, 60, 120, 300];
		const s = new Publisher(intervals);
		const output = {
			'15': {},
			'30': {},
			'120': {},
			'60': {},
			'300': {}
		};
		expect(output).to.deep.equal(s.subscribers);
	});

	describe("Publisher Activities", function() {
		const intervals = [30, 60];
		const s = new Publisher(intervals);
		const sList = ["sda", "ada", "aefa", "sfa", "rhesra", "dgsd"];

		it("adds publisher to given bar interval and stock and return same subscribers", function() {
			sList.forEach((a) => {
				s.addSubscriber(a, 30, 'abc');
			});
			const subscribers = s.getSubscribers(30, "abc");
			expect(sList).to.deep.equal(subscribers);
		});

		it("removes publisher from given bar interval and stock and return remaining subscribers", function() {
			s.removeSubscriber("ada", 30, 'abc');
			s.removeSubscriber("rhesra", 30, 'abc');
			const subscribers = s.getSubscribers(30, "abc");
			expect(subscribers).have.same.members(["sda", "aefa", "dgsd", "sfa"]);
		});

	});

});
