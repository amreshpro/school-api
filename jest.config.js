/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest", // This tells Jest to use ts-jest for TypeScript files
  },
  moduleFileExtensions: ["ts", "js"], // Recognize these extensions
};
