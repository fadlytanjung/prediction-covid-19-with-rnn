from flask import Flask, render_template, request, jsonify
from tensorflow.keras.layers import concatenate
from werkzeug.utils import secure_filename
from Model import Model
from preprocessing import Preprocessing
import pandas as pd
import numpy as np
import os,json,re

UPLOAD_FOLDER = 'data'
ALLOWED_EXTENSIONS = set(['csv','xlsx'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename): # allowed function type extention data
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/') # index route
def index():
    return render_template('index.html')

@app.route('/prediction',methods=["GET","POST"]) # function cluster after send data
def cluster_result():
    N = False

    obj = Model()
    preprocessing = Preprocessing()
    if 'file' in request.files:
        filecsv = request.files['file']
        N = request.form["n"]

        print(N)
        if filecsv and allowed_file(filecsv.filename):
            filename = secure_filename(filecsv.filename)
            filecsv.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            N = int(N)
            datatestPath = 'data/' + filecsv.filename

            df = preprocessing.load_excel(datatestPath)

            df['Date'] = pd.to_datetime(df.Date)
            df.sort_values(by='Date', ascending=True)
            df = df if df.index.name == 'Date' else df.set_index('Date')
            df = df.astype('float32')
            df['pred'] = df.Confirm.shift(-1)
            
            df_new = df.dropna()
            df_new.describe()

            values = df_new.values
            values = values.astype('float32')
            
            print("Min:",np.min(values))
            print("Max:",np.max(values))

            scaler = obj.scaler
            scaled = scaler.fit_transform(values)
            scaled = pd.DataFrame(scaled)

            arr_df = obj.ts(scaled,60,0)
            arr_df.fillna(0,inplace=True)
            arr_df.columns = ['v1(t-60)','v2(t-60)','v3(t-60)','v4(t-60)','v1(t)']

            X_train,y_train, X_test,y_test = obj.train_test_split_data(arr_df)

            #Reshaping the data set to 3D with sample size, lookback time steps, and the input features.
            X_train = X_train.reshape((X_train.shape[0],1,X_train.shape[1]))
            X_test = X_test.reshape((X_test.shape[0],1,X_test.shape[1]))

            print(X_train.shape[1],X_train.shape[2])
            print(X_train.shape, y_train.shape, X_test.shape, y_test.shape)

            model = obj.model_rnn(X_train,y_train, X_test,y_test)
            prediction = obj.prediction(X_test,y_test)
            # save = obj.save_image()
            print(model)
            print(prediction)
            # print(save)


            forecast_pred_test = obj.set_forecast_data(df,N)

            forecast_pred = forecast_pred_test
            forecast_pred = obj.model.predict(forecast_pred_test)
            forecast_pred_test = forecast_pred_test.reshape(forecast_pred_test.shape[0],forecast_pred_test.shape[2])
            forecast_pred = concatenate((forecast_pred,forecast_pred_test[:,1:]),axis=1)
            print('forecast_pred:',forecast_pred)
            forecast_pred = obj.scaler.inverse_transform(forecast_pred)
            forecast_pred = forecast_pred[:,0]
            
            data = obj.plot_data(df,forecast_pred,N)

            return {"status":"success","message":"prediction success", "data":json.loads(data),'N':N},200

        else:
            model = obj.load_model()
            N = int(N)
            datatestPath = 'data/data.xlsx'

            df = preprocessing.load_excel(datatestPath)

            df['Date'] = pd.to_datetime(df.Date)
            df.sort_values(by='Date', ascending=True)
            df = df if df.index.name == 'Date' else df.set_index('Date')
            df = df.astype('float32')
            df['pred'] = df.Confirm.shift(-1)

            forecast_pred_test = obj.set_forecast_data(df,N)

            forecast_pred = forecast_pred_test
            forecast_pred = model.predict(forecast_pred_test)
            forecast_pred_test = forecast_pred_test.reshape(forecast_pred_test.shape[0],forecast_pred_test.shape[2])
            forecast_pred = concatenate((forecast_pred,forecast_pred_test[:,1:]),axis=1)
            print('forecast_pred:',forecast_pred)
            forecast_pred = obj.scaler.inverse_transform(forecast_pred)
            forecast_pred = forecast_pred[:,0]
            
            data = obj.plot_data(df,forecast_pred,N)

            return {"status":"success","message":"prediction success", "data":json.loads(data),'N':N},200

            return "error"
    
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080)) # port local env 
    # app.run(host="0.0.0.0", port=port) #env for heroku
    app.run(port=port, debug=True) # running appp with debug (auto load) 