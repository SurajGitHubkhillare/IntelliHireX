import urllib.request
import json
import time

def check_endpoint(url, description):
    print(f"Testing {description} at {url}...")
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.status
            data = response.read().decode('utf-8')
            print(f"  [SUCCESS] {description} returned HTTP {status}")
            try:
                parsed = json.loads(data)
                print(f"  Snippet: {json.dumps(parsed)[:120]}")
            except:
                print(f"  Snippet: {data[:120]}")
            return True
    except Exception as e:
        print(f"  [FAILED] {description}: {e}")
        return False

def test_post_json(url, payload, description):
    print(f"\nTesting POST {description} at {url}...")
    try:
        data_bytes = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data_bytes, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.status
            res_data = response.read().decode('utf-8')
            print(f"  [SUCCESS] {description} returned HTTP {status}")
            parsed = json.loads(res_data)
            print(f"  Response Data: {json.dumps(parsed, indent=2)}")
            return True
    except Exception as e:
        print(f"  [FAILED] {description}: {e}")
        return False

if __name__ == "__main__":
    print("=== INTELLIHIREX SYSTEM INTEGRATION TEST ===\n")
    
    # 1. Test Python AI Microservice Root
    check_endpoint("http://localhost:8000/", "Python AI Microservice Root")
    
    # 2. Test Fake Job Prediction API
    fake_job_payload = {
        "title": "Work from Home Data Entry Clerk",
        "company": "Global Cash Transfer Ltd",
        "description": "Earn $1000 daily from home! Must have bank account to process wire transfers. Pay $50 registration fee via Western Union.",
        "requirements": "Must respond immediately on WhatsApp.",
        "has_company_logo": 0
    }
    test_post_json("http://localhost:8000/api/v1/predict-fake-job", fake_job_payload, "Python AI Fake Job Scanner")
    
    # 3. Test ATS Score API
    ats_payload = {
        "resume_text": "Experienced Java Developer with Spring Boot, SQL, REST APIs, Microservices, and React. Degree in Computer Science.",
        "job_description": "Seeking Java Backend Engineer proficient in Spring Boot, SQL, Microservices, and Docker."
    }
    test_post_json("http://localhost:8000/api/v1/calculate-ats-score", ats_payload, "Python AI ATS Score Calculator")

    # 4. Test Spring Boot Backend
    check_endpoint("http://localhost:8080/api/jobs", "Spring Boot Jobs API")

    # 5. Test React Frontend Dev Server
    check_endpoint("http://localhost:5173/", "React Frontend Dev Server")
