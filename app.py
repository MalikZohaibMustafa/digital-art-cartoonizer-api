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

app.config["UPLOAD_FOLDER"] = "static/"


ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

# img_path = "./horse.jpg"
LINE_WIDTH  = 7
BLUR_VALUE = 5
TOTAL_COLORS = 4
EPOCHS = 50
ACCURACY = 0.02

global generated_art_path
# return boolean value after checking whether the file extension is valid or not
def allowed_file(filename):
    return ('.' in filename) and (filename.split('.', 1)[1].lower() in ALLOWED_EXTENSIONS)


# this function will take image name and return unique image name, which help to avoid name conflict
def uniqueImgName(imgName, isGenerated:bool):     
        # split img name after from extension
        imgName_list = imgName.split('.')       

        # function is call for generated image
        if isGenerated:
            ImgName_unique = imgName_list[0] + "_generated" + f".{imgName_list[1]}"
        
        # if function is call first time(for make uploaded image name unique)
        else:
            unique_string = str(uuid.uuid4())
            ImgName_unique = imgName_list[0] + f"_{unique_string}" + f".{imgName_list[1]}"

        return ImgName_unique

def edge_detection(img, line_width, blur_amount):
    gray_scale_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Smooting gray scale image(this will helps in better edges detection)

    # In median blur, the central element of the image 
    # .... is replaced by the median of all the pixels
    gray_scale_img_blur = cv2.medianBlur(gray_scale_img, blur_amount)


    # Now detecting edges
    # Syntax: 
    #   cv2.adaptiveThreshold(source, maxVal, adaptiveMethod, thresholdType, blocksize, constant)
    img_edges = cv2.adaptiveThreshold(gray_scale_img_blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, line_width, blur_amount)

    return img_edges

