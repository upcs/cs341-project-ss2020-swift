var handler = require('../routes/imports/apiHandler');

describe('parseDataURL', () => {
  test('exists', () => {
    expect(handler).toHaveProperty('parseDataURL');
  });

  test('single category', () => {
    expect(handler.parseDataURL({cat:'foo'})).toEqual(['foo']);
  });

  test('multiple categories', () => {
    expect(handler.parseDataURL({cat:['foo', 'bar']})).toEqual(['foo', 'bar']);
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
    expect(handler.getData([])).toEqual({});
  });

  test('one good category', () => {
    let data = handler.getData(['crime_rate']);
    expect(data).toHaveProperty('crime_rate');
    expect(data.crime_rate).toHaveProperty('OR');
    expect(data.crime_rate).toHaveProperty('NV');
  });

  test('multiple good categories', () => {
    let data = handler.getData(['crime_rate', 'salary']);
    expect(data).toHaveProperty('crime_rate');
    expect(data).toHaveProperty('salary');
    expect(data.crime_rate).toHaveProperty('OR');
    expect(data.salary).toHaveProperty('OR');
  });

  test('one bad category', () => {
    expect(handler.getData(['foo'])).toBeUndefined();
  });

  test('multiple bad categories', () => {
    expect(handler.getData(['foo', 'bar'])).toBeUndefined();
  });

  test('good and bad categories', () => {
    expect(handler.getData(['crime_rate', 'foo'])).toBeUndefined();
    expect(handler.getData(['foo', 'crime_rate'])).toBeUndefined();
  })
});
