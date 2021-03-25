import { production } from "../config";
// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
import * as child_process from "child_process";
import * as util from "util";

const exec = util.promisify(child_process.exec);

// Most playgrounds are simple and can be started in one line
const get_playground_command = (id: string, type: string): string => {
  if (type === "dind") {
    if (production) {
      return `docker run --runtime=sysbox-runc -d --network project-calcifer_default --name=${id} --network-alias=${id} -e LETSENCRYPT_HOST=${id}.project-calcifer.ml -e VIRTUAL_HOST=${id}.project-calcifer.ml felixchen1998/calcifer-playground:dind`;
    } else {
      return `docker run --privileged -d --network project-calcifer_default --name=${id} --network-alias=${id} --env VIRTUAL_PATH=/${id} felixchen1998/calcifer-playground:dind`;
    }
  }
};

const start_kind_playground = async (id: string) => {
  // Kubectl container
  let command = `docker run --runtime=sysbox-runc -d --network project-calcifer_default --name=${id} --network-alias=${id} -e LETSENCRYPT_HOST=${id}.project-calcifer.ml -e VIRTUAL_HOST=${id}.project-calcifer.ml felixchen1998/calcifer-playground:kind`;
  await exec(command);
  // K8s cluster
  command = `./lib/kindbox create --num-workers=3 --net=project-calcifer_default ${id}_cluster`;
  await exec(command);
  // Copy config over
};

export const start_playground = async (
  id: string,
  type: string
): Promise<void> => {
  if (type === "kind") {
    // Kind clusers require extra setup
    start_kind_playground(id);
  } else {
    let command = get_playground_command(id, type);
    let { stdout, stderr } = await exec(command);
    // trim newline off..
    stdout = stdout.trim();
    console.log(
      `Created container with ID ${stdout}, with playground ID ${id}`
    );
  }
};

export const kill_container = async (id) => {
  let { stdout, stderr } = await exec(`docker kill ${id}`);
  return stderr;
};