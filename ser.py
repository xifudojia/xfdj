from flask import Flask, jsonify, abort, send_from_directory,request,make_response,Response,redirect
import os,time
from threading import Lock
from myfunc import *
# from crawler_InfinityFree import *
from flask import make_response
import logging,threading

app=Flask(__name__,static_folder=".")


    
 
@app.route("/", defaults={"path": ""}, methods=["GET", "POST"])
@app.route("/<path:path>",methods=["GET", "POST"])
def serve_static_or_404(path):
    
        
    full_path = os.path.join(app.static_folder, path)

    # 4. 文件存在 → 返回
    if os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    else:
        abort(404)

# ==============================
# 3️⃣ 自定义 404 页面
# ==============================
@app.errorhandler(404)
def not_found(e):
    ss("error:2025-11-26 16:32:33 404")
    return jsonify({"error": "Not Found"}), 404

# ==============================
# 4️⃣ 启动
# ==============================
if __name__ == "__main__":
    print("--start--")

    app.run(debug=False, host="0.0.0.0", port=8080)
  