import random
import time
from selenium.webdriver.chrome.options import Options
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from flask import Flask, jsonify
from flask_cors import CORS
import threading

max_jobs=100
def fetchJobslinkedin(job_title,location):
    options = Options()
    options.binary_location = '/usr/bin/google-chrome'
    #options.headless = True 
    
 
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # Add proxy
    
    basic_url = "https://www.linkedin.com/"
    
    driver = uc.Chrome( options=options)
    all_jobs = []  # Store all scraped jobs

    try:
        driver.get(basic_url)

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/nav/ul/li[4]/a"))
        ).click()
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div[4]/div/div/section/button"))
        ).click()
        
        # Enter job title
        bb = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "job-search-bar-keywords"))
        )
        bb.clear()
        bb.send_keys(job_title + Keys.ENTER)
        
        time.sleep(1)
        
        # Enter location
        cc = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "job-search-bar-location"))
        )
        cc.clear()
        cc.send_keys(location )
        list_locations_id="job-search-bar-location-typeahead-list"
        cc1=WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, list_locations_id))
        )
        li_cc1 = cc1.find_elements(By.TAG_NAME, 'li')
        if len(li_cc1)>0:  # make sure list is not empty
            random_element = random.choice(li_cc1)  # ✅ cleaner
            random_element.click()
        else:
            button="/html/body/div[1]/header/nav/section/section[2]/form/button"
            cc_button=WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, button))
                )
            cc_button.click()
        cc_url=driver.current_url
        
        time.sleep(1)
        # Get job list
        
        try:
            jobs_class = 'jobs-search__results-list'
            job_container = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.CLASS_NAME,jobs_class))
            )
        except Exception as e:
            driver.get(cc_url)
            jobs_class = 'jobs-search__results-list'
            job_container = WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.CLASS_NAME,jobs_class))
            )


        jobs=job_container.find_elements(By.TAG_NAME, 'li')
        i=0
        for job in jobs:
            try:
                if(i >=max_jobs):
                    break
                title_job_offer = job.find_element(By.TAG_NAME, 'h3').text
                name_company = job.find_element(By.TAG_NAME, 'h4').text
                img_logo = job.find_element(By.TAG_NAME, 'img').get_attribute("src")

                job.click()
                current_url=driver.current_url
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, 'two-pane-serp-page__detail-view'))
                )

                # Expand description if needed
                try:
                    show_more_button = WebDriverWait(driver, 3).until(
                        EC.element_to_be_clickable((By.CLASS_NAME, "show-more-less-html__button"))
                    )
                    show_more_button.click()
                    time.sleep(1)
                except:
                    pass
                job_view=driver.find_element(By.CLASS_NAME, 'two-pane-serp-page__detail-view')
                if(img_logo == None):
                    img_logo=job_view.find_element(By.TAG_NAME, 'img').get_attribute("src")
                job_detail_text = driver.find_element(By.CLASS_NAME, 'two-pane-serp-page__detail-view').text

                # Store in list
                all_jobs.append({
                    "title": title_job_offer,
                    "company": name_company,
                    "logo_url": img_logo,
                    "description": job_detail_text ,
                    "link":current_url
                })

                i+=1
            except Exception as e:
                driver.delete_all_cookies()
                print(f"Error scraping job: {e}")

    finally:
        driver.quit()
    return all_jobs


app = Flask(__name__)
CORS(app)
def run_flask():
    app.run(host="0.0.0.0", port=5000, debug=False)
@app.route("/get_jobs/<job_title>/<location>", methods=['GET'])
def getJobs(job_title, location):
    jobs = fetchJobslinkedin(job_title, location)
    return jsonify(jobs)  # Return proper JSON instead of raw list

if __name__ == '__main__':
    
    t1 = threading.Thread(target=run_flask)
    
    t1.start()
    t1.join()