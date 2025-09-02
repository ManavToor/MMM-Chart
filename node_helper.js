/* MagicMirror²
 * Node Helper: MMM-Chart
 */

const NodeHelper = require("node_helper");
const fs = require("fs");

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
                    const data = fs.readFileSync(file, "utf8");
                    charts.push(JSON.parse(data));
                } catch (err) {
                    console.error(`[${this.name}] Error reading file ${file}:`, err);
                }
            });

            this.sendSocketNotification("CHART_DATA", charts);
        }
    }
});
