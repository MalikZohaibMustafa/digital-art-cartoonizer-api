import cv2
import numpy as np

def caart(img):
    kernel = np.ones((2, 2), np.uint8)

    # Bilateral filtering with smaller kernel size for edge preservation
    output = cv2.bilateralFilter(img, 1, 50, 50)

    # Canny edge detection with adjustable parameters for sharper edges
    edge = cv2.Canny(output, 80, 180)  # Experiment with these values

    output = cv2.cvtColor(output, cv2.COLOR_RGB2HSV)

    hists = []
    for channel in cv2.split(output):
        hist, _ = np.histogram(channel, bins=np.arange(256 + 1))
        hists.append(hist)

    # Consider alternative color quantization algorithms for more natural palettes
    C = []
    for h in hists:
        C.append(quantize_colors(h, num_colors=8))  # Experiment with num_colors

    output = output.reshape((-1, 3))
    for i in range(3):
        channel = output[:, i]
        index = np.argmin(np.abs(channel[:, np.newaxis] - C[i]), axis=1)
        output[:, i] = C[i][index]
    output = output.reshape((img.shape[0], img.shape[1], 3))
    output = cv2.cvtColor(output, cv2.COLOR_HSV2RGB)

    contours, _ = cv2.findContours(edge, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cv2.drawContours(output, contours, -1, (0, 0, 0), thickness=1)

    # Optional post-processing (experiment with these)
    # output = cv2.dilate(output, kernel, iterations=1)  # Enhance edge thickness
    # output = cv2.adaptiveEqualize(output, clipLimit=2.0)  # Improve local contrast

    return output

def quantize_colors(histogram, num_colors):
    # Replace with your preferred color quantization algorithm (e.g., median cut, neural network)
    # This example uses a simple approach (can be improved)
    sorted_colors, indices = np.unique(histogram, return_indices=True)
    sorted_colors = sorted_colors[::-1]  # Sort colors by frequency (
