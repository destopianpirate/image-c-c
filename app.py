from flask import Flask, render_template, request, send_file
from PIL import Image
import os, uuid

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.files.get("image")
        percent = max(1, int(request.form.get("percent", 50)))
        out_format = request.form.get("format", "jpg").lower()

        if not file:
            return "No file selected", 400

        base = uuid.uuid4().hex
        in_path = os.path.join(UPLOAD_FOLDER, f"in_{base}")
        out_path = os.path.join(UPLOAD_FOLDER, f"out_{base}.{out_format}")

        file.save(in_path)

        img = Image.open(in_path)

        if out_format in ["jpg", "jpeg"]:
            img = img.convert("RGB")
            img.save(out_path, quality=int(percent * 0.95), optimize=True)

        elif out_format == "webp":
            img.save(out_path, quality=int(percent * 0.95))

        elif out_format == "png":
            img.save(out_path, optimize=True)

        elif out_format == "ico":
            img = img.convert("RGBA")
            img.save(out_path, sizes=[(64, 64)])

        elif out_format == "pdf":
            img = img.convert("RGB")
            img.save(out_path)

        else:
            return "Unsupported format", 400

        return send_file(out_path, as_attachment=True)

    return render_template("index.html")

if __name__ == "__main__":
    app.run()
