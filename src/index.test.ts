import hello from '.'

describe('Index', () => {
  it('should say hello to name passed', () => {
    expect(hello('Nana')).toBe('Hello Nana')
  })
})