class RenderGrid {
    constructor() {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;

        this.imageData = this.ctx.createImageData(
            this.ctx.canvas.width,
            this.ctx.canvas.height
        );

        // Iterate through every pixel
        let fillPixel = (x, y, color) => {
            let pixelNumber = (x + y * this.imageData.width) * 4;

            this.imageData.data[pixelNumber + 0] = color.r; // R value
            this.imageData.data[pixelNumber + 1] = color.g; // G value
            this.imageData.data[pixelNumber + 2] = color.b; // B value
            this.imageData.data[pixelNumber + 3] = color.a; // A value
        };

        let gridX = 0;
        let gridY = 0;

        let gridState = {
            colors: [
                [
                    { r: 20, g: 20, b: 20, a: 255 },
                    { r: 22, g: 22, b: 22, a: 255 },
                ],
                [
                    { r: 25, g: 25, b: 26, a: 255 },
                    { r: 27, g: 27, b: 28, a: 255 },
                ],
            ],
            switches: {
                initialSmall: 0,
                initialLarge: 0,
                currentSmall: 0,
                currentLarge: 0,
                counterSmallX: 0,
                counterLargeX: 0,
                counterSmallY: 0,
                counterLargeY: 0,
            },
            dimentions: {
                smallSquare: 50,
                largeSquare: 2,
            },
        };

        let incSmall = () => {
            gridState.switches.counterSmallX++;
            if (
                gridState.switches.counterSmallX >= gridState.dimentions.smallSquare
            ) {
                gridState.switches.counterSmallX = 0;
                gridState.switches.currentSmall = +!gridState.switches.currentSmall;
                incLarge();
            }
        };

        let incLarge = () => {
            gridState.switches.counterLargeX++;
            if (
                gridState.switches.counterLargeX >= gridState.dimentions.largeSquare
            ) {
                gridState.switches.counterLargeX = 0;
                gridState.switches.currentLarge = +!gridState.switches.currentLarge;
            }
        };

        let incIniSmall = () => {
            gridState.switches.counterSmallY++;
            if (
                gridState.switches.counterSmallY >= gridState.dimentions.smallSquare
            ) {
                gridState.switches.counterSmallY = 0;
                gridState.switches.initialSmall = +!gridState.switches.initialSmall;
                incIniLarge();
            }
        };

        let incIniLarge = () => {
            gridState.switches.counterLargeY++;
            if (
                gridState.switches.counterLargeY >= gridState.dimentions.largeSquare
            ) {
                gridState.switches.counterLargeY = 0;
                gridState.switches.initialLarge = +!gridState.switches.initialLarge;
            }
        };

        let newLine = () => {
            gridState.switches.currentSmall = gridState.switches.initialSmall;
            gridState.switches.counterSmallX = 0;
            gridState.switches.currentLarge = gridState.switches.initialLarge;
            gridState.switches.counterLargeX = 0;
        };

        while (gridY < this.imageData.height) {
            while (gridX < this.imageData.width) {
                fillPixel(
                    gridX,
                    gridY,
                    gridState.colors[gridState.switches.currentLarge][
                    gridState.switches.currentSmall
                    ]
                );
                incSmall();
                gridX++;
            }
            gridX = 0;
            gridY++;
            incIniSmall();
            newLine();
            let n = 2;
        }
    }

    show = () => {
        this.ctx.putImageData(this.imageData, 0, 0);
    };
}
