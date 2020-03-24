var handler = require('../routes/imports/apiHandler');

var firstTestId = 2;
var firstIdSting = '2';
var secondTestId = 9;
var secondIdString = '9';

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
        expect(Object.keys(data[0]).length).toBe(53);

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
        expect(Object.keys(data[0]).length).toBe(53);
        expect(Object.keys(data[1]).length).toBe(53);

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
        expect(Object.keys(data[0]).length).toBe(53);

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
        //plus a row for headers
        expect(Object.keys(data).length).toBe(11);

        //confirming that the data obtained for ome of the rows is correct
        let str = String.fromCharCode.apply(null, data[secondTestId].note);
        expect(str).toBe("Nonfarm jobs. Change in annual averages, not seasonally adjusted.");

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
        //plus a row for headers
        expect(Object.keys(data).length).toBe(10);

        //confirming that the data obtained for ome of the rows is correct
        expect(data[1].stat_id).toBe(firstTestId);  //will need to fix after 
        expect(data[1].stat_name_short).toBe("Reported violent crime rate ");  //will need to fix after 


        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getCats(callback);
  });

});
