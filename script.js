/*
 * Constants
 */

const Default = {
    initialZoom: 3,
    minZoom: 1.25,
    maxZoom: 4,
    zoomSpeed: 0.01
};

/*
 * Class definition
 */

class Zoomable {
    constructor(element, config) {
        this.element = element;
        this.config = this._mergeConfig(config);

        const { initialZoom, minZoom, maxZoom } = this.config;

        this.zoomed = false;
        this.initialZoom = Math.max(Math.min(initialZoom, maxZoom), minZoom);
        this.zoom = this.initialZoom;

        this.img = element.querySelector(".zoomable__img");
        this.img.draggable = false;
        this.element.style.setProperty("--zoom", this.initialZoom);

        this._addEventListeners();
    }

    static get Default() {
        return Default;
    }

    _addEventListeners() {
        this.element.addEventListener("mouseover", () =>
            this._handleMouseover()
        );
        this.element.addEventListener("mousemove", (evt) =>
            this._handleMousemove(evt)
        );
        this.element.addEventListener("mouseout", () => this._handleMouseout());
        this.element.addEventListener("wheel", (evt) => this._handleWheel(evt));

        this.element.addEventListener("touchstart", (evt) =>
            this._handleTouchstart(evt)
        );
        this.element.addEventListener("touchmove", (evt) =>
            this._handleTouchmove(evt)
        );
        this.element.addEventListener("touchend", () => this._handleTouchend());
    }

    _handleMouseover() {
        if (this.zoomed) {
            return;
        }

        this.element.classList.add("zoomable--zoomed");

        this.zoomed = true;
    }

    _handleMousemove(evt) {
        if (!this.zoomed) {
            return;
        }

        const elPos = this.element.getBoundingClientRect();

        const percentageX = `${
            ((evt.clientX - elPos.left) * 100) / elPos.width
        }%`;
        const percentageY = `${
            ((evt.clientY - elPos.top) * 100) / elPos.height
        }%`;

        this.element.style.setProperty("--zoom-pos-x", percentageX);
        this.element.style.setProperty("--zoom-pos-y", percentageY);
    }

    _handleMouseout() {
        if (!this.zoomed) {
            return;
        }

        this.element.style.setProperty("--zoom", this.initialZoom);
        this.element.classList.remove("zoomable--zoomed");

        this.zoomed = false;
    }

    _handleWheel(evt) {
        if (!this.zoomed) {
            return;
        }

        evt.preventDefault();

        const newZoom = this.zoom + evt.deltaY * (this.config.zoomSpeed * -1);
        const { minZoom, maxZoom } = this.config;

        this.zoom = Math.max(Math.min(newZoom, maxZoom), minZoom);
        this.element.style.setProperty("--zoom", this.zoom);
    }

    _handleTouchstart(evt) {
        evt.preventDefault();

        this._handleMouseover();
    }

    _handleTouchmove(evt) {
        if (!this.zoomed) {
            return;
        }

        const elPos = this.element.getBoundingClientRect();

        let percentageX =
            ((evt.touches[0].clientX - elPos.left) * 100) / elPos.width;
        let percentageY =
            ((evt.touches[0].clientY - elPos.top) * 100) / elPos.height;

        percentageX = Math.max(Math.min(percentageX, 100), 0);
        percentageY = Math.max(Math.min(percentageY, 100), 0);

        this.element.style.setProperty("--zoom-pos-x", `${percentageX}%`);
        this.element.style.setProperty("--zoom-pos-y", `${percentageY}%`);
    }

    _handleTouchend(evt) {
        this._handleMouseout();
    }

    _mergeConfig(config) {
        return {
            ...this.constructor.Default,
            ...(typeof config === "object" ? config : {})
        };
    }
}

/*
 * Implementation
 */

const zoomables = document.querySelectorAll(".zoomable");

for (const el of zoomables) {
    new Zoomable(el);
}