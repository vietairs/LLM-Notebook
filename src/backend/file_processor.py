import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
import cgi
from openai_chat import generate_response

class FileProcessor(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_POST(self):
        ctype, pdict = cgi.parse_header(self.headers.get('content-type'))
        
        if ctype == 'application/json':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            if self.path == '/chat':
                user_message = data.get('message', '')
                chat_history = data.get('chatHistory', [])
                response = generate_response(user_message, chat_history)
                self._set_headers()
                self.wfile.write(json.dumps({'response': response}).encode())
            elif self.path == '/settings':
                model = data.get('model', 'openai')
                os.environ['DEFAULT_MODEL'] = model
                self._set_headers()
                self.wfile.write(json.dumps({'status': 'success'}).encode())
            else:
                self._set_headers()
                self.wfile.write(json.dumps({'error': 'Invalid endpoint'}).encode())
        elif ctype == 'multipart/form-data':
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST'}
            )
            
            file_item = form['file']
            
            if file_item.filename:
                file_content = file_item.file.read()
                file_type = file_item.type

                # Process the file based on its type
                if file_type.startswith('image/'):
                    # Placeholder for image processing
                    result = f"Processed image: {file_item.filename}"
                    # result = process_image(file_content)
                else:
                    # Placeholder for text processing
                    result = f"Processed document: {file_item.filename}"
                    # result = process_text(file_content)

                self._set_headers()
                self.wfile.write(json.dumps({'result': result}).encode())
            else:
                self._set_headers()
                self.wfile.write(json.dumps({'error': 'No file received'}).encode())
        else:
            self._set_headers()
            self.wfile.write(json.dumps({'error': 'Unsupported Media Type'}).encode())

def run(server_class=HTTPServer, handler_class=FileProcessor, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}')
    httpd.serve_forever()

if __name__ == '__main__':
    run()