/* global Chart Log Module */

/* MagicMirror²
 * Module: MMM-Chart
 *
 * By Evghenii Marinescu https://github.com/evghenix/
 * MIT Licensed.
 */

/* global Chart Log Module */

/* MagicMirror²
 * Module: MMM-Chart
 *
 * By Evghenii Marinescu https://github.com/evghenix/
 * Modified by ChatGPT
 * MIT Licensed.
 */

/* global Chart Log Module */

/* MagicMirror²
 * Module: MMM-Chart
 *
 * By Evghenii Marinescu
 * Modified to support multiple JSON chart configs
 * MIT Licensed.
 */

Module.register("MMM-Chart", {
    defaults: {
        width: 200,
        height: 200,
        chartFiles: [] // example: ["modules/MMM-Chart/chart1.json", "modules/MMM-Chart/chart2.json"]
    },

    getScripts() {
        return [`modules/${this.name}/node_modules/chart.js/dist/chart.umd.js`];
    },

    start() {
        Log.info(`Starting module: ${this.name}`);

        this.charts = [];
        this.chartConfigs = [];
        this.loaded = false;

        // Ask node_helper to read the chart files
        this.sendSocketNotification("LOAD_CHARTS", this.config.chartFiles);
    },

    socketNotificationReceived(notification, payload) {
    if (notification === "CHART_DATA") {
        console.log("MMM-Chart received CHART_DATA", payload);
        this.chartConfigs = payload;
        this.loaded = true;
        this.updateDom();
    }
},

    getDom() {
        const wrapperEl = document.createElement("div");
        wrapperEl.style.display = "flex";
        wrapperEl.style.flexWrap = "wrap";
        wrapperEl.style.gap = "10px";

        if (!this.loaded) {
            wrapperEl.innerHTML = "Loading charts...";
            return wrapperEl;
        }

        this.chartConfigs.forEach((cfg, i) => {
            const chartWrapper = document.createElement("div");
            chartWrapper.style.position = "relative";
            chartWrapper.style.display = "inline-block";

            const chartEl = document.createElement("canvas");
            chartEl.width = this.config.width;
            chartEl.height = this.config.height;
            chartEl.style.display = "block";

            chartWrapper.appendChild(chartEl);
            wrapperEl.appendChild(chartWrapper);

            // Initialize chart.js if not already
            if (!this.charts[i]) {
                try {
                    this.charts[i] = new Chart(chartEl.getContext("2d"), cfg);
                } catch (err) {
                    Log.error(`${this.name}: Failed to load chart ${i}`, err);
                }
            }
        });

        return wrapperEl;
    }
});

