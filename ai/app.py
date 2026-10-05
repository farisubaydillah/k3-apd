from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import time
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# Load model YOLOv8 APD detector
try:
    model = YOLO("model/best.pt")
    print("Memuat model custom: model/best.pt")
except Exception:
    print("Menggunakan model fallback YOLOv8n")
    model = YOLO("yolov8n.pt")

CLASS_MAPPING = {
    "helmet": "helmet",
    "hard_hat": "helmet",
    "vest": "vest",
    "safety_vest": "vest",
    "boots": "shoes",
    "safety_shoes": "shoes",
    "shoes": "shoes",
    "gloves": "gloves",
    "glasses": "glasses",
    "goggles": "glasses"
}

@app.route("/detect", methods=["POST"])
def detect():
    start_time = time.time()
    data = request.get_json()
    if not data or "image" not in data:
        return jsonify({"success": False, "error": "No image provided"}), 400

    try:
        img_str = data["image"]
        if "," in img_str:
            img_str = img_str.split(",")[1]

        img_bytes = base64.b64decode(img_str)
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        h, w, _ = img.shape

        results = model(img, conf=0.45)
        detections = []
        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                cls_name = model.names[cls_id].lower()
                conf = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                bbox = {
                    "x": round((x1 / w) * 100, 2),
                    "y": round((y1 / h) * 100, 2),
                    "width": round(((x2 - x1) / w) * 100, 2),
                    "height": round(((y2 - y1) / h) * 100, 2)
                }

                target_key = CLASS_MAPPING.get(cls_name, cls_name)
                detections.append({
                    "class": target_key,
                    "confidence": round(conf, 2),
                    "bbox": bbox
                })

        return jsonify({
            "success": True,
            "detections": detections,
            "modelUsed": "YOLOv8-K3-Architecture",
            "inferenceTimeMs": round((time.time() - start_time) * 1000, 2)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
