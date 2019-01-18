## Install

```sh
$ npm install mosaic-4-canvas
```

## Usage

```javascript
import mosaic4Canvas from 'mosaic-4-canvas';


const context = canvas.getContext('2d');
const sourceImageData = context.getImageData(0, 0, canvas.width, canvas.height);

const mosaicImageData = mosaic4Canvas(sourceImageData);
context.putImageData(mosaicImageData, 0, 0);
```

