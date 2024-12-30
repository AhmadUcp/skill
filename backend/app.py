from flask import Flask, jsonify, request
import scrapingCourses
import rapid
import lightcast

app = Flask(__name__)

@app.route('/scrape_courses', methods=['GET'])
def scrape_courses():
    # Assuming scrapcourse.py has a function named 'scrape_courses'
    try:
        result = scrapingCourses.scrape_courses()  # Replace with your actual function
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/rapid_analysis', methods=['POST'])
def rapid_analysis():
    # Assuming rapid.py has a function named 'analyze' that accepts data
    try:
        data = request.get_json()  # Assuming JSON input from the frontend
        result = rapid.analyze(data)  # Replace with your actual function
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/light_case', methods=['POST'])
def light_case():
    # Assuming lightcase.py has a function named 'process_case'
    try:
        data = request.get_json()  # Assuming JSON input from the frontend
        result = lightcast.process_case(data)  # Replace with your actual function
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
