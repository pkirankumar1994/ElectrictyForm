import os
from flask import Flask, jsonify, request, g
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATABASE = 'database.db'

# create database table if it doesn't exist
# establish connection with database


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

# close database connection after request has finished


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# insert data into database


def insert_data(serviceType, customerName, adharNumber, phoneNumber,
                sex, fatherName, caste, maritalStatus, houseNumber,
                streetName, city, pincode):
    conn = get_db()
    c = conn.cursor()
    c.execute('''INSERT INTO electricityServiceForm (serviceType, customerName, adharNumber,
                phoneNumber, sex, fatherName, caste, maritalStatus, houseNumber,
                streetName, city, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
              (serviceType, customerName, adharNumber, phoneNumber, sex, fatherName, caste,
               maritalStatus, houseNumber, streetName, city, pincode))
    conn.commit()
    conn.close()


def delete_data(id):
    conn = get_db()
    c = conn.cursor()
    c.execute("DELETE FROM electricityServiceForm WHERE id=?", (id,))
    conn.commit()
    conn.close()


@app.route("/", methods=['GET', 'POST'])
def main():
    if request.method == 'POST':
        data = request.get_json()
        serviceType = data['serviceType']
        customerName = data['customerName']
        adharNumber = data['adharNumber']
        phoneNumber = data['phoneNumber']
        sex = data['sex']
        fatherName = data['fatherName']
        caste = data['caste']
        maritalStatus = data['maritalStatus']
        houseNumber = data['houseNumber']
        streetName = data['streetName']
        city = data['city']
        pincode = data['pincode']
        insert_data(serviceType, customerName, adharNumber, phoneNumber, sex,
                    fatherName, caste, maritalStatus, houseNumber, streetName,
                    city, pincode)
        return jsonify({'success': True}), 200
    elif request.method == 'GET':
        conn = get_db()

        # open database connection
        conn = sqlite3.connect('database.db')
        cur = conn.cursor()

        # execute query to fetch data
        cur.execute("SELECT * FROM electricityServiceForm")

        # fetch all rows
        rows = cur.fetchall()

        # close database connection
        cur.close()
        conn.close()

        # convert rows to JSON format
        data = []
        for row in rows:
            item = {
                "serviceType": row[0],
                "customerName": row[1],
                "adharNumber": row[2],
                "phoneNumber": row[3],
                "sex": row[4],
                "fatherName": row[5],
                "caste": row[6],
                "maritalStatus": row[7],
                "houseNumber": row[8],
                "streetName": row[9],
                "city": row[10],
                "pincode": row[11],
                "id": row[12],
            }
            data.append(item)

        # return data to client
        return jsonify(data)


@app.route("/electricity/<int:id>", methods=['DELETE'])
def delete_data(id):
    conn = get_db()

    # open database connection
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()

    # execute query to delete data
    cur.execute("DELETE FROM electricityServiceForm WHERE id=?", (id,))

    # commit the changes
    conn.commit()

    # close database connection
    cur.close()
    conn.close()

    # return success response
    return jsonify({'success': True}), 200

@app.route('/electricity/<int:id>', methods=['PUT'])
def update_data(id):
    conn = get_db()
    c = conn.cursor()
    data = request.get_json()
    c.execute('''UPDATE electricityServiceForm SET serviceType=?, customerName=?, adharNumber=?,
                 phoneNumber=?, sex=?, fatherName=?, caste=?, maritalStatus=?, houseNumber=?,
                 streetName=?, city=?, pincode=? WHERE id=?''',
              (data['serviceType'], data['customerName'], data['adharNumber'], data['phoneNumber'],
               data['sex'], data['fatherName'], data['caste'], data['maritalStatus'], data['houseNumber'],
               data['streetName'], data['city'], data['pincode'], id))
    conn.commit()
    conn.close()
    return jsonify({'success': True}), 200


if __name__ == "__main__":
    app.run(debug=False, port=8000, host='0.0.0.0')
