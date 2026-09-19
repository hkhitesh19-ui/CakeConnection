
const fs = require("fs");
const path = require("path");

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            if (filePath.endsWith(".tsx")) {
                callback(filePath, stat);
            }
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

const targetDirs = [
    path.join(__dirname, "src/app/admin"),
    path.join(__dirname, "src/components/admin")
];

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        walkSync(dir, function(filePath) {
            let content = fs.readFileSync(filePath, "utf8");
            let original = content;

            // remaining inputs without placeholder:
            content = content.replace(/bg-brand-black border border-border-secondary rounded-xl px-4 py-3 text-white focus/g, "bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus");
            content = content.replace(/bg-brand-black border border-border-secondary rounded-xl px-4 py-3 text-white appearance-none focus/g, "bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 appearance-none focus");

            if (original !== content) {
                fs.writeFileSync(filePath, content, "utf8");
                console.log("Patched: " + filePath);
            }
        });
    }
});
console.log("Done");

