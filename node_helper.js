/* MagicMirror²
 * Node Helper: MMM-Chart
 */

const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting node_helper for module [" + this.name + "]");
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "LOAD_CHARTS") {
            const files = payload;
            const charts = [];

            files.forEach((file) => {
                try {
                    // If the file path is not absolute, resolve it inside this module folder
                    let filePath = file;
                    if (!path.isAbsolute(file)) {
                        filePath = path.join(__dirname, file);
                    }

                    const data = fs.readFileSync(filePath, "utf8");
                    charts.push(JSON.parse(data));
                } catch (err) {
                    console.error(`[${this.name}] Error reading file "${file}":`, err);
                }
            });

            // Always respond, even if empty, so the front-end unblocks
            this.sendSocketNotification("CHART_DATA", charts);
        }
    }
});
