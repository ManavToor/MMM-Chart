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
            const charts = [];

            payload.forEach((file) => {
                try {
                    let filePath = file;
                    if (!path.isAbsolute(file)) {
                        // resolve inside MMM-Chart folder
                        filePath = path.join(__dirname, file);
                    }

                    const data = fs.readFileSync(filePath, "utf8");
                    charts.push(JSON.parse(data));
                    console.log(`[${this.name}] Loaded chart config from ${file}`);
                } catch (err) {
                    console.error(`[${this.name}] Error reading file "${file}":`, err);
                }
            });

            console.log(`[${this.name}] Sending ${charts.length} configs to front-end`);
            this.sendSocketNotification("CHART_DATA", charts);
        }
    }
});
