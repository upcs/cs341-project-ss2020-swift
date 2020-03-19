var handler = require('../routes/imports/apiHandler');

//tests for parseDataURL() function ------------------------------------
describe('parseDataURL', () => {
  test('exists', () => {
    expect(handler).toHaveProperty('parseDataURL');
  });

  //note that queries handle data in terms of stat_id, a number
  test('single category', () => {
    expect(handler.parseDataURL({cat: '66'})).toEqual([66]);
  });

  test('multiple categories', () => {
    expect(handler.parseDataURL({cat:['2', '66']})).toEqual([2, 66]);
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
        expect(data[0].stat_id).toBe(66);

        //check size of dictionary returned; should be 53
        expect(Object.keys(data[0]).length).toBe(53);

        //check the value of just one state
        expect(data[0]["NV"]).toBe(61864);

        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getData([66], callback);
  });

 test('multiple good categories', (done) => {

    function callback(data){

      try {
        //confirm that both stat_ids that were returned were the number expected
        expect(data[0].stat_id).toBe(2);
        expect(data[1].stat_id).toBe(66);

        //check size of dictionary returned; should be 53
        expect(Object.keys(data[0]).length).toBe(53);
        expect(Object.keys(data[1]).length).toBe(53);

        //check the value of just one state
        expect(data[0]["NV"]).toBe(49361);
        expect(data[1]["NV"]).toBe(61864);

        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getData([66,2], callback);

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
        expect(data[0].stat_id).toBe(66);
        expect(data[1]).toBeUndefined();

        //check size of dictionary returned; should be 53
        expect(Object.keys(data[0]).length).toBe(53);

        //check the value of just one state
        expect(data[0]["NV"]).toBe(61864);

        done();
      } catch (error) {
        done(error);
      }
    }
    handler.getData([66,2020], callback);
  })

});
