import fs from "fs";
import critical from "critical";
import inline from "inline-critical";
import csso from 'csso';

const BUILD_DIR = __dirname + '/../build/';

let injectCriticalCss = function () {
    critical.generate({
        base: BUILD_DIR,
        src: 'index.html',
        width: 400,
        height: 470,
        dimensions: [{
            height: 470,
            width: 400
        }, {
            height: 900,
            width: 1200
        }],
        dest: BUILD_DIR+'static/css/critical.css',
        minify: true,
        timeout: 30000,
        ignore: ['.mdl-layout__header'],
    }).then(criticalCss => {
        criticalCss = criticalCss.replace(/http:\/\//g, '//');

        const html = fs.readFileSync(BUILD_DIR+'index.html', 'utf8');
        const inlined = inline(html, criticalCss, {
            basePath: BUILD_DIR,
            minify: true,
            extract: true,
        });

        fs.readdir(BUILD_DIR+'static/css', {}, (error, files) => files.map(file => {
                if (! file.match(/\.css$/)) {
                    return;
                }

                const realPath = BUILD_DIR+'static/css/'+file;
                fs.readFile(realPath, {encoding:'utf-8'}, (error, content) => {
                    fs.writeFileSync(realPath, csso.minify(content).css);
                });
            })
        );

        fs.writeFileSync(BUILD_DIR + 'index.html', inlined);
    });
};

injectCriticalCss();