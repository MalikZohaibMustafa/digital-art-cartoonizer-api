from flask import Flask, redirect, render_template, request, send_file, jsonify, url_for
from flask_cors import CORS
from PIL import Image
import numpy as np
import cv2
import io
from werkzeug.utils import secure_filename
from scipy import stats
from collections import defaultdict

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def update_c(C, hist):
    while True:
        groups = defaultdict(list)
        for i in range(len(hist)):
            if hist[i] == 0:
                continue
            d = np.abs(C - i)
            index = np.argmin(d)
            groups[index].append(i)

        new_C = np.array(C)
        for i, indice in groups.items():
            if np.sum(hist[indice]) == 0:
                continue
            new_C[i] = int(np.sum(indice * hist[indice]) / np.sum(hist[indice]))

        if np.sum(new_C - C) == 0:
            break
        C = new_C

    return C, groups

def K_histogram(hist):
    alpha = 0.001
    N = 80
    C = np.array([128])

    while True:
        C, groups = update_c(C, hist)
        new_C = set()
        for i, indice in groups.items():
            if len(indice) < N:
                new_C.add(C[i])
                continue

            z, pval = stats.normaltest(hist[indice])
            if pval < alpha:
                left = 0 if i == 0 else C[i - 1]
                right = len(hist) - 1 if i == len(C) - 1 else C[i + 1]
                delta = right - left
                if delta >= 3:
                    c1 = (C[i] + left) / 2
                    c2 = (C[i] + right) / 2
                    new_C.add(c1)
                    new_C.add(c2)
                else:
                    new_C.add(C[i])
            else:
                new_C.add(C[i])
        if len(new_C) == len(C):
            break
        else:
            C = np.array(sorted(new_C))
    return C

def cartoonize_image(img):
    # Apply bilateral filter with a larger diameter to maintain edge sharpness
    img_filtered = cv2.bilateralFilter(img, d=9, sigmaColor=75, sigmaSpace=75)
    img_gray = cv2.cvtColor(img_filtered, cv2.COLOR_RGB2GRAY)
    img_blur = cv2.medianBlur(img_gray, 7)

    # Enhanced edge detection
    edges = cv2.adaptiveThreshold(img_blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, blockSize=9, C=2)
    # Convert back to color so color drawing will work
    img_color = cv2.bilateralFilter(img, d=9, sigmaColor=75, sigmaSpace=75)
    # Combine edges and color
    cartoon = cv2.bitwise_and(img_color, img_color, mask=edges)

    return cartoon

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def upload_file():
    if 'img' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['img']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        image = Image.open(file.stream)
        img_np = np.array(image.convert('RGB'))
        output_image = cartoonize_image(img_np)  # Process the image
        img_pil = Image.fromarray(output_image)
        img_io = io.BytesIO()
        img_pil.save(img_io, 'JPEG', quality=85)
        img_io.seek(0)
        return send_file(img_io, mimetype='image/jpeg', as_attachment=True, download_name='cartoonized.jpeg')
    else:
        return jsonify({'error': 'Allowed image types are png, jpg, jpeg'}), 400

if __name__ == "__main__":
    app.run(debug=True, port=2000, host='0.0.0.0')



