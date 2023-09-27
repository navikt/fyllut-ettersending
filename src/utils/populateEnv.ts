const fs = require("fs");
const yaml = require("js-yaml");

interface NaisConfig {
  env: {
    name: string;
    value: string;
  }[];
}

// Environment is provided as a command-line argument
const environment = process.argv[2];

if (!environment) {
  console.error("Please provide the path to the YAML file as a command-line argument.");
  process.exit(1);
}

// Read the YAML file
const yamlData = fs.readFileSync(`.nais/${environment}.yaml`, "utf8");

try {
  const parsedYaml = yaml.load(yamlData) as NaisConfig;

  if (parsedYaml && parsedYaml.env) {
    const envFileContent: string[] = [];

    // Add the environment variables from the YAML file
    for (const envVar of parsedYaml.env) {
      if (envVar.name && envVar.value) {
        envFileContent.push(`${envVar.name}=${envVar.value}`);
      }
    }

    // Add the environment variables from the .env.ci file
    const envContent = fs.readFileSync(`.env.ci.${environment}`, "utf8");
    envFileContent.push(envContent);

    // Write the environment variables to .env
    fs.writeFileSync(".env", envFileContent.join("\n"));
    console.log(".env file has been updated with environment variables.");
  } else {
    console.error('No "env" section found in the YAML file.');
  }
} catch (error) {
  console.error("Error parsing YAML file:", error);
}
