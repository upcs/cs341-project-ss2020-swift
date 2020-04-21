var handler = require('../routes/imports/apiHandler');

var firstTestId = 2;
var firstIdSting = '2';
var secondTestId = 9;
var secondIdString = '9';

const EXTRA_DATA_FIELDS = ["stat_id", "invert_flag", "stat_name_short", "units"];
const DATA_SIZE = 50 + EXTRA_DATA_FIELDS.length;

//tests for parseDataURL() function ------------------------------------
describe('parseDataURL', () => {
  test('exists', () => {
    expect(handler).toHaveProperty('parseDataURL');
  });

  //note that queries handle data in terms of stat_id, a number
  test('single category', () => {
    expect(handler.parseDataURL({cat: firstIdSting})).toEqual([firstTestId]);
  });

  test('multiple categories', () => {
    expect(handler.parseDataURL({cat:[firstIdSting, secondIdString]})).toEqual([firstTestId, secondTestId]);
  });

  test('no categories', () => {
    expect(handler.parseDataURL({})).toBeUndefined();
  });
});

//tests for getData() function ----------------------------------------
describe('getData', () => {
  test('exists', () => {
    expect(handler).toHaveProperty('getData');
  });

  test('one good category', (done) => {
    function callback(data){

      try {

        //confirm that the stat_id that was returned was the number expected
        expect(data[0].stat_id).toBe(firstTestId);

        //check size of dictionary returned; should be 53
        expect(Object.keys(data[0]).length).toBe(DATA_SIZE);
        expect(Object.keys(data[0])).toEqual(expect.arrayContaining(EXTRA_DATA_FIELDS));

        //check the value of just one state
        //expect(data[0]["NV"]).toBe(61864);

        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getData([firstTestId], callback);
  });

 test('multiple good categories', (done) => {

    function callback(data){

      try {
        //confirm that both stat_ids that were returned were the number expected
        expect(data[0].stat_id).toBe(firstTestId);
        expect(data[1].stat_id).toBe(secondTestId);

        //check size of dictionary returned; should be 53
        expect(Object.keys(data[0]).length).toBe(DATA_SIZE);
        expect(Object.keys(data[1]).length).toBe(DATA_SIZE);
        expect(Object.keys(data[0])).toEqual(expect.arrayContaining(EXTRA_DATA_FIELDS));
        expect(Object.keys(data[1])).toEqual(expect.arrayContaining(EXTRA_DATA_FIELDS));

        //check the value of just one state
        expect(data[0]["NV"]).toBe(541.1);
        expect(data[1]["NV"]).toBe(3.4);

        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getData([secondTestId,firstTestId], callback);

  });

  test('one bad category', (done) => {

    function callback(data){

      try {

        //confirm that the data the was returned was undefined
        expect(data[0]).toBeUndefined();

        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getData([77], callback);
  });

  test('negative input', (done) => {

    function callback(data){

      try {

        //confirm that the data the was returned was undefined
        expect(data[0]).toBeUndefined();

        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getData([-1], callback);
  });

  test('extremely large input', (done) => {

    function callback(data){

      try {

        //confirm that the data the was returned was undefined
        expect(data[0]).toBeUndefined();

        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getData([3.125e77], callback);
  });

  test('thwarting sql injections', (done) => {

    function callback(data){

      try {

        //confirm that the data the was returned was undefined
        expect(data[0]).toBeUndefined();

        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getData(["0=0"], callback);
  });

  test('multiple bad categories', (done) => {

    function callback(data){

      try {

        console.log("DATAAAA: " + data);

        //confirm that both stat_ids that were returned were the number expected
        expect(data[0]).toBeUndefined();
        expect(data[1]).toBeUndefined();

        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getData([77,2020], callback);

  });

  test('good and bad categories', (done) => {

    function callback(data){

      try {
        //confirm that the db returned what it could and that we properly handle the undefineds that come back from the bad
        expect(data[0].stat_id).toBe(secondTestId);
        expect(data[1]).toBeUndefined();

        //check size of dictionary returned; should be 53
        expect(Object.keys(data[0]).length).toBe(DATA_SIZE);
        expect(Object.keys(data[0])).toEqual(expect.arrayContaining(EXTRA_DATA_FIELDS));

        //check the value of just one state
        expect(data[0]["NV"]).toBe(3.4);

        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getData([secondTestId,2020], callback);
  })

});

//tests for getMeta() function ------------------------------------
describe('getMeta', () => {
  test('exists', () => {
    expect(handler).toHaveProperty('getMeta');
  });

  test('validating data', (done) => {
    function callback(data){

      try {

        //check size of dictionary returned; should be the same as the number of statistics we have
        expect(Object.keys(data).length).toBe(10);

        //confirming that the data obtained for ome of the rows is correct
        let str = data[secondTestId].note.toString('utf-8');
        expect(str).toBe("n.a.");
        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getMeta(callback);
  });

});

//tests for getCats() frunction -----------------------------------
describe('getCats', () => {
  test('exists', () => {
    expect(handler).toHaveProperty('getCats');
  });

  test('validating data', (done) => {
    function callback(data){

      try {

        //check size of dictionary returned; should be the same as the number of statistics we have
        expect(Object.keys(data).length).toBe(10);

        //confirming that the data obtained for ome of the rows is correct
        expect(data[1].stat_id).toBe(firstTestId);
        expect(data[1].stat_name_short).toBe("Reported violent crime rate ");


        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getCats(callback);
  });

});
