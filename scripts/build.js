const {minify} = require("terser");
const {writeFileSync, readdirSync, statSync, readFileSync} = require("fs");
const {join} = require("path");
const exec = require("child_process").exec;

function getAllFiles(dirPath, arrayOfFiles) {
  const cwd = process.cwd();
  let files = readdirSync(join(cwd, dirPath));

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (statSync(`${dirPath}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(join(cwd, dirPath, "/", file));
    }
  });

  return arrayOfFiles.filter((path) => path.match(/\.js$/));
}

function minifyFiles(filePaths) {
  filePaths.forEach(async (filePath) => {
    writeFileSync(
      filePath,
      (await minify(readFileSync(filePath, "utf8"))).code,
    );
  });
}

exec("tsc", () => {
  console.log("tsc: done");
  const files = getAllFiles("dist");
  // console.log(files);
  minifyFiles(files);
});
