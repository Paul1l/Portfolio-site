"""Точечный портрет для первого экрана: голова без шеи, белые точки на чёрном.

Скрипт не нужен сайту во время работы — он один раз готовит
assets/head/portrait.webp, из которого браузер собирает голову из частиц.

Запуск (нужны Python 3, numpy, opencv-python, Pillow):

    python tools/portrait/make_portrait.py PHOTO OUTLINE.json assets/head/portrait.webp

PHOTO         — фото, где хорошо видно лицо (чем больше разрешение, тем точнее черты).
OUTLINE.json  — контур головы на этом фото: {"points": [[x, y], ...]} в пикселях фото.
                Обведите волосы, лицо и уши, без шеи и плеч; всё снаружи контура
                (фон, другие люди) в портрет не попадает.

Необязательно: переменная окружения DOT_DENSITY (по умолчанию 0.31) задаёт
плотность точек. Хорошо, когда точек получается 14–16 тысяч: тогда на desktop
сайт использует их все (бюджет PORTRAIT_POINTS в js/head-particles.js).

После замены портрета проверьте положение рта: константа MOUTH в
js/head-particles.js (линия губ, центр, ширина, низ подбородка в долях кадра).
"""
import json
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw

OUT_W, OUT_H = 392, 542
HEAD_H = 504
DENSITY = float(os.environ.get('DOT_DENSITY', '0.31'))


def floyd_steinberg(density, rng):
    work = density.copy()
    dots = np.zeros_like(work)
    height, width = work.shape
    for y in range(height):
        for x in range(width):
            old = work[y, x]
            threshold = 0.5 + (rng.random() - 0.5) * 0.25
            new = 1.0 if old > threshold else 0.0
            dots[y, x] = new
            err = old - new
            if x + 1 < width:
                work[y, x + 1] += err * 7 / 16
            if y + 1 < height:
                if x > 0:
                    work[y + 1, x - 1] += err * 3 / 16
                work[y + 1, x] += err * 5 / 16
                if x + 1 < width:
                    work[y + 1, x + 1] += err * 1 / 16
    return dots


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)

    photo_path, outline_path, out_path = sys.argv[1:4]
    photo = Image.open(photo_path).convert('RGB')
    with open(outline_path, encoding='utf-8') as file:
        poly = np.array(json.load(file)['points'], dtype=np.float64)

    # Масштабируем фото так, чтобы голова была высотой HEAD_H, и ставим её в центр кадра.
    scale = HEAD_H / (poly[:, 1].max() - poly[:, 1].min())
    big = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
    poly_big = poly * scale
    ox = (poly_big[:, 0].min() + poly_big[:, 0].max()) / 2 - OUT_W / 2
    oy = (poly_big[:, 1].min() + poly_big[:, 1].max()) / 2 - OUT_H / 2
    frame = Image.new('RGB', (OUT_W, OUT_H), 'black')
    frame.paste(big, (round(-ox), round(-oy)))
    poly_out = poly_big - np.array([ox, oy])

    mask_img = Image.new('L', (OUT_W, OUT_H), 0)
    ImageDraw.Draw(mask_img).polygon([tuple(point) for point in poly_out], fill=255)
    mask = np.asarray(mask_img).astype(np.float32) / 255.0
    mask_soft = cv2.GaussianBlur(mask, (0, 0), 1.2)
    inside = mask > 0.5

    # Сглаживаем шум и артефакты сжатия, сохраняя границы черт.
    smooth = cv2.bilateralFilter(np.asarray(frame), 9, 38, 9)
    rgb = smooth.astype(np.float32) / 255.0
    gray = rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722

    # Тон кожи: локальный контраст + сглаживание.
    clahe = cv2.createCLAHE(clipLimit=1.8, tileGridSize=(4, 4))
    tone = clahe.apply(np.clip(gray * 255, 0, 255).astype(np.uint8)).astype(np.float32) / 255.0
    tone = cv2.GaussianBlur(tone, (0, 0), 4.0)
    low, high = np.percentile(tone[inside], [2, 98])
    tone = np.clip((tone - low) / (high - low + 1e-6), 0, 1)

    # Контуры черт: глаза, брови, нос, губы, линия волос.
    soft = cv2.GaussianBlur(gray, (0, 0), 1.6)
    gx = cv2.Sobel(soft, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(soft, cv2.CV_32F, 0, 1, ksize=3)
    edges = np.sqrt(gx * gx + gy * gy) * cv2.erode(mask, np.ones((7, 7), np.uint8))
    edges = np.clip(edges / (np.percentile(edges[inside], 97) + 1e-6), 0, 1)

    # Светлый ободок силуэта.
    rim = cv2.GaussianBlur(mask - cv2.erode(mask, np.ones((5, 5), np.uint8)), (0, 0), 1.6)
    rim = np.clip(rim / (rim.max() + 1e-6), 0, 1)

    # Волосы: тёмная верхняя часть головы получает ровную текстуру точек.
    ys = np.arange(OUT_H, dtype=np.float32)[:, None]
    top_y = poly_out[:, 1].min()
    head_h = poly_out[:, 1].max() - top_y
    upper = np.clip((top_y + head_h * 0.30 - ys) / (head_h * 0.06), 0, 1)
    dark = np.clip((0.42 - cv2.GaussianBlur(gray, (0, 0), 2.0)) / 0.15, 0, 1)
    hair = cv2.GaussianBlur(upper * dark * inside.astype(np.float32), (0, 0), 2.0)

    value = 0.05 + 0.4 * tone ** 1.6 + 0.8 * edges ** 1.3 + 0.75 * rim + 0.42 * hair
    value = np.clip(value, 0, 1) * mask_soft

    rng = np.random.default_rng(20261105)
    dots = floyd_steinberg(value ** 1.35 * DENSITY, rng)

    accent = np.clip(edges ** 1.3 * 1.2 + rim + hair * 0.3, 0, 1)
    brightness = np.clip(0.55 + 0.45 * accent + (rng.random(value.shape) - 0.5) * 0.1, 0, 1)
    result = Image.fromarray(np.clip(dots * brightness * 255, 0, 255).astype(np.uint8), 'L')
    result.save(out_path, lossless=True, method=6)
    print(f'{out_path}: {int(dots.sum())} dots, {OUT_W}x{OUT_H}')


if __name__ == '__main__':
    main()
