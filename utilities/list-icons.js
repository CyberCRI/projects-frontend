#!/bin/env node

/* 
    Use this script to list all icon names from src/components/svgs/IconImage.vue
    then paste the output to  src/components/svgs/IconList.vue
    (in data's names array)
*/

const { exec } = require('child_process')

// TODO: use safe path separator for Windows users
var projectRoot = __dirname + '/../'

// TODO: use pure js instead of grep for Windows users
exec(`grep < ${projectRoot}src/components/svgs/IconImage.vue "name =="`, (err, stdout, stderr) => {
    if (err) {
        //some err occurred
        console.error(err)
    } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stderr: ${stderr}`)

        var iconNames = JSON.stringify(
            stdout
                .split('\n')
                .map((l) => l.substring(l.indexOf("== '") + "== '".length))
                .map((l) => l.substring(0, l.indexOf("'")))
                .filter((l) => l),
            null,
            4
        )
        console.log(iconNames)
    }
})
