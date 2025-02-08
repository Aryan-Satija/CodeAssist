from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from nltk.stem.porter import PorterStemmer
import numpy as np
import pandas as pd
import pickle
import requests
from sklearn.metrics.pairwise import cosine_similarity
from django.views.decorators.csrf import csrf_exempt
import json

ps = PorterStemmer()

with open('../model/equivalent_rating_model.pkl', 'rb') as f:
    equivalent_rating_model = pickle.load(f)
    
with open('../model/dataset_ver_2.pkl', 'rb') as f:
    dataset = pickle.load(f)

with open('../model/model_ver_2.pkl', 'rb') as f:
    similarity = pickle.load(f)

with open('../model/vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

with open('../model/p_dataset_ver_3.pkl', 'rb') as f:
    p_dataset = pickle.load(f)

with open('../model/rating_predicting_model_new.pkl', 'rb') as f:
    rating_predictor = pickle.load(f)

with open('../model/codeforces_dataset.pkl', 'rb') as f:
    cf_dataset = pickle.load(f)

with open('../model/features.pkl', 'rb') as f:
    features = pickle.load(f)

with open('../model/cf_rating_predictor.pkl', 'rb') as f:
    prediction_model = pickle.load(f)

problems = list(map(lambda x: {
        "id": x[0],
        "is_premium": x[2],
        "title": x[3],
        "problem_description": x[4],
        "topic_tags": x[5].split() if isinstance(x[5], list) else [],
        "difficulty": x[6],
        "similar_questions": x[7][1:-1].split(',') if isinstance(x[7], str) else [],
        "solution": x[12],
        "likes": x[14],
        "dislikes": x[15],
        "problem_URL": x[16],
},  dataset.values.tolist()))

@csrf_exempt  
def test(request):
    message = json.loads(request.body).get('message')
    return JsonResponse({message: message})

def recommend(request, problem_id):
    try:
        problem_id = int(problem_id)
    except:
        return HttpResponse("Invalid problem id")
    ind = dataset[dataset['id'] == problem_id].index[0]
    recommended_indices = sorted(list(enumerate(similarity[ind])), key = lambda x : x[1], reverse = True)[1: 6]
    response = []
    for prob_ind in recommended_indices:
        x = dataset.loc[prob_ind[0]]
        response.append({
            "id": int(x.iloc[0]),
            "is_premium": bool(x.iloc[2]),
            "title": x.iloc[3],
            "problem_description": x.iloc[4],
            "difficulty": x.iloc[6],
            "solution": int(x.iloc[12]) if isinstance(x.iloc[12], int) else 0,
            "likes": int(x.iloc[14]) if isinstance(x.iloc[14], int) else 0,
            "dislikes": int(x.iloc[15]) if isinstance(x.iloc[15], int) else 0,
            "problem_URL": x.iloc[16],
        })   
    return JsonResponse(response, safe=False)

@csrf_exempt
def predict_eq(request):
    lc = json.loads(request.body).get('lc')
    cf = json.loads(request.body).get('cf')
    dbg = json.loads(request.body).get('dbg')
    mem = json.loads(request.body).get('mem')
    rsn = json.loads(request.body).get('rsn')
    pbm = json.loads(request.body).get('pbm')
    score = 0.7*cf + 0.2*lc + 0.1*pbm + dbg*20 + mem*10 + rsn*25
    return JsonResponse({'score': score})

def rating(request, handle_name):
    url = f"https://codeforces.com/api/user.rating?handle={handle_name}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        contests = data.get('result')
        if len(contests) < 9:
            return JsonResponse({
                'status': 400,
                'message': 'data insufficient',
                'forecast': []
            })
        contests = contests[-9:]
        ratings = []
        for contest in contests:
            ratings.append(contest['newRating'])
            
        ratings = ratings[-9:]
        response = []
        for _ in range(0, 5, 1):
            next_rating = prediction_model.predict([ratings])
            response.append(next_rating[0])
            ratings.pop(0)
            ratings.append(next_rating[0])
        
        return JsonResponse({
            'status': 200,
            'message': 'data sufficient',
            'forecast': response
        })
    except:
        return JsonResponse({
                'status': 400,
                'message': 'something went wrong',
                'forecast': []
            })

@csrf_exempt
def recommendFromText(request):
    try:
        tags = json.loads(request.body).get('tags', [])
        if not tags:
            return JsonResponse({"error": "No tags provided"}, status=400)
        
        filtered_tags = [" ".join(ps.stem(tag.lower()) for tag in tags)]

        new_entry = pd.DataFrame({"tags": filtered_tags}, index=[-1])
        extended_dataset = pd.concat([p_dataset, new_entry], ignore_index=True)

        vectors = vectorizer.transform(extended_dataset['tags'])
        simi = cosine_similarity(vectors[-1], vectors).flatten()

        top_indices = np.argsort(-simi)[1:6]
        response = []

        for index in top_indices:
            row = dataset.iloc[index]
            response.append({
                "id": int(row.get(0, -1)),
                "is_premium": bool(row.get(2, False)),
                "title": row.get(3, "Unknown"),
                "problem_description": row.get(4, "") if pd.notna(row.get(4)) else "",
                "difficulty": row.get(6, "Unknown"),
                "solution": int(row.get(12, 0)) if isinstance(row.get(12), int) else 0,
                "likes": int(row.get(14, 0)) if isinstance(row.get(14), int) else 0,
                "dislikes": int(row.get(15, 0)) if isinstance(row.get(15), int) else 0,
                "problem_URL": row.get(16, ""),
                "similarity": float(simi[index])
            })
        
        return JsonResponse(response, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def tagsPredictor(request):
    try:
        tags = json.loads(request.body).get('tags', '')
        if not tags:
            return JsonResponse({"error": "No tags provided"}, status=400)
        
        filtered_tags = " ".join(ps.stem(tag.lower()) for tag in tags.split())

        new_entry = pd.DataFrame({"tags": [filtered_tags]}, index=[-1])
        extended_dataset = pd.concat([p_dataset, new_entry], ignore_index=True)

        vectors = vectorizer.transform(extended_dataset['tags'])
        simi = cosine_similarity(vectors[-1], vectors).flatten()

        top_indices = np.argsort(-simi)[1:6]
        response = {}
        
        for index in top_indices:
            row = dataset.iloc[int(index)]
            response[int(index)] = {
                'certainty': float(simi[index]),
                'tags': row.iloc[5] if pd.notna(row.iloc[5]) else "Unknown"  
            }
            
        return JsonResponse(response)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def predict_my_rating(request, handle_name):
    def fetch_user_data(handle_name):
        url = "https://leetcode.com/graphql"
        query = """
        query {
            userContestRanking(username: "%s") {
                attendedContestsCount
                rating
                globalRanking
                totalParticipants
                topPercentage    
            }
            userContestRankingHistory(username: "%s") {
                attended
                trendDirection
                problemsSolved
                totalProblems
                finishTimeInSeconds
                rating
                ranking
                contest {
                    title
                    startTime
                }
            }
        }
        """ % (handle_name, handle_name)
        
        response = requests.post(url, json={'query': query})
        data = response.json()
        return data
    
    data = fetch_user_data(handle_name)
    try:
        contests = data['data']['userContestRankingHistory']
        ratings = []
        for contest in contests:
            if contest['attended'] == True:
                ratings.append(contest['rating'])
    
        if(len(ratings) < 5):
            return JsonResponse({'status': 400, 'message': 'Please participate in atleast 5 contests.'})
    
        ratings = ratings[-5:]

        forecast = []
        for i in range(0, 5, 1):
            next_rating = rating_predictor.predict([ratings])
            forecast.append(next_rating[0][0])
            ratings.pop(0)
            ratings.append(next_rating[0][0])

        return JsonResponse({
            'status': 200,
            'forecast': forecast,
            'user': data
        })
    except:
        return JsonResponse({'status': 400, 'message': 'User doesn\'t exist'})
