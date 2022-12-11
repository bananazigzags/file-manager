export const getUsername = () => {
  const args = process.argv.slice(2);
  const userArg = args[0];
  return userArg.split("=")[1].trim();
};
