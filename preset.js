function managerEntries(entry = [], options) {
  return [...entry, require.resolve("./dist/register")];
}

module.exports = { managerEntries };
