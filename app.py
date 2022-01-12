from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        return 'POST'
    if request.method == 'GET':
        user = "John"
        return render_template('index.html', user=user)


if __name__ == '__main__':
    app.run(debug=True)
