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

Module.register("MMM-Chart", {
    defaults: {
        width: 200,
        height: 200,
        chartFiles: [] // array of JSON file paths, e.g. ["modules/MMM-Chart/chart1.json", "modules/MMM-Chart/chart2.json"]
    },

    getScripts() {
        return [`modules/${this.name}/node_modules/chart.js/dist/chart.umd.js`];
    },

    start() {
        Log.info(`Starting module: ${this.name}`);

        this.charts = [];
        this.chartConfigs = [];
        this.loaded = false;

        // Load JSON chart configs
        this.config.chartFiles.forEach((file, index) => {
            this.loadFile(file, (response) => {
                try {
                    const jsonConfig = JSON.parse(response);
                    this.chartConfigs[index] = jsonConfig;
                    if (this.chartConfigs.filter(Boolean).length === this.config.chartFiles.length) {
                        this.loaded = true;
                        this.updateDom();
                    }
                } catch (e) {
                    Log.error(`${this.name}: Failed to parse JSON from ${file}`, e);
                }
            });
        });
    },

    loadFile(file, callback) {
        const xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open("GET", file, true);
        xobj.onreadystatechange = () => {
            if (xobj.readyState === 4 && xobj.status === 200) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
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

            // Initialize chart.js
            if (!this.charts[i]) {
                this.charts[i] = new Chart(chartEl.getContext("2d"), cfg);
            }
        });

        return wrapperEl;
    }
});
