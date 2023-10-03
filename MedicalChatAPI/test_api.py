import json
import unittest
from flask_testing import TestCase
from api import app, tokens

TOKEN = list(tokens.keys())[0]


class TestApp(TestCase):
    def create_app(self):
        app.config['TESTING'] = True
        return app

    # test the api route /predict with missing bearer token
    def test_predict_missing_token(self):
        response = self.client.post(
            '/predict',
            json={'input_text': 'I am sick'},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)

    # test the api route /predict with valid bearer token
    def test_predict_valid_token(self):
        response = self.client.post(
            '/predict',
            json={'input_text': 'I am sick'},
            headers={'Authorization': 'Bearer ' + TOKEN},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue('response' in json.loads(response.data))

    # test the api route /predict with valid bearer token but wrong parameter
    def test_predict_invalid_parameter(self):
        response = self.client.post(
            '/predict',
            json={'wrong_key': 'I am sick'},
            headers={'Authorization': 'Bearer ' + TOKEN},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    # test the api route /predict with valid bearer token but missing parameter
    def test_predict_missing_parameter(self):
        response = self.client.post(
            '/predict',
            headers={'Authorization': 'Bearer ' + TOKEN},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)


if __name__ == '__main__':
    unittest.main()
