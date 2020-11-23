from tensorflow.keras.layers import Dense,SimpleRNN
from tensorflow.keras.models import Sequential
from tensorflow.keras import backend as K
from tensorflow.keras import Input
from tensorflow.keras.layers import concatenate
from tensorflow.keras.optimizers import SGD, Adagrad, RMSprop, Adadelta, Adamax, Adam
from tensorflow.keras.models import model_from_json
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.metrics import mean_absolute_error, mean_squared_error,r2_score
from sklearn.preprocessing import MinMaxScaler

from preprocessing import Preprocessing
import pandas as pd
import numpy as np
import matplotlib
import matplotlib.pyplot as plt

import math, calendar

matplotlib.use('Agg')
np.random.seed(11)

class Model:

    def __init__(self):
        self.model = None
        self.scaler = MinMaxScaler(feature_range = (0,1))
        

    def get_data_forecast(self,data,N):
        X = data.iloc[-N:,[0,1,2]]
        return X

    def set_forecast_data(self,data,N):
        forecast_pred = self.get_data_forecast(data,N+1)
        forecast_pred['pred'] = data.Confirm.shift(-N)
        forecast_pred.fillna(0,inplace=True)
        forecast_pred_values = forecast_pred.values
        forecast_pred_values = forecast_pred_values.astype('float32')
        
        print(len(forecast_pred_values))

        scaled_forecast = self.scaler.fit_transform(forecast_pred_values)
        scaled_forecast = pd.DataFrame(scaled_forecast)
        scaled_forecast.head(5)

        arr_df_forecast = self.ts(scaled_forecast,1,0)
        arr_df_forecast.fillna(0,inplace=True)
        
        forecast_pred_test = arr_df_forecast.values[:,:-1]
        print(forecast_pred_test.shape)

        forecast_pred_test = forecast_pred_test.reshape((forecast_pred_test.shape[0],1,forecast_pred_test.shape[1]))
        
        return forecast_pred_test

    def train_test_split_data(self, values):
        #split data into train and test sets
        values = values.values
        train_sample = int(len(values)*0.8)
        train = values[:train_sample,:]
        test = values[train_sample:,:]

        # split into input and outputs
        X_train,y_train = train[:,:-1],train[:,-1]
        X_test,y_test = test[:,:-1], test[:,-1]

        print(X_train.shape, y_train.shape, X_test.shape, y_test.shape)

        return X_train,y_train, X_test,y_test
    
    # time series function (loock_back as a past time)
    def ts(self, new_data,look_back=60,pred_col=1):
        t = new_data.copy()
        t['id'] = range(1,len(t)+1)
        t = t.iloc[:-look_back,:]
        t.set_index('id',inplace=True)
        pred_value = new_data.copy()
        pred_value = pred_value.iloc[look_back:,pred_col]
        pred_value.columns = ['Pred']
        pred_value = pd.DataFrame(pred_value)
        
        pred_value['id'] = range(1,len(pred_value)+1)
        pred_value.set_index('id',inplace=True)
        final_df = pd.concat([t,pred_value],axis=1)
        
        return final_df

    def model_rnn(self, X_train,y_train,X_test,y_test):
    
        self.model = Sequential()
            
        self.model.add(SimpleRNN(units=30, input_shape=(X_train.shape[1],X_train.shape[2]), activation="relu"))
        self.model.add(Dense(1, activation='relu'))
        self.model.add(Dense(1))
        
        self.model.compile(loss='mean_squared_error', optimizer=Adam(lr=0.001))
        self.model.summary()

        history_rnn = self.model.fit(X_train, y_train,
                         epochs = 16, batch_size=32,
                         validation_data=(X_test,y_test),
                         verbose=1, callbacks=[EarlyStopping(monitor='val_loss', patience=10)],shuffle=False
                         )
        
        # save history
        loss_history = history_rnn.history["loss"]
        testing_loss_history = history_rnn.history["val_loss"]

        plt.figure(figsize=(15, 8))
        plt.title('model loss')
        plt.plot(history_rnn.history['loss'],label='train')
        plt.plot(history_rnn.history['val_loss'],label='test')
        plt.ylabel('loss')
        plt.xlabel('epoch')
        plt.legend(['train','test'], loc='upper left')
        # plt.show()
        plt.savefig('static/hasilplot/loss_model.png')

        loss = np.array(loss_history)
        np.savetxt("static/loss_history.txt", loss, delimiter=",")

        tes_loss = np.array(testing_loss_history)
        np.savetxt("static/testing_loss_history.txt", tes_loss, delimiter=",")

        model_json = self.model.to_json()
        with open("model.json", "w") as json_file:
            json_file.write(model_json)

        self.model.save_weights('model.h5')
        
        return 'loss history dan model saved!'

    def load_model(self):
        # load json file
        json_file = open("model_good.json", "r")
        loaded_model_json = json_file.read()
        json_file.close()

        # load weight
        model = model_from_json(loaded_model_json)
        model.load_weights("model_good.h5")

        model.compile(loss='mean_squared_error', optimizer='Adam', metrics=[self.soft_acc])
        
        model.summary()
        print('Model Loaded')
        return model
    
    def soft_acc(self, y_true, y_pred):
        return K.mean(K.equal(K.round(y_true), K.round(y_pred)))

    def prediction(self, X_test,y_test):

        # make prediction
        yhat = self.model.predict(X_test)
        X_test = X_test.reshape(X_test.shape[0],X_test.shape[2])

        # invert scaling for forecast
        inv_yhat = concatenate((yhat,X_test[:,1:]),axis=1)
        inv_yhat = self.scaler.inverse_transform(inv_yhat)
        inv_yhat = inv_yhat[:,0]

        # invert scaling for actual
        y_test = y_test.reshape((len(y_test),1))
        inv_y = concatenate((y_test,X_test[:,1:]),axis=1)
        inv_y = self.scaler.inverse_transform(inv_y)
        inv_y = inv_y[:,0]

        print('Mean absolute error (MAE): %f'% mean_absolute_error(inv_y,inv_yhat))
        print('Mean squared error (MSE): %f'% mean_squared_error(inv_y,inv_yhat))
        print('Root mean squared error (RMAE): %f'% math.sqrt(mean_squared_error(inv_y,inv_yhat)))
        print('R squared (R^2): %f'% r2_score(inv_y,inv_yhat))

        plt.figure(figsize=(15, 8))
        plt.title('Prediction Model')
        plt.plot(inv_y,label="Actual")
        plt.plot(inv_yhat,label="Predicted")
        plt.legend()
        # plt.show()
        plt.savefig('static/hasilplot/prediction.png')

        return 'success prediction data model!'

    def save_image(self):
        data = pd.read_csv("static/loss_history.txt")
        data = data.values
        data2= pd.read_csv("static/testing_loss_history.txt")
        data2 = data2.values
        # summarize history for loss
        plt.plot(data)
        plt.plot(data2)
        plt.title('model loss')
        plt.ylabel('loss')
        plt.xlabel('epoch')
        plt.legend(['train','test'], loc='upper left')
        # plt.show()
        plt.savefig('static/hasilplot/loss.png')

        data = pd.read_csv("static/testing_loss_history.txt")
        data = data.values
        
        # summarize history for loss
        plt.plot(data)
        plt.title('model test loss')
        plt.ylabel('loss')
        plt.xlabel('epoch')
        plt.legend(['test'], loc='upper left')
        # plt.show()
        plt.savefig('static/hasilplot/loss_test.png')

        return 'save fig successfull!'

    def plot_data(self, data,forecast,n):
    
   
        old_data = data['Confirm'][-n*2:]
        new_data = [np.nan for _ in range(len(old_data))]
        
        old_data.index.strftime("%Y-%m-%d")
        list_date = list(old_data.index)
        
        list_date = [str(i).split(' ')[0] for i in list_date]
        last_date = str(list(old_data.index)[-1]).split(' ')[0]
        
        
        last_year = last_date.split('-')[0]
        last_month = last_date.split('-')[1]
        last_day = last_date.split('-')[2]
        
        label_data = [old_data[i] for i in range(len(old_data))]
        for i in range(n):
            new_data.append(forecast[i])
            label_data.append(np.nan)
            
            new_year = int(last_year)
            new_month = int(last_month)
            new_day = int(last_day)+i+1
            
            new_day_limit = calendar.monthrange(new_year,new_month)[1]
            if new_day > new_day_limit:
                new_day -=new_day_limit
                new_month = int(last_month)+1
                
            if new_month > 12:
                new_year += 1
                last_month= int(last_month)-12
                last_year= int(last_year)+1
                new_month -= 12
            # list_date.append(str('0'+str(new_day) if new_day < 10 else new_day)+'-'+str('0'+str(new_month) if new_month < 10 else new_month))
            list_date.append(str(new_year)+'-'+str('0'+str(new_month) if new_month < 10 else new_month)+'-'
                         +str('0'+str(new_day) if new_day < 10 else new_day))
        new_df = {'date':list_date,'Confirm':label_data,'forecast':new_data}
        
        new_df = pd.DataFrame(data=new_df)
        # initial plot
        plt.figure(figsize=(45, 8))
        plt.plot(new_df['date'], new_df['Confirm'], 'b-', label = 'Confirm')
        plt.plot(new_df['date'], new_df['forecast'], 'r-', label = 'Forecast')
        plt.xlabel('Tanggal')
        plt.ylabel('Jumlah')
        plt.title('Label of Prediction covid-19 '+'Confirmed Status')
        plt.savefig('static/hasilplot/{}-{}.png'.format('Confirmed',n))
        plt.show(); # show plots
        
        return new_df.to_json()
