import numpy as np
import cv2
from flask import Flask, request, send_file, jsonify, render_template
from flask_cors import CORS
from PIL import Image
import io
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def cartoonize_image(img):
    # Convert image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Apply median blur
    gray = cv2.medianBlur(gray, 5)
    # Detect edges using adaptive thresholding
    edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
    
    # Apply bilateral filter to smooth out the colors
    color = cv2.bilateralFilter(img, d=9, sigmaColor=300, sigmaSpace=300)
    
    # Combine edges and color
    cartoon = cv2.bitwise_and(color, color, mask=edges)
    
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
        output_image = cartoonize_image(img_np)
        img_pil = Image.fromarray(output_image)
        img_io = io.BytesIO()
        img_pil.save(img_io, 'JPEG', quality=85)
        img_io.seek(0)
        return send_file(img_io, mimetype='image/jpeg', as_attachment=True, download_name='cartoonized.jpeg')
    else:
        return jsonify({'error': 'Allowed image types are png, jpg, jpeg'}), 400

if __name__ == "__main__":
    app.run(debug=True, port=2000, host='0.0.0.0')
