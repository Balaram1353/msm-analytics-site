# Project Documentation — MSM Analytics
**Balaram Naidu Chintala | Data Analyst**

---

## Project 1: Interactive Competitive Analysis Dashboard (Power BI)

### Project Overview
Developed an advanced Power BI dashboard enabling interactive analysis of companies, competitors, clusters, and products across multiple business metrics. The dashboard goes beyond a typical reporting tool by using dynamic filtering, custom button-driven interactions, and DAX-based calculations to create an application-like experience within Power BI.

### Objectives
- Compare companies across multiple business metrics
- Dynamically surface competitor companies based on selection
- Group companies into predefined clusters
- Build interactive visuals that respond intelligently to user selections
- Reduce manual filtering through automated dashboard interactions

### Dataset
Company name/ID, cluster ID, competitor relationships, product name/category, business metrics, year, date, and multiple KPI values.

### Technologies Used
Power BI Desktop, DAX, Power Query, Data Modeling, Interactive Visualizations

### Key Features
- **Dynamic cluster-based slicer** — selecting a company auto-displays all companies in its cluster
- **Competitor recommendation slicer** — auto-surfaces competitors of the selected company
- **Dynamic product filtering** — selecting a product filters related products in the same category
- **Default + optional company comparison** — 3 default companies shown, with buttons to add/remove optional companies (Company D, E)
- **Mixed line styles** — solid lines for default companies, dotted for optional ones, for visual clarity
- **Top N analysis** — dynamic ranking to surface top products/companies by selected metric
- **Year-based filtering** — simplified time slicers from full date fields
- **Interactive line charts** — synchronized comparison across companies, years, and metrics

### DAX & Modeling Concepts Applied
- **DAX functions:** CALCULATE(), FILTER(), SELECTEDVALUE(), ALL(), RANKX(), SWITCH(), variables (VAR), context transition
- **Data modeling:** one-to-many relationships, lookup/fact/bridge tables, star schema principles
- **Visual elements:** slicers, buttons, bookmarks, conditional formatting

### Challenges Solved
- Making slicers dependent on other slicers dynamically
- Showing a selected company alongside its competitors without manual filtering
- Filtering by cluster membership
- Building dynamic comparisons without duplicating visuals
- Managing filter context across multiple interacting visuals

### Outcome
Built a Power BI dashboard that behaves like a lightweight BI application rather than a static report — letting users explore company relationships, competitor networks, and performance metrics interactively.

---

## Project 2: Accident Causation Prediction using Bayesian Modeling (Tesla Pre-Accident Data)

### Project Overview
Analyzed Tesla pre-accident sensor/telemetry data to identify probable causes of accidents. Raw continuous variables (e.g., speed, and other pre-accident conditions) were transformed into binary indicators based on defined risk thresholds, then used to train a Bayesian model that outputs the probability of each candidate cause contributing to a given accident.

### Objective
Given the state of a vehicle just before an accident, estimate the likelihood that each of several candidate factors (e.g., excessive speed, and other contributing conditions) caused or contributed to the incident — rather than predicting a single deterministic cause.

### Approach

**1. Feature Engineering (Binarization)**
Continuous pre-accident variables were converted into binary flags using rule-based thresholds. For example:
- Speed ≥ 80 km/h → flagged as `1` (high-speed condition present), else `0`
- Similar threshold-based rules applied to other relevant pre-accident conditions

This converted a continuous, multi-condition dataset into a structured binary feature set suitable for probabilistic modeling.

**2. Model Training**
Trained a **Bayesian model** on the binarized dataset to learn the probabilistic relationships between the flagged conditions (potential causes) and accident occurrence.

**3. Inference**
For a given accident record, the model outputs a **probability score for each candidate cause** (e.g., probability that high speed was a contributing factor, probability that another flagged condition contributed), rather than a single hard classification — allowing multiple simultaneous contributing factors to be quantified.

### Technologies Used
Python, Pandas (data transformation), Bayesian modeling (probabilistic inference)

### Key Challenges Solved
- Defining meaningful, defensible thresholds to convert continuous sensor data into binary risk indicators
- Structuring multi-condition data so the Bayesian model could learn conditional dependencies between candidate causes
- Producing interpretable, per-cause probability outputs rather than a single opaque prediction — important for explainability in an accident-analysis context

### Skills Demonstrated
Data transformation & feature engineering, threshold-based rule design, probabilistic/Bayesian modeling, interpretability-focused model design

### Outcome
Built a model that, given pre-accident conditions, outputs the probability that each of several factors (e.g., high speed) contributed to the accident — supporting more nuanced, explainable causal analysis than a single-label classifier.

---

## Project 3: Vehicle Insurance Premium Prediction (Multi-State US Models)

### Project Overview
Built a premium prediction system for a client using US vehicle/policy data. Rather than a single nationwide model, separate models were trained for 3 individual high-volume states plus one general model covering all remaining US states, to better capture state-specific pricing patterns.

### Approach

**1. Data Cleaning & EDA**
Cleaned client-provided data and performed exploratory data analysis to understand distributions, relationships, and state-level variation in premium drivers.

**2. Model Training Strategy**
- Trained **4 separate models**: one each for 3 individual states with distinct enough patterns to warrant dedicated models, plus **1 general model** covering all other US states
- This state-segmented approach was chosen to account for regional differences in premium determinants (e.g., regulation, risk profiles) that a single unified model would average out

**3. Evaluation**
Model performance measured using **MAPE (Mean Absolute Percentage Error)**, with results ranging **19%–30%** across the 4 models.

### Technologies Used
Python, Pandas, EDA/visualization libraries, regression modeling (scikit-learn)

### Key Challenges Solved
- Deciding which states warranted dedicated models vs. a pooled "general" model
- Balancing per-state model accuracy against data volume available for each individual state
- Cleaning and reconciling client-provided data across states with potentially inconsistent formats/definitions

### Skills Demonstrated
Data cleaning, EDA, segmented/multi-model strategy design, regression modeling, model evaluation (MAPE)

### Outcome
Delivered a working premium prediction system with 4 trained models (3 state-specific + 1 general), achieving MAPE in the 19–30% range — providing the client with usable premium estimates segmented by geography.

---

## Notes for Future Resume/Portfolio Updates
- Consider adding **exact model type** used for Project 2 (e.g., Naive Bayes, Bayesian Network) once you confirm — strengthens the technical specificity
- For Project 3, if you have a baseline MAPE (e.g., from a single nationwide model) to compare against, that comparison would make a strong "impact" bullet
- All three projects show a progression: BI/visualization → probabilistic modeling → applied regression at production scale — worth framing that arc explicitly in your resume summary
