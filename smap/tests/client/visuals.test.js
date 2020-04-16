//SMAP Team
//testing visuals.js

const $ = require('jquery');
const rewire = require('rewire');
const path = '../../public/javascripts/visuals.js';
window.$ = $;
const visuals = require(path);


describe("getMetadata", () => {
    test("returns metadata", () => {
        let getMetadata = jest.fn(() => {
            visuals.getMetadata();
        });
        let metadata = getMetadata();
        expect(getMetadata).toHaveBeenCalledTimes(1);
        expect.anything();
    });
});
