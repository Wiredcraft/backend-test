module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // transforma arquivos javascript
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
};
