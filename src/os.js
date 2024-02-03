import { cpus, EOL, homedir, userInfo, arch } from "node:os";
import { OS_COMMAND_OPTIONS_MSG } from "./constants.js";

const getCpuInfoOutput = (info) => {
  const cpuNum = info.length;
  let cpuInfo = "";
  info.forEach((cpu, idx) => {
    cpuInfo += `CPU${idx + 1}: model is ${cpu.model}, clock rate is ${
      cpu.speed / 1000
    } GHz\n`;
  });
  return `There are ${cpuNum} CPUs.\n${cpuInfo}`;
};

const osHandlersMap = {
  EOL: () => `Default system end-of-line is ${JSON.stringify(EOL)}`,
  cpus: () => getCpuInfoOutput(cpus()),
  homedir: () => `Home directory is ${homedir()}`,
  username: () => `Current system username is ${userInfo().username}`,
  architecture: () => `CPU architecture for which Node.js binary has compiled is ${arch()}`,
}

export const os = (command) => osHandlersMap[command.slice(2)]?.() || OS_COMMAND_OPTIONS_MSG
