#!/usr/bin/env python

# Python 2/3 compatibility
from __future__ import print_function
import sys

PY3 = sys.version_info[0] == 3

if PY3:
    xrange = range

import numpy as np
import cv2 as cv
import base64
import pytesseract
from pytesseract import Output
import json
import argparse
import os
import shutil
from flask import Flask, flash, request, redirect, render_template, jsonify
from werkzeug.utils import secure_filename
import math
from datetime import datetime
app = Flask(__name__)

app.secret_key = "secret key"
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# Get current path
path = os.getcwd()
# file Upload
UPLOAD_FOLDER = os.path.join(path, 'uploads')

# Make directory if uploads is not exists
if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed extension you can set your own
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

# MicroAlbumin values
C1_VALUES = [10, 30, 80, 150]

# Creatinine values
C2_VALUES = [10, 50, 100, 200, 300]

Sample_1 = [249, 215, 214]
Sample_2 = [222, 174, 188]
Sample_3 = [200, 110, 136]
Sample_4 = [157, 85, 105]

def Image_Compare(image):
    image_sample = cv.imread('output.jpg')
    if image_sample.shape != image.shape:
        # 调整图像大小
        image_sample = cv.resize(image_sample, (image.shape[1], image.shape[0]))
    mse = np.mean((image_sample - image) ** 2)
    return mse
    # ssim = cv.SSIM(image_sample, image)
    # return ssim

def Image_basic(image):
    height, width = image.shape[:2]
    image_type = image.dtype
    return (f"width:{width},height:{height},type:{image_type}")

def Horiztal_detection(image):
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    edges = cv.Canny(gray, threshold1=50, threshold2=150)
    lines = cv.HoughLines(edges, 1, np.pi / 180, threshold=100)
    angle = 0.0
    if lines is not None:
        for rho, theta in lines[:, 0]:
            # 将角度转换为度数
            angle = np.degrees(theta)
            break

    # print("图像倾斜角度（度）：", angle)

    # 判断图像是否倾斜
    if abs(angle) > 200:  # 根据需要调整阈值
        return ("图像倾斜")
    else:
        return None


def blur_detection(image):
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    # 计算图像的梯度
    gradient_x = cv.Sobel(gray, cv.CV_64F, 1, 0, ksize=3)
    gradient_y = cv.Sobel(gray, cv.CV_64F, 0, 1, ksize=3)
    # 计算梯度方差
    gradient_variance = np.var(gradient_x) + np.var(gradient_y)
    print(gradient_variance)
    threshold = 100  # 根据需要调整阈值
    print(gradient_variance);
    if gradient_variance > threshold:
        return None
    else:
        return ("图像模糊")

def get_image(base64_image):
    img = base64_image.split(',')[1]
    image_data = base64.b64decode(img)
    image_np_array = np.frombuffer(image_data, np.uint8)
    image = cv.imdecode(image_np_array, cv.IMREAD_COLOR)
    return image

def save_image(base64_image_data):
    image_data = base64_image_data.split(',')[1]
    image_data = base64.b64decode(image_data)
    image = cv.imdecode(np.frombuffer(image_data, np.uint8), -1)
    cv.imwrite("output.jpg", image)


def cropped_image(image):
    height, width, _ = image.shape
    top = int(0.10 * height)
    left = int(0.10 * width)
    bottom = top + int(0.52 * height)
    right = left + int(0.85 * width)
    cropped_image = image[top:bottom, left:right]
    return cropped_image

def cropped_circle():
    user_image = cv.imread('cropped_image.jpg')
    x1, y1 = int(0.37 * user_image.shape[1]), int(0.53 * user_image.shape[0])
    x2, y2 = int(0.39 * user_image.shape[1]), int(0.53 * user_image.shape[0])
    cropped_circle = user_image[y1:y2, x1:x2]
    return cropped_circle


def circle_detection(base64_image):
    # 读取图像
    # save_image(base64_image)
    # 读取图像
    # save_image(base64_image)
    try:
        image = get_image(base64_image)
        image = cropped_image(image)

        gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
        gray = cv.medianBlur(gray, 5)
        rows = gray.shape[0]
        circles = cv.HoughCircles(gray, cv.HOUGH_GRADIENT, 1, rows / 8,
                                  param1=100, param2=30,
                                  minRadius=1, maxRadius=30)
        num_circles = circles.shape[1]
        selected_circles = []
        print("找到{}个圆".format(num_circles))
        if circles is None:
            return "质检不通过", 400
        if(num_circles<2 or num_circles > 3):
            return "质检不通过", 400
    except Exception as e:
        error_message = e.args[0] if e.args else "Unknown error"
        return error_message,400
    # 初始化一个字典列表来存储检测到的圆形的颜色、坐标和半径
    else:
        if circles is not None:
              circles = np.uint16(np.around(circles))
        for i in circles[0, :]:
             center = (i[0], i[1])
            # circle center
             cv.circle(image, center, 1, (0, 100, 100), 3)
            # circle outline
             radius = i[2]
             b, g, r = image[center]
             selected_circles.append((radius, (r, g, b)))
             cv.circle(image, center, radius, (255, 0, 255), 3)

             # print(radius)
        selected_circles.sort(key=lambda circle: circle[0])
        test_color=selected_circles[0][1]
        control_color=selected_circles[1][1]
        control_distance=color_distance(control_color,Sample_1)
        test_1 = color_distance(test_color, Sample_1)
        test_2 = color_distance(test_color, Sample_2)
        test_3 = color_distance(test_color, Sample_3)
        test_4 = color_distance(test_color, Sample_4)
        out_str = {"control_distance": control_distance, "test_1": test_1, "test_2": test_2, "test_3": test_3,
                   "test_4": test_4}
        now = datetime.now()
        newvalue = {"$set": {"conclusion": out_str, "updateAt": now.strftime("%Y-%m-%d %H:%M")}}
        cv.imwrite('image_with_circle.jpg', image)
        return newvalue, 200
