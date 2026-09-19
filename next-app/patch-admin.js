
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

            // 1. Content Cards & Sections
            content = content.replace(/bg-surface-secondary border border-border-secondary/g, "bg-white shadow-sm border border-gray-200");
            
            // 2. Input & Textarea Boxes
            content = content.replace(/bg-brand-black border border-border-secondary rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:border-brand-rose/g, "bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500");
            content = content.replace(/bg-brand-black border border-border-secondary rounded-lg px-3 py-2 text-white placeholder:text-text-muted focus:border-brand-rose/g, "bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500");
            
            // Also replace select boxes with appearance-none
            content = content.replace(/w-full bg-brand-black border border-border-secondary rounded-xl px-4 py-3 text-white appearance-none focus:border-brand-rose/g, "w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 appearance-none focus:border-blue-500");

            // 3. Typography & Labels
            content = content.replace(/text-3xl font-display font-bold text-white/g, "text-3xl font-display font-bold text-gray-900");
            content = content.replace(/text-lg font-semibold text-white/g, "text-lg font-semibold text-gray-900");
            content = content.replace(/text-sm font-medium text-text-secondary mb-1\.5/g, "text-sm font-medium text-gray-800 mb-1.5");
            content = content.replace(/text-text-muted text-sm/g, "text-gray-500 text-sm");
            
            // Other specific text colors
            content = content.replace(/text-text-muted hover:text-white/g, "text-gray-500 hover:text-gray-900");
            content = content.replace(/hover:bg-surface-secondary/g, "hover:bg-gray-100");
            content = content.replace(/bg-brand-black border border-border-secondary rounded-2xl/g, "bg-white shadow-sm border border-gray-200 rounded-2xl");

            // Variant list header row
            content = content.replace(/grid grid-cols-6 gap-4 text-sm font-medium text-text-muted mb-2/g, "grid grid-cols-6 gap-4 text-sm font-medium text-gray-600 mb-2");

            if (original !== content) {
                fs.writeFileSync(filePath, content, "utf8");
                console.log("Patched: " + filePath);
            }
        });
    }
});
console.log("Done");

