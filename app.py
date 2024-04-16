# from crypt import methods
from fileinput import filename
from flask import Flask, redirect, render_template, request, send_file, jsonify, url_for
from flask_cors import CORS
import cv2
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
from werkzeug.utils import secure_filename
import base64
import numpy as np
import io, os, cv2
import time
import uuid

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
LINE_WIDTH = 7
BLUR_VALUE = 5
TOTAL_COLORS = 4
EPOCHS = 10
ACCURACY = 0.95

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def edge_detection(img, line_width, blur_amount):
    gray_scale_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray_scale_img_blur = cv2.medianBlur(gray_scale_img, blur_amount)
    img_edges = cv2.adaptiveThreshold(gray_scale_img_blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, line_width, blur_amount)
    return img_edges

def color_quantization(img, k_value, epochs, accuracy):
    data = np.float32(img).reshape((-1, 3))
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, epochs, accuracy)
    _, labels, centers = cv2.kmeans(data, k_value, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    centers = np.uint8(centers)
    result = centers[labels.flatten()].reshape(img.shape)
    return result


def generate_cartoonize_img(img, line_width, blur_value, total_colors, epochs, accuracy):
    edges = edge_detection(img, line_width, blur_value)
    quantized = color_quantization(img, total_colors, epochs, accuracy)
    blurred = cv2.bilateralFilter(quantized, d=7, sigmaColor=200, sigmaSpace=200)
    cartoon = cv2.bitwise_and(blurred, blurred, mask=edges)
    return cartoon


@app.route('/')
def home():    
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    if 'img' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['img']
    if file.filename == '':
        return jsonify({'message': 'No image selected for uploading'}), 400
    if file and allowed_file(file.filename):
        image = Image.open(file.stream)
        img_np = np.array(image)
        cartoon_img = generate_cartoonize_img(img_np, LINE_WIDTH, BLUR_VALUE, TOTAL_COLORS, EPOCHS, ACCURACY)
        cartoon_pil = Image.fromarray(cartoon_img)
        img_io = io.BytesIO()
        cartoon_pil.save(img_io, 'JPEG', quality=70)
        img_io.seek(0)
        return send_file(img_io, mimetype='image/jpeg', download_name='cartoonized.jpeg')
    else:
        return jsonify({'message': 'Allowed image types are png, jpg, jpeg'}), 400


if __name__ == "__main__":
    app.run(debug=True, port=2000, host='0.0.0.0')


