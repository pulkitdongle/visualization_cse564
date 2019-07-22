from flask import Flask, render_template, request, redirect, Response, jsonify, send_file
import numpy as np
import pandas as pd
import json
import math
import csv
app = Flask(__name__)

@app.route("/getYearWiseData",methods=['POST'])
def getYearWiseData():
    global df
    data = df
    year = request.form['data']
    year_data = data.loc[data['year'] == int(year)]
    hf_rank_data = year_data[['year','ISO_code','countries','hf_rank']]
    chart_data = hf_rank_data.to_dict(orient='records')
    chart_data = json.dumps(chart_data,indent=2)
    data = {'chart_data': chart_data}
    return jsonify(data)


@app.route("/getStats",methods=['POST'])
def getStats():
    global df
    data = df
    year = request.form['year']
    country = request.form['country']
    id = request.form['id']
    year_data = data.loc[data['year'] == int(year)]
    # country_data = year_data.loc[year_data['countries'] == country]
    country_data = year_data.loc[year_data['ISO_code'] == id]
    print(country_data)
    country_stats_data = country_data[['pf_rol','pf_ss','pf_movement','pf_religion','pf_association','pf_expression','pf_identity','ef_government','ef_legal','ef_money','ef_trade','ef_regulation']]    
    country_stats_data = country_stats_data.round(2)
    print(country_stats_data)
    chart_data = country_stats_data.to_dict(orient='records')
    chart_data = json.dumps(chart_data,indent=2)
    data = {'chart_data': chart_data}
    return jsonify(data)

@app.route("/getCrimeStatsData",methods=['POST'])
def getCrimeStatsData():
    global df
    data = df
    year = request.form['year']
    country = request.form['country']
    id = request.form['id']
    year_data = data.loc[data['year'] == int(year)]
    
    # country_data = year_data.loc[year_data['countries'] == country]
    country_data = year_data.loc[year_data['ISO_code'] == id]

    region = country_data['region'].values[0]
    print("-------------------")
    print(region)
    print("-------------------")

    region_wise_data = year_data[year_data['region'] == region]

    print(region_wise_data)
    region_wise_data = region_wise_data[['countries','pf_ss_homicide','pf_ss_disappearances_disap','pf_ss_disappearances_violent','pf_ss_disappearances_organized','pf_ss_disappearances_fatalities','pf_ss_disappearances_injuries','pf_rol']]
    # country_stats_data = country_data[['pf_rol','pf_ss','pf_movement','pf_religion','pf_association','pf_expression','pf_identity','ef_government','ef_legal','ef_money','ef_trade','ef_regulation']]    
    region_wise_data = region_wise_data.round(2)
    region_wise_data = region_wise_data.dropna()
    print(region_wise_data)
    chart_data = region_wise_data.to_dict(orient='records')
    chart_data = json.dumps(chart_data,indent=2)
    data = {'chart_data': chart_data}
    return jsonify(data)

# @app.route("/getParallelCsv",methods=['POST'])
# def getParallelCsv():
#     return send_file('parallel.csv',
#                      mimetype='text/csv',
#                      attachment_filename='parallel.csv',
#                      as_attachment=True)


@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    df = pd.read_csv("data/hfi.csv")
    # year = 2008
    # year_data = df.loc[df['year'] == year]
    # hf_rank_data = year_data[['year','ISO_code','countries','hf_rank']]
    # with open('static/json/world_ranking_'+str(year)+'.tsv','wt') as out_file:
    #     tsv_writer = csv.writer(out_file, delimiter='\t')
    #     tsv_writer.writerow(['id','name','rank'])
    #     for i in range(hf_rank_data.shape[0]):
    #         if hf_rank_data['hf_rank'][i+1296] > 0:
    #             tsv_writer.writerow([hf_rank_data['ISO_code'][i+1296], hf_rank_data['countries'][i+1296], str(int(hf_rank_data['hf_rank'][i+1296]))])
    app.run(debug=True)
