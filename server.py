import socketio
import eventlet
import eventlet.wsgi
from flask import Flask, render_template, send_from_directory
import os

ns = '/chat'
port = int(os.environ['PORT']) # will, correctly, raise a KeyError if does not exist

sio = socketio.Server()
app = Flask(__name__)


@app.route("/entry")
def entryPage():
  return render_template("entry.html", ns=ns, port=port)
@app.route("/display")
def displayPage():
  return render_template("display.html", ns=ns, port=port)

@app.route('/<path:path>')
def send_js(path):
  return send_from_directory('static', path);


@sio.on('connect', namespace=ns)
def connect(sid, environ):
  print("connect", sid)

@sio.on('chat message', namespace=ns)
def message(sid, data):
  print("message", data)
  sio.emit("reply", "RESPONDING HELLO", room=sid, namespace=ns)

@sio.on('disconnect', namespace=ns)
def disconnect(sid):
  print('disconnect', sid)


if __name__ == "__main__":
  # wrap Flask application with engineio's middleware
  app = socketio.Middleware(sio, app)
  # deploy as an eventlet WSGI server
  eventlet.wsgi.server(eventlet.listen(('', port)), app)
