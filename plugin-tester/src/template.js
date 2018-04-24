const fs = require('fs')
const path = require('path')
const glob = require('glob')
const mustache = require('mustache')

const ignoredFiles = ['lib/template.html', 'lib/styles.css']

const ensureDirectoryExistence = filePath => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

const template = (templatePath, viewState, file) => {
    const content = fs.readFileSync(path.join(templatePath, file), "utf8")
    if (ignoredFiles.includes(file)) {
        return content
    } else {
        return mustache.render(content, viewState)
    }
}

const createTemplate = (name, customPluginPath) => {
    const viewState = {
        pluginName: name,
        pluginId: name.toLowerCase().replace(/\s+/g, '-')
    }

    const pluginPath = customPluginPath ? customPluginPath : path.join(process.cwd(), name)
    console.log("Creating plugin...", name, pluginPath);

    fs.mkdirSync(pluginPath)
    console.log("> mkdir ", pluginPath);
    const templatePath = path.join(__dirname, '../template')
    const options = {
        cwd: templatePath,
        nodir: true
    }
    const files = glob.sync('**/*', options)
    files.forEach( file => {
        const templatedContent = template(templatePath, viewState, file)
        const templatedFilePath = path.join(pluginPath, file)
        ensureDirectoryExistence(templatedFilePath)
        fs.writeFileSync(templatedFilePath, templatedContent)
        console.log("> created file ", templatedFilePath);
    })
    console.log("Creating plugin... done");
}


module.exports.createTemplate = createTemplate
