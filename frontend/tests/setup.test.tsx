/**
 * Basic test to verify Jest setup is working
 */
describe("Jest Setup", () => {
  it("should run tests", () => {
    expect(true).toBe(true);
  });

  it("should have access to testing utilities", () => {
    expect(expect).toBeDefined();
  });
});
