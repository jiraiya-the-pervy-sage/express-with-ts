const { execSync } = require('child_process');

const fs = require('fs');

const path = require('path');

const projectName = process.argv[2];

if (!projectName) {
    console.log("Please provide a name for your project.");
    process.exit(1);
}

console.log(`Creating a new Express project with TypeScript: ${projectName}`);

execSync(`mkdir ${projectName}`);

execSync(`npm init -y`, { cwd: `./${projectName}` });

async function createProject(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath);
        console.log(`Created project directory at ${projectPath}`);
    }

    const packageJsonPath = path.join(projectPath, 'package.json');
    let packageJson;

    if (fs.existsSync(packageJsonPath)) {
        const packageJsonRaw = fs.readFileSync(packageJsonPath);
        packageJson = JSON.parse(packageJsonRaw);
        packageJson.scripts = {
            ...packageJson.scripts,
            start: "ts-node server.ts"
        };
    } else {
        packageJson = {
            name: projectName,
            version: "1.0.0",
            scripts: {
                start: "ts-node server.ts"
            },
            dependencies: {},
            devDependencies: {}
        };
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('package.json created or updated with start script.');
}
execSync(`npm install express`, { cwd: `./${projectName}` });
execSync(`npm install --save-dev typescript @types/node @types/express ts-node nodemon`, { cwd: `./${projectName}` });



if (!projectName) {
    console.log('Please specify a project name.');
} else {
    await createProject(projectName);
}

const tsConfig = {
    compilerOptions: {
        target: "es6",
        module: "commonjs",
        rootDir: "./src",
        outDir: "./build",
        esModuleInterop: true,
        strict: true,
    },
    include: ["src/**/*"],
    exclude: ["node_modules"],
};

fs.writeFileSync(`${projectName}/tsconfig.json`, JSON.stringify(tsConfig, null, 2));

const srcDir = `${projectName}/src`;
fs.mkdirSync(srcDir);

const serverContent = `import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World with Express and TypeScript!'));

app.listen(PORT, () => {
  console.log(\`Server is running at http://localhost:\${PORT}\`);
});
`;

fs.writeFileSync(`${srcDir}/server.ts`, serverContent);

console.log(`Project ${projectName} is ready. Navigate into the project directory and run 'npm run dev' to start the server.`);
