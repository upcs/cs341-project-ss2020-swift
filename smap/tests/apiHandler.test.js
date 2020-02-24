var handler = require('../routes/imports/apiHandler');

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

//TODO: Add mock function for DB query so crime_rate and salary are categories
describe('getData', () => {
  test('exists', () => {
    expect(handler).toHaveProperty('getData');
  });

  test('no categories', () => {
    expect(handler.getData([])).toEqual(undefined);
  });

  test('one good category', done => {
    let data = handler.getData([66], function(results){ 
      if(!results){
        next(createError(404));
        return;
      }

      // return contents, a object (dictionary) containing the key/value pairs of requested categories
      res.json(results);
      done();
    });
    expect(data).toHaveProperty('66');
    expect(data[66]).toHaveProperty('OR');
    expect(data[66]).toHaveProperty('NV');
  });

//  test('multiple good categories', () => {
//     let data = handler.getData(['crime_rate', 'salary']);
//     expect(data).toHaveProperty('crime_rate');
//     expect(data).toHaveProperty('salary');
//     expect(data.crime_rate).toHaveProperty('OR');
//     expect(data.salary).toHaveProperty('OR');
//     expect(data.crime_rate).toHaveProperty('NV');
//     expect(data.salary).toHaveProperty('NV');
//   });

//   test('one bad category', () => {
//     expect(handler.getData(['foo'])).toBeUndefined();
//   });

//   test('multiple bad categories', () => {
//     expect(handler.getData(['foo', 'bar'])).toBeUndefined();
//   });

//   test('good and bad categories', () => {
//     expect(handler.getDat a(['crime_rate', 'foo'])).toBeUndefined();
//     expect(handler.getData(['foo', 'crime_rate'])).toBeUndefined();
//   })
});
