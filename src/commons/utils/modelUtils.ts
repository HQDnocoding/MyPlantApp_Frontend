
import { InferenceSession } from 'onnxruntime-react-native'


const loadModel = (pathModel?: string) => {
    const path = require('../../asset/model/onnx/onnx3_mbv4_md.onnx') || pathModel;

    return InferenceSession.create(path).then(
        (sesion) => { return sesion }
    ).catch((error) => { throw new Error('Không thể tải mô hình') });
}


export { loadModel }