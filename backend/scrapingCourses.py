from fastapi import FastAPI
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache for course data
courses_data = []

def scrape_courses_data():
    # Selenium setup
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=chrome_options)
    url = "https://www.biskamplified.com/programs/"
    driver.get(url)

    global courses_data
    courses_data = []

    try:
        # Wait for the program cards to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "program-card"))
        )
        courses = driver.find_elements(By.CLASS_NAME, "program-card")

        for course in courses:
            try:
                title = course.find_element(By.CLASS_NAME, "program-card__header").text
                university = course.find_element(By.CLASS_NAME, "name").text
                skills_elements = course.find_elements(By.CLASS_NAME, "tag-item")
                skills = [skill.text for skill in skills_elements]
                
                # Extract the "Learn More" link
                learn_more_element = course.find_element(By.CLASS_NAME, "program-card__footer--learn-more-btn")
                learn_more_link = learn_more_element.get_attribute("href")

                # Add course details to the list
                courses_data.append({
                    "title": title,
                    "university": university,
                    "skills": skills,
                    "learn_more_link": learn_more_link
                })
            except Exception as e:
                print(f"Error extracting course details: {e}")

    except Exception as e:
        print(f"Error locating program cards: {e}")
    finally:
        driver.quit()

@app.get("/api/courses")
def get_courses():
    if not courses_data:
        # If the course data is empty, scrape the data
        scrape_courses_data()
    
    return {"courses": courses_data}

# Run the server using:
# python -m uvicorn scrapingCourses:app --reload
