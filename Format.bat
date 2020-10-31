(call prettier --write "./**/*{.js,.css,.json}" 2>> .\FormatErrors.txt)
(call js-beautify -r --type="html" "./**/*.{htm,html}" 2>> .\FormatErrors.txt)