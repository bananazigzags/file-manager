import { cpus, EOL, homedir, userInfo, arch } from "node:os";
import { OS_COMMAND_OPTIONS_MSG } from "./constants.js";

const getCpuInfoOutput = (info) => {
  const cpuNum = info.length;
  let cpuInfo = "";
  info.forEach((cpu, idx) => {
    const modelInfo = cpu.model.split("@");
    const model = modelInfo[0].trim();
    const clockRate = modelInfo[1].trim();
    cpuInfo += `CPU${idx + 1}: model is ${model}, clock rate is ${clockRate}\n`;
  });
  return `There are ${cpuNum} CPUs.\n${cpuInfo}`;
};

export const os = async (command) => {
  switch (command) {
    case "EOL":
      const eol = JSON.stringify(EOL);
      return `Default system end-of-line is ${eol}`;
    case "cpus":
      const cpuInfo = cpus();
      return getCpuInfoOutput(cpuInfo);
    case "homedir":
      const homeDir = homedir();
      return `Home directory is ${homeDir}`;
    case "username":
      const name = userInfo().username;
      return `Current system username is ${name}`;
    case "architecture":
      const archInfo = arch();
      return `CPU architecture for which Node.js binary has compiled is ${archInfo}`;
    default:
      return OS_COMMAND_OPTIONS_MSG;
  }
};
