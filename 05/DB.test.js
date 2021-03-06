import DB from './DB';

describe('insert method', () => {
  it('rejects when ID is not a number', async () => {
    const db = new DB;
    await expect(db.insert({ a: 1, id: 'notNum' })).rejects.toMatch('ID can be only number!')
  })
  it('rejects when ID is duplicated', async () => {
    const db = new DB;
    await db.insert({ a: 'unique id', id: 1 })
    await expect(db.insert({ a: 'duplicated id', id: 1 })).rejects.toMatch('ID can\'t be duplicated!')
  })
  it('if id not set add id: 1 for the first row added to DB', async () => {
    const db = new DB;
    await db.insert({ a: 'first row' });
    await expect(db._rows[0].id).toBe(1)
  })
  it('if id not set add one higher than previous id for the next id', async () => {
    const db = new DB;
    await db.insert({ a: 'last row', id: 2 });
    await db.insert({ b: 'new row' });
    await expect(db._rows[1].id - db._rows[0].id).toBe(1)
  })
})

describe('select method', () => {
  it('resolves row with given id', async () => {
    const db = new DB;
    const row = { a: 1, id: 1 }
    await db.insert(row)
    await expect(db.select(1)).resolves.toBe(row)
  })
  it('rejects when given id does not exist', async () => {
    const db = new DB;
    await expect(db.select(1)).rejects.toMatch('ID not found')
  })
})

describe('remove method', () => {
  it('rejects when id does not exist', async () => {
    const db = new DB;
    await expect(db.remove(1)).rejects.toMatch('Item not exist!')
  })
  it('resolves when id exists', async () => {
    const db = new DB;
    await db.insert({ a: 1, id: 1 })
    await expect(db.remove(1)).resolves.toBe('Item was removed!')
  })
  it('removes only one row when id exists', async () => {
    const db = new DB;
    await db.insert({ a: 1, id: 1 })
    await db.insert({ a: 2, id: 2 })
    await db.insert({ a: 3, id: 3 })
    await db.remove(1)
    await expect(db._rows.length).toBe(2)
  })
})

describe('update method', () => {
  it('rejects when id does not exist', async () => {
    const db = new DB;
    await db.insert({ a: 1, id: 1 })
    await expect(db.update({ a: 2, id: 2 })).rejects.toMatch('ID not found!')
  })
  it('rejects when id was not passed', async () => {
    const db = new DB;
    await db.insert({ a: 1, id: 1 })
    await expect(db.update({ a: 2 })).rejects.toMatch('ID have to be set!')
  })
  it('resolves when id exists', async () => {
    const db = new DB;
    const rowToEdit = { a: 1, id: 1 };
    const newRow = { a: 'updated', id: 1 };
    await db.insert(rowToEdit)
    await expect(db.update(newRow)).resolves.toEqual({ a: 'updated', id: 1 })
  })
})

describe('truncate method', () => {
  it('deletes all rows', async () => {
    const db = new DB;
    await db.insert({ a: 1, id: 1 })
    await db.insert({ a: 2, id: 2 })
    await db.insert({ a: 3, id: 3 })
    await db.truncate()
    await expect(db._rows.length).toBe(0)
  })
  it('resolves with true when rows are deleted', async () => {
    const db = new DB;
    await db.insert({ a: 1, id: 1 })
    await db.insert({ a: 2, id: 2 })
    await expect(db.truncate()).resolves.toBe(true)
  })
  it('rejects when _rows are already empty', async () => {
    const db = new DB;
    await expect(db.truncate()).rejects.toMatch('Nothing to remove')
  })
})

describe('getRows method', () => {
  it('resolves with empty array or arr of rows', async () => {
    const db = new DB;
    await expect(db.getRows()).resolves.toEqual([])
    await db.insert({ a: 1, id: 1 })
    await db.insert({ a: 2, id: 2 })
    await db.insert({ a: 3, id: 3 })
    await expect(db.getRows()).resolves.toEqual(
      [{ a: 1, id: 1 }, { a: 2, id: 2 }, { a: 3, id: 3 }]
    )
  })
})