def color_quantization(img, k_value, epochs, accuracy):  # k_value is number of clusters    
    data = np.float32(img)
    data = data.reshape((-1, 3))
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, epochs, accuracy)

    # Now applying kmeans algorithm
    # Syntax: 
    #   cv2.kmeans(samples, nclusters(K), criteria, attempts, flags)    
    ret, centers_position, centroid = cv2.kmeans(data, k_value, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    centroid = np.uint8(centroid)
    result = centroid[centers_position.flatten()]

    # reshaping image to its actual shape
    result = result.reshape(img.shape)

    return result



def generate_cartoonize_img(img, LINE_WIDTH, BLUR_VALUE, TOTAL_COLORS, EPOCHS, ACCURACY):
    edgeImg = edge_detection(img, LINE_WIDTH, BLUR_VALUE)
    quantized_img = color_quantization(img, TOTAL_COLORS, EPOCHS, ACCURACY)

    # bilateralFilter is used for removing noice and smothing
    blurred_img = cv2.bilateralFilter(quantized_img, d=7, sigmaColor=200, sigmaSpace=200)
    cartoonized_img = cv2.bitwise_and(blurred_img, blurred_img, mask = edgeImg)
    
    return cartoonized_img
    


@app.route('/')
def home():    
    return render_template('index.html')



@app.route('/submit', methods=['POST'])
def submit():

    global uploadedImage
    global generated_art_path
    global generated_art_name

    print(dict(request.files))
    if 'img' not in request.files:
        resp = jsonify({'message':'No file in the request'})
        resp.status_code = 400   # 400 ---> Bad Request
        return resp

    
    uploadedImage = request.files["img"]

    if uploadedImage.filename == '':        
        resp = jsonify({'message':'No image selected for uploading'})
        resp.status_code = 400
        return resp


# secure_filename ---> pass it a filename and it will return
#  a secure version of it. 
# secure_filename("../../../etc/passwd")
#  ---- 'etc_passwd'    

    if uploadedImage and allowed_file(uploadedImage.filename):
        ImgName = secure_filename(uploadedImage.filename)

#     
    # save image with unique name, So to not face conflict
    #  while selecting image

        ImgName_unique = uniqueImgName(ImgName, isGenerated=False)
        

        uploadedImage.save(os.path.join(app.config['UPLOAD_FOLDER'], ImgName_unique))
        print('Image successfully uploaded')
        # flash('Image successfully uploaded and displayed below')

        # getting image path from static folder
        img_path = f"./static/{ImgName_unique}"

        # loading img in numpy array and converting datatype to uint8
        img_numpy = plt.imread(img_path)
        img_numpy = img_numpy.astype(np.uint8)   
        # print(f"\nShape of img before reshaping is: {img_numpy.shape}\n")

        # if img_numpy.shape[2] > 3:
        #     img_numpy.reshape((-1, img_numpy.shape[1], 3))

        # print(f"\nShape of img after reshaping is: {img_numpy.shape}\n")

        # call generate_cartoonize_img, it returns image in numpy array            
        cartoon_img = generate_cartoonize_img(img_numpy, LINE_WIDTH, BLUR_VALUE, TOTAL_COLORS, EPOCHS, ACCURACY)
        

        # setting unique name for cartoon_img, to avoid name conflict
        generated_art_name = uniqueImgName(ImgName_unique, isGenerated=True)

        
        # generated_art_path = f"./art_generated/{generated_art_name}"
        generated_art_path = f"./static/{generated_art_name}"

        # gen_img_path = f"./art_generated/{generated_art_name}"

        cartoon_img = Image.fromarray(cartoon_img)
        cartoon_img.save(generated_art_path)
        
        # print(cartoon_img)
        # print(f"\nType of cartoon image is: {type(cartoon_img,)}\n")
        
        # print(f"\n{(ImgName_unique)}\n")
        # print(f"\n{(generated_art_name)}\n")
        # print(f"\n{(generated_art_path)}\n")
        print('imag', generated_art_path)

        # return render_template('index.html', art_file = generated_art_name, filename=ImgName_unique)     #       
            # filename = ImgName_unique

        # return send_file(generated_art_path , mimetype="image/*")
        return jsonify({'image':'https://digital-art-cartoonizer-api.onrender.com/'+generated_art_path})

    else:
        return jsonify({"Message":"Allowed image types are - png, jpg, jpeg"})
        # flash('Allowed image types are - png, jpg, jpeg')
        # return redirect(request.url)


@app.route('/generate', methods=['POST'])
def generate():
    global uploadedImage
    global generated_art_path
    global generated_art_name

    print(dict(request.files))
    if 'img' not in request.files:
        resp = jsonify({'message':'No file in the request'})
        resp.status_code = 400   # 400 ---> Bad Request
        return resp

    uploadedImage = request.files["img"]

    if uploadedImage.filename == '':
        resp = jsonify({'message':'No image selected for uploading'})
        resp.status_code = 400
        return resp

    if uploadedImage and allowed_file(uploadedImage.filename):
        ImgName = secure_filename(uploadedImage.filename)
        ImgName_unique = uniqueImgName(ImgName, isGenerated=False)
        uploadedImage.save(os.path.join(app.config['UPLOAD_FOLDER'], ImgName_unique))
        print('Image successfully uploaded')

        img_path = f"./static/{ImgName_unique}"
        img_numpy = plt.imread(img_path)
        img_numpy = img_numpy.astype(np.uint8)

        cartoon_img = generate_cartoonize_img(img_numpy, LINE_WIDTH, BLUR_VALUE, TOTAL_COLORS, EPOCHS, ACCURACY)
        generated_art_name = uniqueImgName(ImgName_unique, isGenerated=True)
        generated_art_path = f"./static/{generated_art_name}"

        cartoon_img = Image.fromarray(cartoon_img)
        cartoon_img.save(generated_art_path)
        print('Image processed and saved:', generated_art_path)

        return send_file(generated_art_path, mimetype='image/jpeg')

    else:
        return jsonify({"message":"Allowed image types are - png, jpg, jpeg"})


@app.route('/art_generated/<filename>')
def display_image(ImgName):        
    return redirect(url_for('art_generated', filename= ImgName), code=301)





@app.route('/download', methods=['GET'])
def download_art():    
    # if generated_art_path:    
    # return send_file(generated_art_path, as_attachment=True, cache_timeout=0, attachment_filename=generated_art_name)
    return jsonify({"path":generated_art_path})
        

@app.route('/share')
def share_art():
    """
    Display social media platform (facebook, twitter) link to
    share generated art on it
    """    
    return jsonify({"path":"My name is MiKE"})
   


@app.route('/buy')
def buy_art():
    """
    Display form that contains information about required frame type.
    When user submit form then email will be recieved to developer  
    """

    # if art will generated then try block will be executes,
    #  otherwise except block will execute    
    try:
        return render_template("buy_art_form.html", art_file = generated_art_name)
    except:
        return render_template("buy_art_form.html",)
    


if __name__ == "__main__":
    app.run(debug=True, port=2000, host='0.0.0.0')


