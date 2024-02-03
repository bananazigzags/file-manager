export const getUsername = () => {
  const args = process.argv.slice(2);
  const userArg = args[0];
  if (!userArg) {
    return "Anon";
  } else return userArg.split("=")[1].trim();
};
