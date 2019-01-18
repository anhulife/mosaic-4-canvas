(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.mosaic4Canvas = factory());
}(this, function () { 'use strict';

  /**
   * 给图片打上马赛克
   *
   * @param {ImageData} sourceImageDataData 源图片数据
   * @param {Number} [blockSize=24] 马赛克块的尺寸，正整数
   * @returns {ImageData} 打完码之后的图片数据
   */
  function mosaic(sourceImageData, blockSize) {
    if (blockSize === undefined) {
      blockSize = 24;
    }
    
    var width = sourceImageData.width;
    var height = sourceImageData.height;

    var mosaicImageData = new ImageData(width, height);

    var blockYMax = Math.ceil(height / blockSize);
    var blockXMax = Math.ceil(width / blockSize);

    // 以马赛克方块（尺寸由 blockSize 定）切割整个图片，然后遍历行和列。
    // blockX 和 blockY 分别是横和纵坐标（从图片的左上起始）
    for (var blockY = 0; blockY < blockYMax; blockY++) {
      // 方块里的像素起始坐标
      var pixStartY = blockY * blockSize;

      for (var blockX = 0; blockX < blockXMax; blockX++) {
        // 方块里的像素起始坐标
        var pixStartX = blockX * blockSize;

        // 方块中像素点的 ImageData 索引
        var pixImageDataIndexs = [];

        // 遍历方块中的像素点，计算出 RGB 的平均值
        var sumRed, sumGreen, sumBlue, sumAlpha;
        sumRed = sumGreen = sumBlue = sumAlpha = 0;

        // 遍历方块中的像素点，并获取 ImageData 索引
        for (var pixYInBlock = 0; pixYInBlock < blockSize; pixYInBlock++) {
          // 获取像素在图片中的实际坐标
          var pixY = pixStartY + pixYInBlock;

          // 如果超出限制了，就直接跳过
          if (pixY >= height) {
            break;
          }

          // 像素在数组中的逻辑索引起始值
          var pixIndexStart = pixY * width;

          for (var pixXInBlock = 0; pixXInBlock < blockSize; pixXInBlock++) {
            // 获取像素在图片中的实际坐标
            var pixX = pixStartX + pixXInBlock;

            // 判断像素坐标是否超过图片尺寸，只有在图片里，才可以被使用
            if (pixX >= width) {
              break;
            }

            var pixImageDataIndex = (pixIndexStart + pixX) * 4;

            pixImageDataIndexs.push(pixImageDataIndex);

            // 累加马赛克块内的 RGBA 值
            sumRed += sourceImageData.data[pixImageDataIndex++];
            sumGreen += sourceImageData.data[pixImageDataIndex++];
            sumBlue += sourceImageData.data[pixImageDataIndex++];
            sumAlpha += sourceImageData.data[pixImageDataIndex];
          }
        }

        // 计算 RGBA 的平均值
        var blockPixCount = pixImageDataIndexs.length;
        var avgRed = sumRed / blockPixCount;
        var avgGreen = sumGreen / blockPixCount;
        var avgBlue = sumBlue / blockPixCount;
        var avgAlpha = sumAlpha / blockPixCount;

        // 回写 RGBA 的平均值
        for (var i = 0; i < blockPixCount; i++) {
          var pixImageDataIndex = pixImageDataIndexs[i];

          mosaicImageData.data[pixImageDataIndex++] = avgRed;
          mosaicImageData.data[pixImageDataIndex++] = avgGreen;
          mosaicImageData.data[pixImageDataIndex++] = avgBlue;
          mosaicImageData.data[pixImageDataIndex] = avgAlpha;
        }
      }
    }

    return mosaicImageData;
  }

  return mosaic;

}));
