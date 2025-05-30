from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def get_ip():
    # Captura o IP público do visitante
    ip_publico = request.remote_addr

    # Retorna o IP na página
    return f"Seu IP público é: {ip_publico}"

if __name__ == '__main__':
    app.run(debug=True)
