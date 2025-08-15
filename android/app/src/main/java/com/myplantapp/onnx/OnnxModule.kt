package com.myplantapp.onnx

import ai.onnxruntime.OnnxTensor
import ai.onnxruntime.OrtEnvironment
import ai.onnxruntime.OrtSession
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.core.graphics.get
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.InputStream
import kotlin.math.exp
import kotlin.math.max

class OnnxModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    private var map = HashMap<Int, String>()
    private var env: OrtEnvironment? = null
    private var session: OrtSession? = null

    init {
        map.put(1, "ALgal");
        map.put(2, "Blight");
        map.put(3, "Colletotrichum");
        map.put(4, "Healthy");
        map.put(5, "Phomopsis");
        map.put(6, "Rhizoctonia");
        try {
            env = OrtEnvironment.getEnvironment()
            val modelBytes = loadModelFromAsset("model.onnx")
            session = env?.createSession(modelBytes)

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun getName(): String {
        return "OnnxModule"
    }

    @ReactMethod
    fun predict(imagePath: String, promise: Promise) {
        try {
            val bitmap = loadBitmapFromPath(imagePath)
            if (bitmap == null) {
                promise.reject("ERROR", "Could not load bitmap from $imagePath")
                return
            }
            val resized = Bitmap.createScaledBitmap(bitmap, 256, 256, true)
            val inputTensor = preprocessImage(resized)

            val tensor = OnnxTensor.createTensor(env, inputTensor)
            val inputs = mapOf("input" to tensor)

            val result = session?.run(inputs)
            val output = result?.get(0)?.value as Array<FloatArray>

            // Lấy class có giá trị cao nhất
            var maxIndex = 0
            val probabilities = applySoftMax(output[0])
            var maxValue=probabilities[0]
            for (i in 0 until  probabilities.size) {
                if (probabilities[i] > maxValue) {
                    maxValue = probabilities[i]
                    maxIndex = i
                }
            }

            val response = Arguments.createMap().apply {
                putString("predictedClass", map.get(maxIndex + 1))
                putDouble("confidence", maxValue.toDouble())
                putDouble("processingTimeMs", 0.0)
            }

            promise.resolve(response)


        } catch (e: Exception) {
            promise.reject("PREDICT_ERROR", e)
        }
    }

    private fun loadModelFromAsset(filename: String): ByteArray {
        val assetManager = reactContext.assets
        val inputStream: InputStream = assetManager.open(filename)
        val bytes = inputStream.readBytes()
        inputStream.close()
        return bytes
    }

    private fun loadBitmapFromPath(path: String): Bitmap? {
        var filePath = path
        if (filePath.startsWith("file://")) {
            filePath = filePath.removePrefix("file://")
        }
        return BitmapFactory.decodeFile(filePath)
    }

    private fun preprocessImage(bitmap: Bitmap): Array<Array<Array<FloatArray>>> {
        val width = bitmap.width
        val height = bitmap.height
        val tensor = Array(1) { Array(3) { Array(height) { FloatArray(width) } } }

        for (y in 0 until height) {
            for (x in 0 until width) {
                val pixel = bitmap[x, y]
                val r = (pixel shr 16 and 0xFF) / 255.0f
                val g = (pixel shr 8 and 0xFF) / 255.0f
                val b = (pixel and 0xFF) / 255.0f

                tensor[0][0][y][x] = r
                tensor[0][1][y][x] = g
                tensor[0][2][y][x] = b
            }
        }
        return tensor
    }

    private fun applySoftMax(output: FloatArray): FloatArray {
        val probabilities = FloatArray(output.size)
        var sum = 0.0f

        for (i in 0 until output.size) {
            probabilities[i] = exp(output[i].toDouble()).toFloat()
            sum += probabilities[i]
        }

        for (i in 0 until output.size) {
            probabilities[i] = probabilities[i] / sum
        }

        return probabilities

    }
}