def color_distance(color1, color2):
    r1, g1, b1 = color1
    r2, g2, b2 = color2
    distance = math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
    return round(np.abs(distance),2)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_file(files):
        colors1 = []
        colors2 = []
        color1 = []
        color2 = []
        for file in files:
            if "colorchart" in file.filename:
                img = cv.imdecode(np.fromstring(file.read(), np.uint8), cv.IMREAD_UNCHANGED)
                cenList1, cenList2 = find_squares(img)
                colors1 = [img[centroid] for centroid in cenList1]
                colors2 = [img[centroid] for centroid in cenList2]
            if "teststrip" in file.filename:
                img = cv.imdecode(np.fromstring(file.read(), np.uint8), cv.IMREAD_UNCHANGED)
                height, width, color = img.shape
                color1 = img[(height // 4, width // 2)]
                color2 = img[(height // 4 * 3, width // 2)]
            with open("uploads/" + file.filename, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

        if colors1 == [] or colors2 == [] or color1 == [] or color2 == []:
            return "bad image(s)", 400

        index1 = find_nearest(colors1, color1)
        index2 = find_nearest(colors2, color2)
        C1 = C1_VALUES[index1]
        C2 = C2_VALUES[index2]
        flash('Files processed')
        data = {"MicroAlbumin": C1, "Creatinine": C2}
        return jsonify(data), 200


def find_nearest(colors, newColor):
    diff = 255 * 3
    indexFound = -1
    for index, color in enumerate(colors):
        newDiff = abs(color[0] - newColor[0]) + abs(color[1] - newColor[1]) + abs(color[2] - newColor[2])
        if newDiff < diff:
            indexFound = index
            diff = newDiff
    return indexFound


def angle_cos(p0, p1, p2):
    d1, d2 = (p0 - p1).astype('float'), (p2 - p1).astype('float')
    return abs(np.dot(d1, d2) / np.sqrt(np.dot(d1, d1) * np.dot(d2, d2)))


def find_squares(img):
    img = cv.GaussianBlur(img, (5, 5), 0)
    squares = []
    centroidsList1 = []
    centroidsList2 = []
    centroids = []
    for gray in cv.split(img):
        for thrs in xrange(0, 255, 26):
            if thrs == 0:
                bin = cv.Canny(gray, 0, 90, apertureSize=5)
                bin = cv.dilate(bin, None)
            else:
                _retval, bin = cv.threshold(gray, thrs, 255, cv.THRESH_BINARY)
            contours, _hierarchy = cv.findContours(bin, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
            for cnt in contours:
                cnt_len = cv.arcLength(cnt, True)
                cnt = cv.approxPolyDP(cnt, 0.02 * cnt_len, True)
                # print(cv.contourArea(cnt))
                if len(cnt) == 4 and cv.contourArea(cnt) > 1000 and cv.contourArea(cnt) < 20000 and cv.isContourConvex(
                        cnt):
                    cnt = cnt.reshape(-1, 2)
                    max_cos = np.max([angle_cos(cnt[i], cnt[(i + 1) % 4], cnt[(i + 2) % 4]) for i in xrange(4)])
                    if max_cos < 0.1:
                        square = np.int0(cv.boxPoints(cv.minAreaRect(cnt)))
                        centroid = (square[2][1] - (square[2][1] - square[0][1]) // 2,
                                    square[2][0] - (square[2][0] - square[0][0]) // 2)
                        if addNewCentroid(centroids, centroid):
                            centroids.append(centroid)
                            squares.append(square)

                            # print(centroid)
                        # cv.drawContours( img, squares, -1, (0, 255, 0), 3 )
                        # cv.imshow('squares', img)
                        # cv.waitKey(1)
    centroids.sort()
    print(centroids)
    centroidsList1 = centroids[0:4]
    centroidsList2 = centroids[4:]

    return centroidsList1, centroidsList2


def addNewCentroid(centroids, newCen):
    if centroids == []:
        return True
    for centroid in centroids:
        if abs(centroid[0] - newCen[0]) < 10 and abs(centroid[1] - newCen[1]) < 10:
            return False
    return True







