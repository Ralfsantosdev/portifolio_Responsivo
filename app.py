from flask import Flask, render_template, redirect, request, flash, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("SECRET_KEY")

mail_settings = {
    "MAIL_SERVER": 'smtp.gmail.com',
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": os.getenv("EMAIL"),
    "MAIL_PASSWORD": os.getenv("SENHA")
}

app.config.update(mail_settings)
mail = Mail(app)

class Contato:
    def __init__(self, nome, email, mensagem):
        self.nome = nome
        self.email = email
        self.mensagem = mensagem

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send', methods=['GET', 'POST'])
def send():
    if request.method == 'POST':
        formContato = Contato(
            request.form.get("nome", ""),
            request.form.get("email", ""),
            request.form.get("mensagem", "")
        )

        try:
            msg = Message(
                subject=f'{formContato.nome} te enviou uma mensagem no portfólio',
                sender=app.config.get("MAIL_USERNAME"),
                recipients=[
                    os.getenv("RECIPIENT_EMAIL"),
                    app.config.get("MAIL_USERNAME")
                ],
                body=f'''
            {formContato.nome} com o e-mail {formContato.email}, te enviou a seguinte mensagem:

            {formContato.mensagem}
                '''
            )
            mail.send(msg)
            if request.headers.get('Accept') == 'application/json':
                return jsonify({"success": True, "message": "Mensagem enviada com sucesso! ✅"}), 200
            flash('Mensagem enviada com sucesso! ✅')
        except Exception as e:
            print(f"[MAIL ERROR] {e}")
            if request.headers.get('Accept') == 'application/json':
                return jsonify({"success": False, "message": "Erro ao enviar mensagem. Tente novamente mais tarde. ❌"}), 500
            flash('Erro ao enviar mensagem. Tente novamente mais tarde. ❌')

    return redirect('/')

if __name__ == '__main__':
    app.run(debug=False)