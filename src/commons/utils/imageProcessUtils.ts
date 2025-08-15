
// import ImageResizer from '@bam.tech/react-native-image-resizer'



// const resizeImage = (uri?: string, size?: number) => {
//     ImageResizer.createResizedImage(
//         uri || '', size || 256, size || 256, 'JPEG', 100, 0, 'MyPlantApp/asset/image/temp'
//     ).then((response) => {
//         return response;
//     }).catch((error) => { throw new Error('Could not process this image!') })

// };


// const getPixelDataCanvas = async (uri: string): Promise<number[]> => {
//     try {
//         // Đọc dimensions từ resized image
//         const imageInfo = await RNFS.stat(uri);

//         // Tạo canvas với kích thước ảnh
//         const canvas = new Canvas(256, 256); // size cố định sau resize
//         const ctx = canvas.getContext('2d');

//         // Load image
//         const image = new CanvasImage(canvas);
//         image.src = uri;

//         await new Promise((resolve) => {
//             image.addEventListener('load', resolve);
//         });

//         // Vẽ lên canvas
//         ctx.drawImage(image, 0, 0, 256, 256);

//         // Lấy pixel data (RGBA format)
//         const imageData = ctx.getImageData(0, 0, 256, 256);
//         const pixelArray = Array.from(imageData.data);

//         // Chuyển RGBA -> RGB (bỏ alpha channel)
//         const rgbArray = [];
//         for (let i = 0; i < pixelArray.length; i += 4) {
//             rgbArray.push(pixelArray[i]);     // R
//             rgbArray.push(pixelArray[i + 1]); // G
//             rgbArray.push(pixelArray[i + 2]); // B
//             // Skip alpha: pixelArray[i + 3]
//         }

//         return rgbArray;

//     } catch (error) {
//         throw new Error(`Failed to get pixel data: ${error.message}`);
//     }
// };

// export { resizeImage }